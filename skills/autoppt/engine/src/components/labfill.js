/* 实践课：把 tools/run_lab4.py 生成的代码、运行结果、图片填进幻灯片（保证三者出自同一次运行）
   <div class="code" data-cell="loop" data-from="3" data-to="12">  ← 显示该单元格第 3～12 行（从 1 数）
   <div class="term out" data-out="loop"></div>                      ← 该单元格的输出
   <img data-img="ring">                                             ← 该单元格画的第 1 张图
   逐行讲解：在 .code 上加 data-notes='{"5":["术语","解释"]}'（行号相对显示的第一行，从 1 数） */
(function () {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  document.addEventListener('DOMContentLoaded', () => {
    const L = window.LAB || window.LAB4; if (!L) return;
    document.querySelectorAll('.code[data-cell]').forEach((box) => {
      let lines = (L.code[box.dataset.cell] || '').split('\n');
      const a = +(box.dataset.from || 1), b = +(box.dataset.to || lines.length);
      lines = lines.slice(a - 1, b);
      const notes = box.dataset.notes ? JSON.parse(box.dataset.notes) : {};
      box.dataset.text = lines.join('\n');
      box.innerHTML = lines.map((t, i) => { const n = notes[i + 1]; return `<span class="ln"${n ? ` data-term="${esc(n[0])}" data-explain="${esc(n[1])}"` : ''}>${esc(t)}</span>`; }).join('');
      box.dataset.lang = 'py';
    });
    document.querySelectorAll('[data-out]').forEach((el) => {
      let t = L.out[el.dataset.out] || '';
      if (el.dataset.outLines) { const [a, b] = el.dataset.outLines.split('-').map(Number); t = t.split('\n').slice(a - 1, b).join('\n'); }
      el.textContent = t;
    });
    document.querySelectorAll('img[data-img]').forEach((im) => {
      const [k, n] = im.dataset.img.split(':'); const f = (L.img[k] || [])[+(n || 0)];
      if (f) im.src = (location.pathname.includes('/student/') ? '../' : '') + 'assets/img/new/' + f;
    });
    if (L.meta.backend && /shim/.test(L.meta.backend) && !location.pathname.includes('/student/')) {
      document.querySelectorAll('.reveal .slides > section').forEach((s) => { if (s.querySelector('[data-out],[data-cell]')) { const w = document.createElement('div'); w.className = 'backend-warn'; w.textContent = '教师提示：本页运行结果尚未用真实环境生成，课前请重新运行 tools/ 下的实践课脚本'; s.appendChild(w); } });
    }
  });
})();
