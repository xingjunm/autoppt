/* 本周结果填充：把 tools/run_lab.py 真实运行得到的数字填进页面，避免手抄。
   <b data-lab="mean"></b>  ← 取 window.LAB.nums.mean
   需要格式化的数字在 FMT 里写函数。没有数据时显示“—”。 */
(function () {
  const FMT = {
    mean: (v) => Number(v).toFixed(2),
  };
  document.addEventListener('DOMContentLoaded', () => {
    const N = window.LAB && window.LAB.nums;
    document.querySelectorAll('[data-lab]').forEach((el) => {
      const k = el.dataset.lab, v = N ? N[k] : undefined;
      el.textContent = v === undefined ? '—' : (FMT[k] ? FMT[k](v) : String(v));
    });
  });
})();
