/* 互动E：数据 × 算法 × 算力（示意） */
W1.reg('sliders', {
  init(el) {
    const root = el.closest('section') || el;
    const ins = Array.from(el.querySelectorAll('input[type=range]'));
    const bar = root.querySelector('.gauge i'), val = root.querySelector('.gauge-val'), msg = root.querySelector('.gauge-msg');
    const upd = () => {
      const v = ins.map((i) => +i.value);
      ins.forEach((i, k) => (i.parentElement.querySelector('output').textContent = ['很少', '较少', '中等', '较多', '很多'][v[k] - 1]));
      const idx = Math.round(100 * Math.pow((v[0] * v[1] * v[2]) / 125, 0.62));
      bar.style.width = idx + '%'; val.textContent = idx;
      const lo = v.indexOf(Math.min(...v));
      const name = ['数据', '算法', '算力'][lo];
      if (Math.min(...v) >= 4) msg.textContent = '三者都充足：这正是 2012 年之后深度学习、2020 年之后大模型快速进步的局面。';
      else if (Math.max(...v) - Math.min(...v) >= 3) msg.textContent = `短板在「${name}」：另外两项再强，整体也被它拖住——三者是相乘，不是相加。`;
      else msg.textContent = `目前「${name}」最弱。试着只把它调高一档，看看指数怎么变。`;
    };
    ins.forEach((i) => i.addEventListener('input', upd));
    el.__upd = upd; upd();
  },
  reset(el) { el.querySelectorAll('input[type=range]').forEach((i) => (i.value = 2)); el.__upd(); }
});
