// 逐页截图：node shoot.js <deck.html> <输出文件夹> [页码列表，如 1,5,12]
// 需要 playwright（npm i -D playwright 或全局安装后用 NODE_PATH=$(npm root -g) 运行）
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const [, , file, out, list] = process.argv;
if (!file || !out) { console.error('用法：node shoot.js <deck.html> <输出文件夹> [1,2,3]'); process.exit(2); }
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(2500);
  const n = await p.evaluate(() => Reveal.getTotalSlides());
  const idx = list ? list.split(',').map(Number) : [...Array(n).keys()].map((i) => i + 1);
  for (const i of idx) {
    await p.evaluate((i) => { Reveal.slide(i - 1); Reveal.getCurrentSlide().querySelectorAll('.fragment').forEach((e) => e.classList.add('visible')); }, i);
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${out}/${String(i).padStart(2, '0')}.png` });
  }
  console.log('页数', n, '脚本错误', JSON.stringify(errs));
  await b.close();
  if (errs.length) process.exitCode = 1;
})();
