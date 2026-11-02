// 冒烟测试：node smoke_test.js <weekNN 文件夹>
// 打开三节课：无脚本错误；每个 data-comp 组件都已注册并初始化；小测全部答对后显示“答对 N 题”；
// 选择卡“看参考答案”后全部翻开；[data-lab] / [data-out] / .code[data-cell] 都有内容（脚本结果已填入）。
const { chromium } = require('playwright');
const path = require('path');
const root = path.resolve(process.argv[2] || '.');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  let fail = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };
  for (const f of ['lecture1', 'lecture2', 'lab1']) {
    const errs = []; p.removeAllListeners('pageerror'); p.on('pageerror', (e) => errs.push(e.message));
    p.removeAllListeners('console'); p.on('console', (m) => { if (m.type() === 'error' || /未注册组件/.test(m.text())) errs.push(m.text()); });
    await p.goto('file://' + path.join(root, f + '.html')); await p.waitForTimeout(2000);
    const r = await p.evaluate(() => {
      const comps = Array.from(document.querySelectorAll('[data-comp]'));
      const unreg = comps.filter((e) => !W1.comps[e.dataset.comp]).map((e) => e.dataset.comp);
      const quiz = Array.from(document.querySelectorAll('[data-comp=quiz]')).map((q) => { q.querySelectorAll('.q').forEach((x) => x.querySelectorAll('.opts button')[+x.dataset.answer].click()); return q.querySelector('.score').textContent; });
      const picks = Array.from(document.querySelectorAll('[data-comp=pick]')).map((x) => { x.querySelector('[data-act=open]').click(); return [x.querySelectorAll('.pk-card.done').length, x.querySelectorAll('.pk-card').length]; });
      const empty = Array.from(document.querySelectorAll('[data-lab],[data-out],.code[data-cell]')).filter((e) => !e.textContent.trim() || e.textContent.trim() === '—').length;
      const notes = Array.from(document.querySelectorAll('.reveal .slides > section')).filter((s) => !s.querySelector('aside.notes')).length;
      return { n: comps.length, unreg, quiz, picks, empty, notes, slides: Reveal.getTotalSlides() };
    });
    ok(errs.length === 0, `${f}：${r.slides} 页，无脚本错误 ${JSON.stringify(errs)}`);
    ok(r.unreg.length === 0, `${f}：${r.n} 个组件都已注册 ${r.unreg.join(',')}`);
    r.quiz.forEach((q) => ok(/答对 (\d+)/.test(q) && q.match(/已答 (\d+)/)[1] === q.match(/答对 (\d+)/)[1], `${f} 小测：${q}`));
    r.picks.forEach(([a, c]) => ok(a === c, `${f} 选择卡：${a} / ${c}`));
    ok(r.empty === 0, `${f}：脚本结果都已填入（空 ${r.empty} 处）`);
    ok(r.notes === 0, `${f}：每页都有教师备注（缺 ${r.notes} 页）`);
  }
  await b.close();
  process.exitCode = fail ? 1 : 0;
})();
