/* 互动D：可点击 AI 时间轴 */
W1.reg('timeline', {
  init(el) {
    const nodes = Array.from(el.querySelectorAll('.node'));
    const det = el.querySelector('.tl-detail');
    const show = (i) => {
      nodes.forEach((n, j) => n.classList.toggle('on', i === j));
      el.__i = i;
      if (i < 0) { det.innerHTML = `<p class="tl-empty">点击时间轴上的节点，看看每一步“遇到了什么问题、突破了什么、带来了什么影响”。</p>`; return; }
      const d = nodes[i].dataset;
      det.innerHTML = `<div class="tl-y">${d.year}</div><h3>${d.title}</h3><dl><dt>问题</dt><dd>${d.q}</dd><dt>突破</dt><dd>${d.b}</dd><dt>影响</dt><dd>${d.i}</dd></dl>`;
    };
    nodes.forEach((n, i) => { n.type = 'button'; n.addEventListener('click', () => show(i)); });
    el.querySelector('[data-act=prev]').addEventListener('click', () => show(Math.max(0, (el.__i ?? 0) - 1)));
    el.querySelector('[data-act=next]').addEventListener('click', () => show(Math.min(nodes.length - 1, (el.__i ?? -1) + 1)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(Math.min(nodes.length - 1, (el.__i ?? -1) + 1)); nodes[el.__i].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(Math.max(0, (el.__i ?? 0) - 1)); nodes[el.__i].focus(); }
    });
    el.__show = show; show(-1);
  },
  reset(el) { el.__show(-1); }
});
