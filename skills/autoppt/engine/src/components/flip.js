/* 互动A：哪些算 AI？翻牌卡 */
W1.reg('flip', {
  init(el) {
    el.querySelectorAll('.flip').forEach((c) => {
      c.setAttribute('role', 'button'); c.tabIndex = 0;
      const t = () => { c.classList.toggle('open'); c.setAttribute('aria-pressed', c.classList.contains('open')); };
      c.addEventListener('click', t);
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
    const all = el.querySelector('[data-act=all]');
    if (all) all.addEventListener('click', () => el.querySelectorAll('.flip').forEach((c) => c.classList.add('open')));
  },
  reset(el) { el.querySelectorAll('.flip').forEach((c) => { c.classList.remove('open'); c.setAttribute('aria-pressed', 'false'); }); }
});
