/* 互动B：规则 vs 学习（固定阈值规则 vs kNN, k=3） */
(function () {
  const L = 0, O = 1; // 0 柠檬, 1 橙子
  const INIT = [[80, .2, L], [150, .25, L], [160, .8, O], [220, .85, O]];
  const MORE = [[110, .3, L], [130, .75, O], [190, .3, L], [110, .65, O], [170, .38, L], [200, .7, O], [95, .15, L], [180, .9, O]];
  const TEST = [[130, .2, L], [200, .35, L], [85, .28, L], [160, .42, L], [120, .7, O], [150, .6, O], [230, .78, O], [95, .8, O]];
  const W = 500, H = 420, X0 = 60, X1 = 250; // 重量 60–250 克
  const sx = (w) => 40 + ((w - X0) / (X1 - X0)) * (W - 60), sy = (c) => H - 40 - c * (H - 70);
  const rule = (w) => (w >= 140 ? O : L);
  function knn(train, w, c) {
    const d = train.map((p) => [Math.hypot((p[0] - w) / 190, p[1] - c), p[2]]).sort((a, b) => a[0] - b[0]).slice(0, 3);
    return d.filter((x) => x[1] === O).length >= 2 ? O : L;
  }
  const C = { [L]: '#D9A400', [O]: '#D2551C' }, BG = { [L]: 'rgba(240,200,40,.18)', [O]: 'rgba(220,90,30,.16)' };
  const mark = (p, hollow) => {
    const x = sx(p[0]), y = sy(p[1]), col = C[p[2]];
    if (p[2] === O) return `<circle cx="${x}" cy="${y}" r="11" fill="${hollow ? '#fff' : col}" stroke="${col}" stroke-width="${hollow ? 4 : 2}"/>`;
    return `<path d="M${x} ${y - 13} L${x + 12} ${y + 9} L${x - 12} ${y + 9} Z" fill="${hollow ? '#fff' : col}" stroke="${col}" stroke-width="${hollow ? 4 : 2}"/>`;
  };
  function plot(svg, train, f, showBg, label) {
    let h = '';
    if (showBg) for (let gx = 40; gx < W - 20; gx += 16) for (let gy = 30; gy < H - 40; gy += 16) {
      const w = X0 + ((gx + 8 - 40) / (W - 60)) * (X1 - X0), c = (H - 40 - (gy + 8)) / (H - 70);
      h += `<rect x="${gx}" y="${gy}" width="16" height="16" fill="${BG[f(w, c)]}"/>`;
    }
    h += `<line x1="40" y1="${H - 40}" x2="${W - 10}" y2="${H - 40}" stroke="#1C1D21" stroke-width="2"/><line x1="40" y1="20" x2="40" y2="${H - 40}" stroke="#1C1D21" stroke-width="2"/>`;
    h += `<text x="${W - 12}" y="${H - 12}" text-anchor="end" font-size="18" fill="#4A4F5C">重量 →</text><text x="48" y="22" font-size="18" fill="#4A4F5C">颜色越橙 ↑</text>`;
    if (label === 'rule') h += `<line x1="${sx(140)}" y1="20" x2="${sx(140)}" y2="${H - 40}" stroke="#0B3D91" stroke-width="3" stroke-dasharray="8 6"/><text x="${sx(140) + 8}" y="48" font-size="18" fill="#0B3D91">重于 140 克 = 橙子</text>`;
    train.forEach((p) => (h += mark(p, false)));
    TEST.forEach((p) => {
      h += mark(p, true);
      if (f(p[0], p[1]) !== p[2]) h += `<text x="${sx(p[0]) + 14}" y="${sy(p[1]) - 10}" font-size="22" font-weight="700" fill="#B4471F">✕</text>`;
    });
    svg.innerHTML = h;
  }
  W1.reg('knn', {
    init(el) {
      el.__s = { n: 0, bg: true };
      const draw = () => {
        const train = INIT.concat(MORE.slice(0, el.__s.n));
        const fk = (w, c) => knn(train, w, c);
        plot(el.querySelector('svg.rule'), train, rule, el.__s.bg, 'rule');
        plot(el.querySelector('svg.learn'), train, fk, el.__s.bg, 'learn');
        const acc = (f) => TEST.filter((p) => f(p[0], p[1]) === p[2]).length;
        el.querySelector('.acc-rule').textContent = `${acc(rule)} / ${TEST.length}`;
        el.querySelector('.acc-learn').textContent = `${acc(fk)} / ${TEST.length}`;
        el.querySelector('.ntrain').textContent = train.length;
        const add = el.querySelector('[data-act=add]'); add.disabled = el.__s.n >= MORE.length; add.textContent = add.disabled ? '样本已加完' : '添加样本';
        el.querySelector('[data-act=bg]').setAttribute('aria-pressed', el.__s.bg);
      };
      el.querySelector('[data-act=add]').addEventListener('click', () => { el.__s.n = Math.min(MORE.length, el.__s.n + 1); draw(); });
      el.querySelector('[data-act=bg]').addEventListener('click', () => { el.__s.bg = !el.__s.bg; draw(); });
      el.__draw = draw; draw();
    },
    reset(el) { el.__s = { n: 0, bg: true }; el.__draw(); }
  });
})();
