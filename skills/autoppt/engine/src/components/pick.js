/* 通用选择卡：<div data-comp="pick" data-src="APPS6">，数据 window.APPS6 = {opts:[[key,文字,颜色类]], items:[{t, img, a, why}]} */
(function () {
  W1.reg('pick', {
    init(el) {
      const D = window[el.dataset.src], grid = el.querySelector('.pk-grid'), score = el.querySelector('.pk-score');
      const lab = Object.fromEntries(D.opts.map((o) => [o[0], o]));
      const base = W1.k6.base();
      grid.innerHTML = D.items.map((d, i) => `<div class="pk-card" data-i="${i}">${d.img ? `<div class="pk-img"><img src="${base}${d.img}" alt=""></div>` : ''}<p class="pk-t">${d.t}</p>
        <div class="pk-opts">${D.opts.map(([k, t, c]) => `<button type="button" class="pk-b ${c}" data-k="${k}">${t}</button>`).join('')}</div>
        <div class="pk-back"><span class="pk-v ${lab[d.a][2]}">${lab[d.a][1]}</span><span class="pk-me"></span><p>${d.why}</p></div></div>`).join('');
      const upd = () => { const n = grid.querySelectorAll('.pk-card[data-pick]').length, ok = grid.querySelectorAll('.pk-card.same').length; score.textContent = n ? `已选 ${n} / ${D.items.length}，与参考答案一致 ${ok} 个` : `共 ${D.items.length} 张卡片：先选，再看参考答案`; };
      grid.addEventListener('click', (e) => {
        const b = e.target.closest('.pk-b'); if (!b) return;
        const c = b.closest('.pk-card'); if (c.classList.contains('done')) return;
        const d = D.items[+c.dataset.i]; c.dataset.pick = b.dataset.k;
        c.classList.add('done', b.dataset.k === d.a ? 'same' : 'diff');
        c.querySelector('.pk-me').textContent = b.dataset.k === d.a ? '一致' : `你选了“${lab[b.dataset.k][1]}”`;
        upd();
      });
      el.querySelector('[data-act=open]').addEventListener('click', () => { grid.querySelectorAll('.pk-card').forEach((c) => c.classList.add('done')); upd(); });
      el.__upd = upd; upd();
    },
    reset(el) { el.querySelectorAll('.pk-card').forEach((c) => { c.classList.remove('done', 'same', 'diff'); delete c.dataset.pick; c.querySelector('.pk-me').textContent = ''; }); el.__upd(); }
  });
})();
