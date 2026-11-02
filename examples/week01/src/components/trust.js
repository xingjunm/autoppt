/* 互动F：你会相信 AI 吗？（本机计数，非真实统计） */
W1.reg('trust', {
  init(el) {
    const cs = Array.from(el.querySelectorAll('.case'));
    const show = (i) => { el.__i = i; cs.forEach((c, j) => (c.hidden = i !== j)); el.querySelector('.case-no').textContent = `情境 ${i + 1} / ${cs.length}`; };
    cs.forEach((c) => {
      c.querySelectorAll('.vote').forEach((b) => {
        b.type = 'button';
        b.addEventListener('click', () => { const n = b.querySelector('.n'); n.textContent = +n.textContent + 1; });
      });
      c.querySelector('[data-act=advice]').addEventListener('click', () => c.classList.add('revealed'));
    });
    el.querySelector('[data-act=prev]').addEventListener('click', () => show(Math.max(0, el.__i - 1)));
    el.querySelector('[data-act=next]').addEventListener('click', () => show(Math.min(cs.length - 1, el.__i + 1)));
    el.__show = show; show(0);
  },
  reset(el) { el.querySelectorAll('.case').forEach((c) => { c.classList.remove('revealed'); c.querySelectorAll('.n').forEach((n) => (n.textContent = '0')); }); el.__show(0); }
});
