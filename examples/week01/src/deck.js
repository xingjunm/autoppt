/* 课件外壳：Reveal 配置、页眉页脚注入、互动组件注册与重置 */
(function () {
  const W1 = (window.W1 = window.W1 || { comps: {} });
  W1.reg = function (name, impl) { W1.comps[name] = impl; };
  W1.store = {
    get(k, d) { try { const v = sessionStorage.getItem('w1:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem('w1:' + k, JSON.stringify(v)); } catch (e) {} }
  };

  function chrome() {
    const deck = document.querySelector('.reveal');
    const course = deck.dataset.course || '人工智能基础　第 1 周';
    const slides = Array.from(document.querySelectorAll('.reveal .slides > section'));
    slides.forEach((s, i) => {
      if (s.classList.contains('no-chrome-all')) return;
      if (!s.querySelector('.chrome-top') && !s.classList.contains('m-cover') && !s.classList.contains('m-section')) {
        const t = document.createElement('div');
        t.className = 'chrome-top';
        const part = s.dataset.part || '';
        const [p, sub] = part.split('|');
        t.innerHTML = `<span class="part">${p || ''}${sub ? `<i>${sub}</i>` : ''}</span><span>${course}</span>`;
        s.prepend(t);
      }
      if (!s.querySelector('.chrome-foot')) {
        const f = document.createElement('div');
        f.className = 'chrome-foot';
        f.innerHTML = `<span class="src">${s.dataset.src ? '图片来源：' + s.dataset.src : ''}</span><span class="pg">${String(i + 1).padStart(2, '0')}</span>`;
        s.appendChild(f);
      }
    });
  }

  function initComps(root) {
    root.querySelectorAll('[data-comp]').forEach((el) => {
      if (el.__w1) return;
      const c = W1.comps[el.dataset.comp];
      if (!c) { console.warn('未注册组件', el.dataset.comp); return; }
      el.__w1 = true;
      try { c.init(el); } catch (e) { console.error(e); }
    });
  }
  function resetSlide(sl) {
    if (!sl) return;
    sl.querySelectorAll('[data-comp]').forEach((el) => { const c = W1.comps[el.dataset.comp]; if (c && c.reset) c.reset(el); });
  }
  W1.resetCurrent = () => resetSlide(Reveal.getCurrentSlide());


  /* ---------- 自动填充版面（autofit） ----------
     内容区（.body / .stage / .st）若下方留白过多，就整体等比放大：把盒子宽度缩为 W/s 让文字重新排版，
     再用 transform: scale(s) 放回原宽度。这样字号、图片一起变大，不会横向溢出。
     测量时会把各种状态（Windows/macOS、错误/修正、测验解析等）都考虑进去，取最坏情况。
     单页关闭：在 <section> 上加 data-fit="off"；单个盒子关闭：在盒子上加 data-fit="off"。 */
  const FIT = { max: 1.42, maxSt: 1.5, min: 1.04, floor: 968, gap: 48 };
  const STATES = [
    (on) => { document.documentElement.dataset.os = on ? 'mac' : 'win'; },
    (on, sl) => sl.querySelectorAll('.errdemo').forEach((e) => e.classList.toggle('fixed', on))
  ];
  function textRects(box) {
    const out = [];
    const w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(n) {
        if (n.nodeType === 1) {
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || n.matches('aside,.vid-layer,.reset-btn')) return NodeFilter.FILTER_REJECT;
          return /^(IMG|svg|CANVAS|VIDEO|INPUT|SELECT|TEXTAREA)$/.test(n.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
        return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    let n;
    while ((n = w.nextNode())) {
      let r;
      if (n.nodeType === 3) { const rg = document.createRange(); rg.selectNodeContents(n); r = rg.getBoundingClientRect(); }
      else { r = n.getBoundingClientRect(); w.currentNode = n; }
      if (r.width > 0.5 && r.height > 0.5) out.push({ r, clip: n.nodeType === 3 ? n.parentElement.closest('.code,.term,.mock,.out,pre') : null });
    }
    return out;
  }
  // 独立成块的短标题、短标签、大字金句：放大后不能比原来多折行（折行最难看）
  function shortBlocks(box) {
    if (box.__sb) return box.__sb;
    const out = [];
    box.querySelectorAll('h1,h2,h3,h4,b,strong,div,span,p,li,label,a,button').forEach((e) => {
      const cs = getComputedStyle(e);
      if (cs.whiteSpace.indexOf('pre') >= 0) return;
      const t = e.textContent.trim(); if (!t) return;
      const fs = parseFloat(cs.fontSize), fw = +cs.fontWeight;
      if (cs.display === 'inline' && fs < 40) return; // 段落里的普通加粗词可以随段落折行
      if (Array.from(e.children).some((c) => getComputedStyle(c).display !== 'inline' && !/^(BR)$/.test(c.tagName))) return;
      if ((t.length <= 18 && (fs >= 33 || fw >= 700)) || fs >= 60) out.push(e);
    });
    return (box.__sb = out);
  }
  function lineCount(e) {
    const rg = document.createRange(); rg.selectNodeContents(e);
    return new Set(Array.from(rg.getClientRects()).filter((q) => q.height > 4).map((q) => Math.round(q.bottom / 6))).size;
  }
  function measure(sl, box, k) {
    let top = 1e9, bot = -1e9, bad = 0, lines = 0;
    const br = box.getBoundingClientRect();
    const right = (br.right) / k;
    // 绝对定位的小按钮（如“复制”）不能压住文字
    const btns = Array.from(box.querySelectorAll('button')).filter((b) => getComputedStyle(b).position === 'absolute').map((b) => b.getBoundingClientRect());
    shortBlocks(box).forEach((e) => { if (e.offsetParent !== null) lines += lineCount(e); });
    textRects(box).forEach(({ r, clip }) => {
      top = Math.min(top, r.top / k); bot = Math.max(bot, r.bottom / k);
      if (r.right / k > right + 2) bad++;
      if (clip) { const c = clip.getBoundingClientRect(); if (r.right > c.right + 2 || r.bottom > c.bottom + 2) bad++; }
      if (btns.some((q) => r.left < q.right - 1 && r.right > q.left + 1 && r.top < q.bottom - 1 && r.bottom > q.top + 1) && !btns.some((q) => q.left <= r.left && q.right >= r.right)) bad++;
    });
    return { top, bot, bad, lines };
  }
  function worst(sl, box, k) {
    let m = { top: 1e9, bot: -1e9, bad: 0, lines: 0 };
    const combos = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const os0 = document.documentElement.dataset.os;
    const err0 = Array.from(sl.querySelectorAll('.errdemo')).map((e) => e.classList.contains('fixed'));
    document.documentElement.classList.add('w1-measure');
    combos.forEach(([a, b]) => {
      STATES[0](a, sl); STATES[1](b, sl);
      const x = measure(sl, box, k);
      m = { top: Math.min(m.top, x.top), bot: Math.max(m.bot, x.bot), bad: Math.max(m.bad, x.bad), lines: Math.max(m.lines, x.lines) };
    });
    document.documentElement.classList.remove('w1-measure');
    document.documentElement.dataset.os = os0;
    sl.querySelectorAll('.errdemo').forEach((e, i) => e.classList.toggle('fixed', err0[i]));
    return m;
  }
  function fitSlide(sl) {
    if (sl.dataset.fit === 'off' || sl.classList.contains('m-cover') || sl.classList.contains('m-section')) return;
    const disp = sl.style.display; sl.style.display = 'block';
    const k = sl.getBoundingClientRect().width / 1920 || 1;
    const boxes = Array.from(sl.children).filter((c) => c.matches('.body,.stage,.st') && c.dataset.fit !== 'off');
    boxes.forEach((box) => {
      const isSt = box.classList.contains('st');
      const sr = sl.getBoundingClientRect();
      const b0 = box.getBoundingClientRect();
      const bTop = box.offsetTop;
      // 下边界：页脚线之上；若下面还有别的元素（如结论句），则在它上面
      let floor = FIT.floor;
      Array.from(sl.children).forEach((c) => {
        if (c === box || c.matches('.chrome-top,.chrome-foot,aside,.reset-btn,.w1-nav') || boxes.includes(c)) return;
        const r = c.getBoundingClientRect(); const t = c.offsetTop; // offsetTop 不受“逐步出现”的位移动画影响
        const overlapX = r.left < b0.right && r.right > b0.left;
        if (overlapX && t > bTop + 60 && r.height > 1) floor = Math.min(floor, t - FIT.gap);
      });
      const ceil = isSt ? 150 : bTop - 30;
      const W = box.offsetWidth, H0 = box.offsetHeight;
      // 盒子本身（含撑满高度的卡片底色）也不能越过下边界
      const H = isSt ? H0 : Math.min(H0, floor - bTop);
      const base = worst(sl, box, k);
      const rel = (v) => v - sr.top / k;
      if (!isFinite(base.bot)) return;
      const orig = box.getAttribute('style') || '';
      const ok = (s) => {
        box.setAttribute('style', orig);
        box.style.width = W / s + 'px'; box.style.height = H / s + 'px'; box.style.right = 'auto'; box.style.bottom = 'auto';
        box.style.transformOrigin = '0 0'; box.style.transform = `scale(${s})`;
        const m = worst(sl, box, k);
        const pass = rel(m.bot) <= floor && rel(m.top) >= ceil && m.bad <= base.bad && m.lines <= base.lines;
        if (window.W1_FITDBG && !pass) console.log('fit', sl.getAttribute('aria-label') || '', s.toFixed(2), JSON.stringify({ bot: Math.round(rel(m.bot)), floor: Math.round(floor), top: Math.round(rel(m.top)), ceil: Math.round(ceil), bad: m.bad, b0: base.bad, lines: m.lines, l0: base.lines }));
        return { pass, m };
      };
      const clear = () => { if (orig) box.setAttribute('style', orig); else box.removeAttribute('style'); };
      if (rel(base.bot) > floor - 40) return; // 已经够满
      let lo = 1, hi = isSt ? FIT.maxSt : FIT.max;
      if (!ok(lo + 0.02).pass) { clear(); return; }
      for (let i = 0; i < 9; i++) { const mid = (lo + hi) / 2; if (ok(mid).pass) lo = mid; else hi = mid; }
      if (lo < FIT.min) { clear(); return; }
      const s = Math.floor(lo * 100) / 100;
      const fin = ok(s).m;
      // 放大到上限后仍有大片留白：把内容往下挪一半，使其在可用区域内居中
      let dy = 0;
      if (!isSt) { const left = floor - rel(fin.bot); if (left > 60) dy = Math.min(left / 2, 110); }
      box.style.transform = `translateY(${dy}px) scale(${s})`;
      box.dataset.fitScale = s;
    });
    sl.style.display = disp;
  }
  W1.autofit = function () {
    document.querySelectorAll('.reveal .slides > section').forEach(fitSlide);
    if (window.Reveal && Reveal.layout) Reveal.layout();
  };


  /* ---------- 可选网络图片 ----------
     <div class="opt"> 里放 <img class="opt-img" data-credit="…"> 和备用的 .opt-fb（通常是 SVG 示意）。
     图片文件存在就显示图片并在页脚写来源；不存在（还没运行 tools/fetch_web_images.py）就显示备用示意。 */
  function optImages() {
    document.querySelectorAll('.opt').forEach((box) => {
      const imgs = Array.from(box.querySelectorAll('img.opt-img'));
      if (!imgs.length) return;
      const done = () => {
        const ok = imgs.every((i) => i.complete && i.naturalWidth > 0);
        const fail = imgs.some((i) => i.complete && !i.naturalWidth);
        if (!ok && !fail) return;
        box.classList.toggle('has-img', ok); box.classList.toggle('no-img', !ok);
        const sl = box.closest('section'); const credit = imgs[0].dataset.credit;
        if (ok && sl && credit) { const f = sl.querySelector('.chrome-foot .src'); if (f && !f.textContent) f.textContent = '图片来源：' + credit; }
      };
      imgs.forEach((i) => { i.addEventListener('load', done); i.addEventListener('error', done); });
      done();
    });
  }

  // 互动控件或输入框聚焦时，方向键/空格交给控件，不翻页
  const NAV = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', 'End'];
  function keyOk(e) {
    const t = document.activeElement;
    if (!t || t === document.body) return true;
    const inComp = /INPUT|TEXTAREA|SELECT/.test(t.tagName) || (t.closest && t.closest('[data-comp]'));
    return !(inComp && e && NAV.includes(e.key));
  }

  // 三节课之间切换、返回首页：鼠标移动时在底部中间浮现，静止 2.5 秒后自动隐藏
  function navBar() {
    if (/print-pdf/.test(location.search)) return;
    const here = (location.pathname.split('/').pop() || 'index.html');
    const items = [['index.html', '⌂ 首页'], ['lecture1.html', '理论一'], ['lecture2.html', '理论二'], ['lab1.html', '实践课']];
    const nav = document.createElement('nav');
    nav.className = 'w1-nav';
    nav.setAttribute('aria-label', '课件导航');
    nav.innerHTML = items.map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a>`).join('');
    document.body.appendChild(nav);
    let timer;
    const show = () => { nav.classList.add('show'); clearTimeout(timer); timer = setTimeout(() => { if (!nav.matches(':hover') && !nav.contains(document.activeElement)) nav.classList.remove('show'); }, 2500); };
    document.addEventListener('mousemove', show);
    nav.addEventListener('focusin', show);
    show();
  }

  document.addEventListener('DOMContentLoaded', () => {
    chrome();
    optImages();
    // 每页的「重置」按钮
    document.querySelectorAll('.reveal .slides > section').forEach((s) => {
      if (s.querySelector('[data-comp]') && !s.querySelector('.reset-btn') && !s.dataset.noreset) {
        const b = document.createElement('button');
        b.className = 'btn ghost sm reset-btn';
        b.type = 'button';
        b.textContent = '重置（R）';
        b.addEventListener('click', () => resetSlide(s));
        // 有功能按钮组时，重置按钮紧跟在功能按钮右边；否则放在页面右下角
        const groups = Array.from(s.querySelectorAll('.btns')).filter((g) => g.querySelector('button'));
        if (groups.length) { b.classList.add('inline'); groups[groups.length - 1].appendChild(b); }
        else s.appendChild(b);
      }
    });
    navBar();
    const plugins = [];
    if (window.RevealNotes) plugins.push(RevealNotes);
    if (window.RevealHighlight) plugins.push(RevealHighlight);
    Reveal.initialize({
      width: 1920, height: 1080, margin: 0, minScale: 0.1, maxScale: 3,
      center: false, hash: true, history: false, controls: false, progress: true,
      slideNumber: false, transition: 'fade', backgroundTransition: 'fade', transitionSpeed: 'default',
      pdfSeparateFragments: false, showNotes: false, plugins,
      keyboardCondition: keyOk,
      keyboard: { 82: () => W1.resetCurrent(), 72: () => { location.href = 'index.html'; } }
    }).then(() => {
      initComps(document);
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => W1.autofit());
      document.querySelectorAll('.reveal .slides > section').forEach((s, i) => s.setAttribute('aria-label', `第 ${i + 1} 页`));
    });
    Reveal.on('slidechanged', (e) => {
      document.querySelectorAll('video[data-autopause]').forEach((v) => v.pause());
    });
  });
})();
