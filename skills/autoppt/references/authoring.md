# 写幻灯片（HTML 结构、页型、版式规矩）

画布固定 **1920×1080**（Reveal.js 5，本地文件，离线可用）。`src/deck.js` 负责：页眉页脚、页码、自动放大（autofit）、组件注册与重置、底部三节课切换栏、快捷键（R 重置、H 首页、S 演讲者视图）。

## 风格（主题）
样式分三层：`tokens.css`（颜色、字体变量）→ `masters.css` / `components.css` / `extras.css`（页型与积木）→ `theme.css`（风格覆盖，最后加载）。
三种风格在 `src/styles/themes/`：`academic.css`（A 学术刊物，默认）、`stage.css`（B 黑底舞台）、`blocks.css`（C 几何色块）。
写页面时**不要写死颜色**，用变量（`var(--blue)`、`var(--rust)`、`var(--ink-2)`……）和现成的 class，这样换风格时页面自动跟着变。B 风格的封面、章节页、大字页是深色：这些页里自绘 SVG 的底色用透明或 `var(--paper-2)` 以外的深色，或者检查一下截图。

## 一页的骨架
```html
<!-- L1-05 简短说明（方便搜索） -->
<section data-part="第一部分|副标题" data-src="资料来源：作者，“标题”，会议 年份">
  <h2 class="title">整句标题：说出这一页的结论</h2>
  <div class="body grid" style="grid-template-columns:1fr 1.1fr;gap:56px;top:280px">
    …
  </div>
  <aside class="notes">
    <p>【建议用时】2分钟</p>
    <p>【本页目标】……</p>
    <p>【讲述建议】完整讲稿：教师照着念也能讲好。</p>
    <p>【互动提问】……</p>
    <p>【预期回答】……</p>
    <p>【演示操作】……（互动页必写）</p>
    <p>【易错点】……</p>
    <p>【转场】……</p>
  </aside>
</section>
```
- `data-part`：页眉左侧的部分名，`|` 后是灰色副标题（互动页写“互动”）。
- `data-src`：页脚出处。文字出处以“资料来源：”开头；否则显示为“图片来源：…”。
- `【建议用时】` 被 build.py 汇总成教师指南的分钟级安排（三节课各约 38–42 分钟，留机动时间）。
- 学生版会自动去掉 `<aside class="notes">` 和 `class="… teacher-only"` 的按钮。

## 页型（engine/lecture1.html 里每种都有样板）
| 页型 | 写法 | 用途 |
|---|---|---|
| 封面 | `<section class="m-cover">`：`.cv-l`（`.cv-k` 课程 / 周次、`h1`、`.cv-sub`）+ `.cv-r` 三个 `.strip-item`（自绘 SVG + 文字）+ `.cv-who` | 每节课第 1 页 |
| 章节页 | `<section class="m-section">`：`.sec-wrap`（`.sec-k`、`h2`、`.sec-q`）+ `.sec-art`（满高 SVG） | 每部分开头 |
| 大字开场 | `<section class="m-statement">`：`.st > .big + .cap`，右侧可放 `.grid g2` 卡片 | 开场提问、金句 |
| 内容页 | `h2.title` + `.body`（`style="top:…px"`） | 大多数页 |
| 互动页 | `<section class="m-interact">` + `<div class="stage" data-comp="组件名">` | 浏览器里真实计算 |

常用积木（`components.css`、`extras.css`）：
- 卡片：`.box5` + 颜色 `blue / mid / ok / no`，内放 `h3`、`p`、`ul`。
- 栅格：`.grid g2 / g3 / g4`，或 `style="grid-template-columns:1fr 1.2fr"`（**用比例列，不用固定 px**）。
- 流程：`.flow14 > div(.a/.r/.t) > b + span`，自动加箭头。
- 表格：`<table class="tbl11">`，重点行 `tr.hl`。
- 要点：`ul.pts.single > li.fragment.rise > span`（逐条出现）。
- 公式 / 代码块：`.code`（`copyable` 带复制按钮）、`.term.out`（终端输出）。
- 大数字：`.kp-r > span + b + em`。
- 自绘图：`<div class="svgbox" style="height:420px"><svg viewBox="0 0 760 420">…</svg></div>`。

## 版式规矩（都是踩过的坑）
1. **每页一个核心观点**；整句标题直接说结论；正文同时可见的文字一般不超过 60–80 个汉字，多了拆页或逐步出现。
2. autofit 会把内容整体放大填满版面。页面底部绝对定位的说明会被放大的内容压住——放进同一个 `.body` 的文档流里。
3. **代码页一律 `data-fit="off"`**；代码行 ≤ 86 列（中文算 2 列），长代码用 `data-from / data-to` 只显示关键行。
4. 互动页内容多时加 `data-fit="off"`，并把 `.stage` 的 `top` 设在标题下方（约 236–250px），否则会被放大到顶住标题。
5. 固定 px 的 grid 列会把 `1fr` 挤没；一律用比例列。
6. 新组件的 class 用独有前缀（如 `ax-`、`bd-`）；**不要定义 `.ok / .bad / .blue / .r` 这类通用名**——会污染 `.box5.ok` 等现有样式。需要时写成 `.ax-st .ok`。
7. 条形图里的文字用 flex 垂直居中、`line-height:1`，否则继承的行高会把文字挤出条形。
8. 选择卡选项多时用 `pk-big` 和较少的列。
9. 图片：优先自绘 SVG、脚本生成的图、浏览器现场计算；第三方图片必须登记来源（`week.json` 的 `images`）。从 file:// 打开时浏览器读不到图片像素——需要像素的互动把像素写进 data 文件。
10. 不出现滚动条、网页式导航、大段文字墙；要像精心制作的 Keynote。

## 讲稿（教师备注）怎么写
- 【讲述建议】写成**能直接念的完整讲稿**：先说结论，再讲例子，最后回扣主线。读真实结果的页写“（读真实结果。）”并给出读法。
- 数字与页面一致；页面上的数字由脚本填入时，讲稿用“六成多”“一百五十次左右”这类不会因重跑而过时的说法，或者在重跑后同步。
- 互动页写【演示操作】：先点什么、拖到哪里、看什么。
- 争议话题：两方证据都给，不替学生下结论；法律政策注明“截至某年某月”。

## 三节课的典型结构
- 理论课（约 21 页）：封面 → 主线 → 2–3 个部分（章节页 + 4–6 页内容 + 1 个互动）→ 小测（4 题）→ 小结（三句话）。
- 实践课（约 22 页）：封面 → 验收清单 → 规矩 → 步骤（代码页与结果页交替，中间一个互动）→ 检查点 → 你的项目 → 写进文档 → 常见问题 → 课后与下周。
