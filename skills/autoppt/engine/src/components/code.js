/* 互动G-3：复制代码；逐行讲解；G-4 错误演示；G-5 代码对比 */
(function () {
  function copyText(t, btn) {
    const done = () => { const o = btn.textContent; btn.textContent = '已复制 ✓'; setTimeout(() => (btn.textContent = o), 1600); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(done, fb); else fb();
    function fb() { const a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = '请手动复制'; } a.remove(); }
  }
  function addCopy(box) {
    if (box.querySelector('.copy')) return;
    const b = document.createElement('button'); b.className = 'btn sm copy'; b.type = 'button'; b.textContent = '复制';
    b.addEventListener('click', (e) => { e.stopPropagation(); copyText(box.dataset.text || box.innerText.replace(/复制$/, '').trim(), b); });
    box.appendChild(b);
  }
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.code[data-copy], .copyable').forEach(addCopy));
  W1.copyText = copyText;

  W1.reg('lines', {
    init(el) {
      const lines = el.querySelectorAll('.code .ln'), exp = el.querySelector('.explain');
      const marks = Array.from(lines).map((l, i) => (l.dataset.explain ? i : -1)).filter((i) => i >= 0);
      const show = (k) => {
        el.__k = k;
        lines.forEach((l, i) => { l.classList.toggle('on', k >= 0 && i === marks[k]); l.classList.toggle('dim', k >= 0 && !(l.dataset.group && l.dataset.group === lines[marks[k]].dataset.group) && i !== marks[k]); });
        if (k < 0) { exp.innerHTML = '<p class="muted">按“下一行”，逐行看看这段代码在做什么。</p>'; return; }
        const l = lines[marks[k]]; exp.innerHTML = `<div class="ex-k">${l.dataset.term || ''}</div><p>${l.dataset.explain}</p>`;
      };
      el.querySelector('[data-act=next]').addEventListener('click', () => show(Math.min(marks.length - 1, el.__k + 1)));
      el.querySelector('[data-act=prev]').addEventListener('click', () => show(Math.max(-1, el.__k - 1)));
      el.__show = show; show(-1);
    },
    reset(el) { el.__show(-1); }
  });

  W1.reg('errdemo', {
    init(el) {
      const b = el.querySelector('[data-act=fix]');
      b.dataset.label = b.textContent;
      b.addEventListener('click', () => { el.classList.toggle('fixed'); b.textContent = el.classList.contains('fixed') ? '再看一次错误' : b.dataset.label; });
    },
    reset(el) { el.classList.remove('fixed'); const b = el.querySelector('[data-act=fix]'); b.textContent = b.dataset.label || b.textContent; }
  });

  W1.reg('diff', {
    init(el) {
      const b = el.querySelector('[data-act=show]');
      b.addEventListener('click', () => { el.classList.add('shown'); b.disabled = true; });
    },
    reset(el) { el.classList.remove('shown'); el.querySelector('[data-act=show]').disabled = false; }
  });
})();
/* 极简 Python 语法着色（离线，无依赖） */
(function () {
  const KW = /\b(if|else|elif|for|while|in|def|return|import|from|as|True|False|None|and|or|not)\b/g;
  const BI = /\b(print|sum|len|round|max|min|range|input|int|float|str|type)\b(?=\()/g;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function hl(line) {
    // 拆出注释与字符串，避免误着色
    const out = []; let i = 0; let buf = '';
    const flush = () => { if (buf) { out.push(esc(buf).replace(KW, '<span class="hljs-keyword">$1</span>').replace(BI, '<span class="hljs-built_in">$1</span>').replace(/\b(\d+(\.\d+)?)\b/g, '<span class="hljs-number">$1</span>')); buf = ''; } };
    while (i < line.length) {
      const ch = line[i];
      if (ch === '#') { flush(); out.push('<span class="hljs-comment">' + esc(line.slice(i)) + '</span>'); i = line.length; break; }
      if (ch === '"' || ch === "'") { flush(); const j = line.indexOf(ch, i + 1); const end = j < 0 ? line.length : j + 1; out.push('<span class="hljs-string">' + esc(line.slice(i, end)) + '</span>'); i = end; continue; }
      buf += ch; i++;
    }
    flush(); return out.join('');
  }
  W1.hlPy = hl;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lang=py]').forEach((box) => {
      const lines = box.querySelectorAll('.ln');
      if (!box.dataset.text) box.dataset.text = Array.from(lines).map((l) => l.textContent).join('\n');
      lines.forEach((l) => (l.innerHTML = hl(l.textContent) || '&nbsp;'));
    });
  });
})();
