<p align="center">
  <img src="assets/logo.svg" alt="AutoPPT · AI备课神器" width="600">
</p>

<h1 align="center">AI备课神器</h1>

<p align="center">
  <b>AI备课神器：只需一句话，即可一键生成一整周精美、可交互的 HTML 格式教学课件。</b><br>
  无需编程和复杂设计，让备课变得简单高效。<br>
  <sub>人人都能用 · 说一句话，生成一堂好课</sub>
</p>

<p align="center">
  支持 <b>Claude Code</b> · <b>OpenAI Codex</b>
</p>

<p align="center">
  🧑‍🏫 <b>零编程</b> &nbsp;·&nbsp; 📚 <b>全学科</b> &nbsp;·&nbsp; 🖱️ <b>交互式课件</b>
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#三种课件风格">三种风格</a> ·
  <a href="#工作流程">工作流程</a> ·
  <a href="#给智能体看的说明">给智能体看的说明</a> ·
  <a href="examples/week01/">第 1 周示例</a> ·
  <a href="README.en.md">English</a>
</p>

<p align="center">
  <img src="docs/demo.gif" alt="演示：一句话 → 设计文档 → 一整周课件" width="860"><br>
  <sub>演示：输入一句话 → 智能体写设计文档、生成三节课、真实运行代码、自检 → 成品（流程示意已加速，成品为真实课件截图）</sub>
</p>

<p align="center">
  <img src="docs/styles.jpg" alt="三种课件风格：A 学术刊物、B 黑底舞台、C 几何色块" width="860"><br>
  <sub>三种课件风格任选：A 学术刊物 · B 黑底舞台 · C 几何色块</sub>
</p>

---

## AutoPPT 是什么

AutoPPT 是一款“AI备课神器”：一套**给 AI 编程智能体（Claude Code、OpenAI Codex）用的技能（skill）+ 课件引擎**。你只要说出课程主题（或者给它一份教学大纲），智能体就按固定流程交付**一整周可以直接上课的课件**——你不需要写一行代码，也不需要排一页 PPT：

- **理论一、理论二、实践课**三套幻灯片（各约 45 分钟、20 页左右），16:9、1920×1080，看起来像精心制作的 Keynote；
- **每页都有完整讲稿**（建议用时、本页目标、讲述建议、互动提问、易错点、转场），放映时按 `S` 打开演讲者视图；
- **在浏览器里真实计算的互动**：拖滑块、点按钮、改输入，结果当场算出来，而不是播放动画；
- **可以直接跑的实践代码**：代码、运行结果、Jupyter Notebook 出自同一次真实运行，学生在自己电脑上得到一模一样的结果；
- 自动生成的**学生版**（去掉讲稿）、**教师授课指南**（分钟级安排）、**学生指南**、**事实出处**与**图片来源**页。

它来自复旦大学《人工智能基础》（2026 年秋季学期）的真实教学：一门面向大一新生的 16 周通识课，14 周课件全部用这套方法做成。本仓库附上第 1 周的完整课件作为参考示例。

## 为什么要做这个

做课件很花时间，而用 PPT 做出来的课件还有几个老问题：

| PPT 的问题 | AutoPPT 的做法 |
|---|---|
| **交互性差**：最多是动画，学生只能看 | 每节课都有在浏览器里真实计算的互动：调一个参数，模型的判断当场改变 |
| **费时间**：排版、对齐、找图、写备注，一周三节课动辄好几天 | 教师只负责“想清楚”（大纲与设计文档），排版、写讲稿、写代码、做检查都交给智能体 |
| **代码和结果对不上**：截图里的输出是很久以前跑的 | 实践课代码由脚本真实运行，课件上的代码、输出、数字和学生拿到的 Notebook 出自同一次运行 |
| **难以修改与复用**：二进制文件，改一个数字要翻很多页 | 纯文本（HTML + CSS + JS），可以用 git 管理、对比、回滚；改一处，重新构建即可 |
| **事实容易过时或出错** | 每一个论文数字、日期、法规都要联网核对，写进“事实出处”页；模型输出只来自真实运行 |
| **学生版、教案要另做** | 构建脚本自动生成学生版、分钟级教案、图片来源 |

## 三种课件风格

开始做一门课时，智能体会先请你选一种风格（同一门课各周保持一致，之后也能一键更换）：

| 风格 | 特点 | 适合 |
|---|---|---|
| **A 学术刊物**（`academic`，默认） | 暖纸底、宋体大标题、整句标题 + 图证据 | 理论性强、需要论证和引用的课 |
| **B 黑底舞台**（`stage`） | 深色封面与章节页、巨型年份与大字金句；内容页冷灰底，表格代码清晰 | 讲故事、讲历史、公开课与讲座 |
| **C 几何色块**（`blocks`） | 深蓝大色块、橙色圆点、网格信息；无衬线粗标题 | 工科、设计、偏现代感的课 |

三种风格共用同一套页型、互动组件和讲稿格式，只是视觉不同：换风格只需替换一个 CSS 文件（`src/styles/theme.css`）。

## 亮点

- 🖱️ **交互性强**：选择卡、翻牌卡、小测、滑块、可视化……全部在浏览器里现场计算，并与 Python 的结果逐项对照。
- 💬 **说一句话就能开始**：“帮我做第 1 周的课件：人工智能概述，面向大一新生”——智能体先写设计文档，再做成品；想精修时再改设计文档。
- 🎨 **三种风格任选**：学术刊物、黑底舞台、几何色块。
- 📚 **全学科**：引擎与学科无关——文科的史料对比、理科的参数模拟、医科的病例判断、工科的代码实验，都能做成互动。
- ⏱️ **快**：在我们的课上，教师每周投入大约**半小时**——读一遍、改一遍设计文档，确认几件事；其余（三节课、讲稿、互动、代码、检查）由智能体完成。
- 🧑‍💻 **学生实践是真的**：实践课有可以直接运行的代码和 Notebook，有验收清单、检查点、常见问题，学生跟着做就能跑通。
- 📝 **讲稿完整**：每页的讲稿教师照着念也能讲好；教师指南按讲稿自动汇总出每节课的分钟级安排。
- 🎓 **专业、可核对**：主线清晰、事实有出处；示意数据标“示意”，课程组撰写的数据标“课程组撰写”。
- 📦 **一个文件夹，离线可用**：Reveal.js 与字体都在本地，双击 `index.html` 就能打开；`python3 start.py` 打开演讲者视图；网址加 `?print-pdf` 可导出 PDF。
- 🔍 **自带检查**：冒烟测试、文字重叠检查（两种分辨率 × 教师版 / 学生版）、逐页截图与总览图。
- 🔁 **越做越快**：每做完一周，智能体把新学到的规矩写进“课件制作约定”，下一周直接沿用。

## 截图（第 1 周示例）

<table>
<tr>
<td><img src="docs/screenshots/00-week-home.jpg" alt="每周首页"><br><sub>每周首页：三节课入口、教师指南、学生版、下载</sub></td>
<td><img src="docs/screenshots/03-interactive-knn.jpg" alt="互动：规则 vs 学习"><br><sub>互动：人写的规则 vs 从样本中学（k 近邻），点“添加样本”当场重算</sub></td>
</tr>
<tr>
<td><img src="docs/screenshots/04-flip-cards.jpg" alt="翻牌卡"><br><sub>互动：先自己判断“哪些算 AI”，再翻开看理由</sub></td>
<td><img src="docs/screenshots/01-opening.jpg" alt="开场"><br><sub>大字开场：从学生自己的经验出发</sub></td>
</tr>
<tr>
<td><img src="docs/screenshots/05-history-chart.jpg" alt="自绘图表"><br><sub>自绘 SVG 图表（示意数据标“示意”）</sub></td>
<td><img src="docs/screenshots/06-lab-tools.jpg" alt="实践课"><br><sub>实践课：先讲清三个工具各管什么</sub></td>
</tr>
<tr>
<td><img src="docs/screenshots/07-lab-step.jpg" alt="实践步骤"><br><sub>实践步骤：Windows / macOS 一键切换，命令一键复制</sub></td>
<td><img src="docs/screenshots/08-teacher-guide.jpg" alt="教师指南"><br><sub>教师授课指南：课前待办 + 由讲稿自动生成的分钟级安排</sub></td>
</tr>
</table>

> 示例中的照片、新闻截图、电影剧照属于课堂教学引用，不能公开再分发，开源版已换成标有原内容的占位图。

## 快速开始

### 1. 准备环境
- 一个能读写文件、运行命令的 AI 编程智能体：**Claude Code** 或 **OpenAI Codex**（两套技能都已提供）。其他支持 `AGENTS.md` / skill 的智能体也可以按 [AGENTS.md](AGENTS.md) 使用。
- Python 3.9+（构建；可选 `pip install fonttools`，配合 Noto CJK 字体按实际用字裁剪字体）。
- Node.js 18+ 与 Playwright（检查与截图）：`npm i -g playwright && npx playwright install chromium`。
- 实践课需要什么就装什么（NumPy、pandas、scikit-learn……）。

> 唯一的前提是有一个 AI 编程智能体。你自己不需要会编程：上面这些依赖也可以让智能体帮你装。

### 2. 安装技能（Claude Code / Codex 二选一或都装）
```bash
git clone https://github.com/<你的用户名>/autoppt.git && cd autoppt

python3 install.py --agent claude      # Claude Code：装到 ~/.claude/skills/autoppt
python3 install.py --agent codex       # OpenAI Codex：装到 ~/.agents/skills/autoppt
python3 install.py --agent both        # 两个都装
python3 install.py --agent codex --project <课程文件夹>   # 只给某门课用（项目级）
```
（Windows 用 `py -3 install.py …`。）

| | Claude Code | OpenAI Codex |
|---|---|---|
| 技能位置 | `~/.claude/skills/autoppt` 或 `<课程文件夹>/.claude/skills/autoppt` | `~/.agents/skills/autoppt` 或 `<课程文件夹>/.agents/skills/autoppt` |
| 怎么调用 | 直接说“帮我做第 1 周的课件：……” | `$autoppt 帮我做第 1 周的课件：……`，或直接描述需求 |
| 需求访谈 | 弹出选择题 | 一条消息里列出编号问题和选项，回复编号即可 |
| 网络 | 按 Claude Code 的权限设置 | 沙箱默认不联网：搜图、装依赖时需批准或在设置中打开网络（见 [codex.md](skills/autoppt/references/codex.md)） |

两套技能共用同一套引擎、模板和脚本，做出来的课件完全一样；Codex 版的 `SKILL.md` 由 `SKILL.codex.md` 安装而来，多了 Codex 的使用说明。

### 3. 打开示例看一眼
```bash
cd autoppt/examples/week01
python3 start.py          # 浏览器自动打开；按 S 看讲稿，按 → 翻页
```

### 4. 说一句话，开始做课
在课程文件夹里启动智能体，然后说：

> **快速模式**：帮我做第 1 周的课件：人工智能概述。面向大一新生、零编程基础，用「学术刊物」风格。

智能体会先问你几个它推断不出来的问题（学生是谁、风格选哪种），其余先用默认值，然后写设计文档、做出成品、自检，最后告诉你需要确认的事。

> **整门课模式**（推荐）：我要上一门《中国古代史》，这是我的教学大纲（附上 docx / pdf）。请先问清楚我的需求，整理出整学期的课程内容设计给我确认，再做第 1 周。

读完、按你的实际需求改完设计文档之后：

> 我改好了，开干！

之后每一周都只需要一句：“设计第 N 周的课程内容” → 改 → “开干”。

## 工作流程

```text
⓪ 说清你的课（一次）  ──► ① 课程内容设计（一次）  ──► ② 每周设计文档  ──► ③ 开干：实现  ──► ④ 验证与交付
   需求访谈、选风格          课程大纲（你确认）         你按需修改          三节课 + 配图      截图检查、更新约定
```

**⓪ 说清你的课（整门课一次）**
每位老师的课都不一样，所以智能体**先问清楚你要教什么、教给谁、怎么教**，再动手。它会先读你给的教学大纲、教材目录或旧课件，再用几道选择题补齐缺的信息（见[课程需求表](skills/autoppt/templates/课程需求表.md)）：学生是谁、会不会编程；一共几周、每周几节；每周大致讲什么；实践课做什么（编程 / 案例研讨 / 实验与数据分析 / 习题 / 写作展示）；配图能不能从开放图库搜、能不能用 AI 生成、课件会不会公开；课件风格选哪种。

**① 课程内容设计（整门课一次）**
智能体把你的需求整理成[课程大纲](skills/autoppt/templates/课程大纲模板.md)：每周主题、三节课各讲什么、实践课形式、项目里程碑、每周一句主线、配图计划。**你确认（或修改）之后**才开始做第 1 周。同时建立《课件制作约定》——智能体的工作备忘，以后每周追加。

**② 每周：设计文档，你按实际需求改**
说“设计第 N 周的课程内容”，智能体按[周设计文档模板](skills/autoppt/templates/周设计文档模板.md)写出：一句主线、三节课的逐页表（标题、内容、时长）、要做的互动、实践课的材料或代码、**事实核查清单（已联网核对）**、需要你确认的事。你读一遍，按自己的需要改：加一个你常讲的案例、换一个更贴近学生的实验、删掉不想讲的……参考：[第 1 周设计文档](examples/week01/第一周%20设计文档.md)。

**③ 开干：智能体实现（含配图）**
说“开干”，智能体生成骨架，然后按顺序：数据与实践课脚本（真实运行）→ **配图** → 互动组件 → 三节课和讲稿 → 配套页面 → 构建。
配图按“自绘示意图 → 数据图 → 你的素材 → 开放许可图库 → AI 生成示意图”的顺序选：历史课的文物、医学课的显微图、地理课的卫星图这类需要真实图片的，智能体会到 Wikimedia Commons、Openverse 等开放许可图库搜索，挑选后下载并自动登记作者、许可和链接；AI 生成的插图会标明“AI 生成示意”。

**④ 验证与交付**
冒烟测试、文字重叠检查、逐页截图并逐张查看；互动的计算与 Python 逐项对照；写进课程文件夹，在上一周首页加“第 N 周 →”，更新《课件制作约定》。最后给你一段简短总结和**需要你确认的事**。

## 一周课件包含什么

```text
weekNN/
├─ index.html                 每周首页：三节课入口与下载
├─ lecture1.html              理论一（约 21 页，含讲稿）
├─ lecture2.html              理论二（约 21 页）
├─ lab1.html                  实践课（约 22 页）
├─ student/                   学生版（自动生成，无讲稿）
├─ teacher-guide.html         教师授课指南（分钟级安排、课前待办、应急预案、数据核对）
├─ student-setup.html         学生指南（可在手机上看）
├─ sources.html               事实出处与核查记录
├─ image-sources.html         图片来源（自动生成）
├─ examples/                  Notebook（学生版 + 参考答案）、数据、模板
├─ src/                       deck.js 外壳、样式、互动组件、数据
├─ tools/                     数据脚本、实践课脚本（真实运行 + 自检）
├─ build.py  start.py  week.json  README.md  TESTING.md
```

放映快捷键：`→ / 空格` 下一步，`←` 上一步，`F` 全屏，`Esc` 概览，`S` 演讲者视图，`R` 重置当前页互动，`H` 回首页；移动鼠标时底部出现三节课切换栏；网址加 `?print-pdf` 用 Chrome 打印为 PDF。

## 给智能体看的说明

- **入口**：Claude Code 读 [`skills/autoppt/SKILL.md`](skills/autoppt/SKILL.md)；Codex 读 [`skills/autoppt/SKILL.codex.md`](skills/autoppt/SKILL.codex.md) 与 [`references/codex.md`](skills/autoppt/references/codex.md)。再按需读 `references/`。
- **参考实现**：[`examples/week01/`](examples/week01/) 与其 `第一周 设计文档.md`。
- **先了解老师的课**：⓪ 需求访谈（读大纲 → 选择题补齐）→ ① 课程内容设计（老师确认）。
- **先请用户选风格**：给用户看 `skills/autoppt/styles/styles.jpg`，在 A 学术刊物（`academic`）/ B 黑底舞台（`stage`）/ C 几何色块（`blocks`）中选一个，写进《课件制作约定》。
- **生成骨架**：`python3 skills/autoppt/scripts/new_week.py --dest <课程文件夹> --week N --style academic --course … --l1 … --l2 … --lab …`
- **检查**：`bash skills/autoppt/scripts/check_week.sh <课程文件夹>/weekNN`
- **硬性要求**：不编造（事实联网核对，模型输出只来自真实运行）；互动是真实计算并与 Python 对照；实践课代码、输出、Notebook 出自同一次运行；代码页 `data-fit="off"`、代码行 ≤ 86 列；无文字重叠；第三方图片登记来源。
- **触发语**：“设计第 N 周的课件”= 设计文档 + 实现；“设计第 N 周的课程内容 / 设计文档”= 只写文档；“开干”= 按已确认的设计文档实现。

| 文档 | 内容 |
|---|---|
| [references/intake.md](skills/autoppt/references/intake.md) | ⓪ 需求访谈、① 课程内容设计；不同学科的实践课与互动 |
| [references/workflow.md](skills/autoppt/references/workflow.md) | 全部阶段的详细流程、沟通习惯 |
| [references/images.md](skills/autoppt/references/images.md) | 配图：自绘、计算、开放许可图库、AI 生成；登记来源 |
| [references/authoring.md](skills/autoppt/references/authoring.md) | 一页的 HTML 骨架、页型、样式积木、版式规矩、讲稿写法 |
| [references/components.md](skills/autoppt/references/components.md) | 互动组件接口、现成组件、真实计算与对照、教师机回填 |
| [references/lab.md](skills/autoppt/references/lab.md) | 实践课脚本：CELLS、自检、Notebook、示例项目 |
| [references/quality.md](skills/autoppt/references/quality.md) | 内容红线、版权、测试清单、交付说明 |
| [references/codex.md](skills/autoppt/references/codex.md) | 在 OpenAI Codex 中使用：提问方式、沙箱与网络、查看截图 |

## 仓库结构

```text
autoppt/
├─ README.md  README.en.md  AGENTS.md  CLAUDE.md  install.py  LICENSE  LICENSE-CONTENT.md  THIRD_PARTY_NOTICES.md
├─ assets/                    logo
├─ docs/                     demo.gif、styles.jpg、screenshots/（README 用图）
├─ skills/autoppt/           ← 技能本体（install.py 安装到 Claude Code / Codex）
│  ├─ SKILL.md                Claude Code 版入口
│  ├─ SKILL.codex.md          Codex 版入口（安装时改名为 SKILL.md）
│  ├─ references/             流程、写法、组件、实践课、质量
│  ├─ templates/              课程需求表、课程大纲、周设计文档、课件制作约定
│  ├─ styles/                 三种风格的样张（styles.jpg）
│  ├─ engine/                 一周课件的骨架：deck.js、样式、组件、构建脚本、页型样板
│  └─ scripts/                new_week.py、find_images.py、check_week.sh、smoke_test.js、audit_overlap.js、shoot.js、contact_sheet.py
└─ examples/week01/           参考示例：《人工智能基础》第 1 周（含设计文档）
```

## 常见问题

**真的什么学科都能做吗？** 引擎只管“怎么呈现”：页型、讲稿、互动、代码、检查。内容由设计文档决定——历史课可以做史料对照与时间轴，物理课可以做参数模拟，医学课可以做病例判断，语言课可以做逐句对照。需要编程实践的课最能发挥“可以直接跑的代码”这一点；不需要编程的课，实践课可以换成讨论、案例分析或小测。

**叫 AutoPPT，生成的是 .pptx 吗？** 不是。生成的是 HTML 课件——这正是它比 PPT 好用的地方：互动能真实计算、代码能真实运行、离线双击就能打开、可以用 git 管理。需要文件时，在 Chrome 里给课件网址加 `?print-pdf` 导出 PDF。

**只能做中文课吗？** 不是。引擎与语言无关；模板与讲稿格式是中文的，换成英文写设计文档即可（讲稿标签如【建议用时】可以保留，构建脚本依赖它们生成教案）。

**能导出 PowerPoint 吗？** 课件是网页。需要文件时用 Chrome 打开课件、在网址后加 `?print-pdf` 打印为 PDF。互动在 PDF 里会变成静态画面。

**一定要用 Claude Code 吗？** 不一定。Claude Code 和 OpenAI Codex 各有一套入口（`install.py` 一键安装）；其他能读写文件、运行命令的智能体也能按 `SKILL.md` 做。说明：整套方法是在 Claude Code 上做完 14 周课件时打磨出来的；Codex 版共用同一套引擎和脚本，只调整了提问方式和网络说明。

**半小时是怎么算的？** 指教师的时间：读、改设计文档，确认几件事。智能体实现与自检的时间另算（取决于互动与实践课的复杂度），这段时间教师可以去做别的事。

**配图从哪来？非 AI 类的课也行吗？** 行。智能体按顺序选图：能画就画（示意图、流程图）、能算就算（数据图），需要真实图片时用你的素材，或到 Wikimedia Commons、Openverse、博物馆开放获取等开放许可图库搜索（脚本 `find_images.py` 会只保留可再分发的许可，并自动登记作者、许可和链接）；你允许的话，也可以用 AI 生成示意插图（标明“AI 生成示意”，不生成真实人物，也不用 AI 画解剖图、地图这类需要准确的科学图）。电影剧照、新闻截图这类只能课堂引用的素材，公开发布前要替换。

**课程里要用大模型 / GPU 怎么办？** 智能体所在环境通常跑不了。做法是写一个教师机脚本，由教师在自己电脑上运行，把结果填回课件；未运行时页面显示占位，绝不编造输出。

## 许可

- 代码（引擎、脚本、技能文档）：[MIT](LICENSE)。
- 第 1 周示例课件的教学内容（讲稿、设计文档、页面文字）：[CC BY-NC-SA 4.0](LICENSE-CONTENT.md)。
- 第三方组件：Reveal.js（MIT）、Noto CJK 字体子集（SIL OFL 1.1），见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 致谢

本项目源于复旦大学《人工智能基础》（AIB210002，2026 年秋季学期）的课程建设。课件由教师与 Claude（Anthropic）协作完成：教师负责课程设计与把关，Claude Code 负责实现、核对与测试。

如果 AutoPPT 对你的教学有帮助，欢迎 Star、提 Issue，或分享你用它做的课。
