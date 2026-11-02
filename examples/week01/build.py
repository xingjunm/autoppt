"""构建脚本：python3 build.py
1. 生成去掉教师备注的学生版（student/）
2. 根据各页教师备注生成 teacher-guide.html 的分钟级安排
3. 扫描图片引用生成 image-sources.html
4. （可选，需 fontTools 与 Noto CJK 字体）按课件实际用字裁剪本地字体子集到 assets/fonts/
修改课件内容后重新运行即可。"""
import re, os, html, glob, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
DECKS = [('lecture1.html', '理论一 · 什么是人工智能？'), ('lecture2.html', '理论二 · 从图灵到大模型'), ('lab1.html', '实践课 · 让电脑跑起第一段代码')]
SEC = re.compile(r'<section\b([^>]*)>(.*?)</section>', re.S)
TAG = re.compile(r'<[^>]+>')

def text(s):
    return html.unescape(re.sub(r'\s+', ' ', TAG.sub('', s))).strip()

def slides(path):
    src = open(path, encoding='utf-8').read()
    out = []
    for i, m in enumerate(SEC.finditer(src), 1):
        body = m.group(2)
        t = re.search(r'<h[12][^>]*>(.*?)</h[12]>', body, re.S)
        title = text(t.group(1)) if t else ''
        notes = re.search(r'<aside class="notes">(.*?)</aside>', body, re.S)
        n = text(notes.group(1)) if notes else ''
        tm = re.search(r'【建议用时】([^【]*)', n)
        goal = re.search(r'【本页目标】([^【]*)', n)
        mins = re.search(r'([\d.]+)\s*分钟', tm.group(1)) if tm else None
        out.append(dict(no=i, title=title, time=(tm.group(1).strip() if tm else ''), mins=float(mins.group(1)) if mins and '可选' not in tm.group(1) else 0, goal=goal.group(1).strip() if goal else '', body=body))
    return src, out

# ---------- 1. 学生版 ----------
os.makedirs('student', exist_ok=True)
for f, name in DECKS:
    s = open(f, encoding='utf-8').read()
    s = re.sub(r'\s*<aside class="notes">.*?</aside>', '', s, flags=re.S)
    s = re.sub(r'<button class="btn sm teacher-only".*?</button>', '', s, flags=re.S)
    s = re.sub(r'<div class="vid-layer teacher-only".*?</video>\s*<div class="src">.*?</div>\s*</div>', '', s, flags=re.S)
    s = re.sub(r'(href|src)="(assets|src|examples)/', r'\1="../\2/', s)
    s = s.replace('<title>', '<title>学生版 · ')
    open(os.path.join('student', f), 'w', encoding='utf-8').write(s)
open('student/index.html', 'w', encoding='utf-8').write('''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>第 1 周 学生版课件</title>
<link rel="stylesheet" href="../src/styles/tokens.css"><link rel="stylesheet" href="../src/styles/page.css"></head><body><div class="wrap">
<div class="top"><span>人工智能基础 · 第 1 周</span><span>学生版（不含教师备注）</span></div><h1>第 1 周课件</h1>
<div class="cards">''' + ''.join(f'<a class="navcard" href="{f}"><div class="t">{n}</div><p>用 ← → 翻页，F 全屏。</p></a>' for f, n in DECKS) + '''</div>
<div class="links"><a href="../student-setup.html">学生安装与排错指南</a><a href="../examples/hello_ai.ipynb" download>下载 hello_ai.ipynb</a></div></div></body></html>''')

# ---------- 2. 教师指南 ----------
rows = []
for f, name in DECKS:
    _, ss = slides(f)
    total = sum(x['mins'] for x in ss)
    acc = 0.0
    tr = []
    for x in ss:
        start = acc
        acc += x['mins']
        tr.append(f'<tr><td>{x["no"]:02d}</td><td>{html.escape(x["title"])}</td><td>{html.escape(x["time"])}</td><td>{start:.1f}–{acc:.1f}′</td><td>{html.escape(x["goal"])}</td></tr>')
    rows.append(f'<h2>{name}</h2><p class="note">逐页合计约 {total:.1f} 分钟（不含备用页），其余为提问与机动时间。<a href="{f}">打开课件 →</a></p><table><tr><th>页</th><th>标题</th><th>建议用时</th><th>累计</th><th>本页目标</th></tr>{"".join(tr)}</table>')
tg = open('src/teacher-guide.tpl.html', encoding='utf-8').read().replace('{{SCHEDULE}}', '\n'.join(rows))
open('teacher-guide.html', 'w', encoding='utf-8').write(tg)

# ---------- 3. 图片来源 ----------
DESC = {
 'cv62_1': '辅助驾驶车内屏幕', 'cv64_2': '胸部 X 光片肺部区域标注', 'cv72_2': '施工人员检测与标注', 'cv70_1': '足球目标跟踪', 'cv72_1': '工地锈蚀检测',
 's03_1': '任课教师照片', 's10_1': '科技主题配图', 's11_1': '电影《2001 太空漫游》剧照', 's11_2': '电影《终结者》剧照', 's11_3': '电影《黑客帝国》剧照', 's11_4': '电影《机械姬》剧照', 's11_5': '电影《我，机器人》海报',
 's15_1': '《新闻周刊》1997 年封面', 's18_1': '人脸识别闸机', 's18_2': '人脸检测示例', 's19_2': '送餐机器人', 's22_1': '医院物流机器人', 's23_1': '人形机器人', 's23_3': '人形机器人舞台表演', 's23_4': '四足机器人',
 's25_1': '达特茅斯会议参会者合影', 's26_1': '约翰·麦卡锡', 's29_1': '纽厄尔与西蒙', 's30_1': 'MYCIN 论文首页', 's33_1': '深蓝对弈现场', 's34_1': '李飞飞', 's34_3': 'ImageNet 2012 竞赛图示',
 's35_2': 'Intel 4004', 's35_3': 'GeForce 256', 's36_1': '早期通用计算 GPU', 's36_2': 'Tesla V100', 's36_3': 'Blackwell 架构 GPU', 's38_1': '2024 诺贝尔物理学奖官方插画', 's38_2': '2024 诺贝尔化学奖官方插画',
 's39_1': '杨立昆', 's40_1': '杰弗里·辛顿', 's41_1': '约书亚·本吉奥', 's42_1': '任课教师与本吉奥合影', 's42_2': '任课教师与本吉奥合影', 's46_1': 'AlphaGo 对弈画面', 's46_2': 'AlphaGo 对弈画面', 's47_1': '蛋白质结构图',
 's57_1': 'ChatGPT 相关新闻标题截图', 's62_2': '复旦 602 计算机', 's65_1': '吴立德先生', 's66_2': '复旦智能计算平台机房', 's70_5': 'GPT-2 标志', 's70_6': 'GPT-3 标志', 's70_7': 'GPT-4 标志', 's70_8': 'ChatGPT 标志',
 's72_1': '文生图示例（宇航员骑马）', 's73_1': 'ChatGPT 发布页截图', 's80_5': 'OpenAI o1 标志', 's80_6': 'DeepSeek-R1 标志',
}
uses = {}
for f, name in DECKS:
    _, ss = slides(f)
    for x in ss:
        for m in re.finditer(r'(?:src)="(assets/(?:img|video)/[^"]+)"', x['body']):
            uses.setdefault(m.group(1), []).append(f'{name.split(" ")[0]} 第 {x["no"]} 页')
tr = []
for p in sorted(uses):
    k = os.path.splitext(os.path.basename(p))[0]
    d = DESC.get(k, '')
    if p.startswith('assets/img/placeholder/'):
        r = '开源版占位图（原为课堂教学引用的网络素材 / 电影剧照，已移除）；请换成你有权使用的图片'
    else:
        r = '课程自制'
    tr.append(f'<tr><td><code>{os.path.basename(p)}</code></td><td>{d}</td><td>{r}</td><td>{"、".join(sorted(set(uses[p])))}</td></tr>')
open('image-sources.html', 'w', encoding='utf-8').write(f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>图片来源｜人工智能基础 第1周</title>
<link rel="stylesheet" href="src/styles/tokens.css"><link rel="stylesheet" href="src/styles/page.css"></head><body><div class="wrap">
<div class="top"><span><a href="index.html">← 第 1 周首页</a></span><span>图片与视频来源</span></div><h1>图片来源</h1>
<p class="sub">开源版：原课件中的照片、新闻截图、电影剧照与片段均为课堂教学引用的网络素材，不能公开再分发，已全部换成占位图（下表列出原内容，方便你换成自己有权使用的图片）。其余插图（导航、翻译、搜索排序、规则树、期望曲线、集合图、软件界面等）均为课程自绘示意图，未使用 AI 生成图片。</p>
<table><tr><th>文件</th><th>内容</th><th>来源与授权</th><th>使用位置</th></tr>{"".join(tr)}</table></div></body></html>''')

# ---------- 4. 字体子集 ----------
try:
    from fontTools import subset
    from fontTools.ttLib import TTCollection
    chars = set()
    for f in glob.glob('*.html') + glob.glob('student/*.html') + glob.glob('src/components/*.js'):
        chars |= set(open(f, encoding='utf-8').read())
    chars |= set('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,:;!?()[]{}<>+-*/=%#@&_"\'，。、：；！？（）《》“”‘’…—·→←✓✕')
    text_ = ''.join(sorted(c for c in chars if c.isprintable()))
    N = '/usr/share/fonts/opentype/noto/'
    plan = [('serif-black', 'NotoSerifCJK-Black.ttc', 2), ('serif-bold', 'NotoSerifCJK-Bold.ttc', 2),
            ('sans-regular', 'NotoSansCJK-Regular.ttc', 2), ('sans-bold', 'NotoSansCJK-Bold.ttc', 2), ('mono', 'NotoSansCJK-Regular.ttc', 7)]
    os.makedirs('assets/fonts', exist_ok=True)
    for name, ttc, idx in plan:
        if not os.path.exists(N + ttc):
            print('缺少字体', ttc, '，跳过（将使用系统字体）'); continue
        font = TTCollection(N + ttc).fonts[idx]
        opt = subset.Options(); opt.flavor = 'woff'; opt.layout_features = ['*']; opt.name_IDs = ['*']; opt.notdef_outline = True
        sub = subset.Subsetter(opt); sub.populate(text=text_); sub.subset(font)
        font.flavor = 'woff'; font.save(f'assets/fonts/{name}.woff')
        print('字体', name, os.path.getsize(f'assets/fonts/{name}.woff') // 1024, 'KB')
except ImportError:
    print('未安装 fontTools，跳过字体裁剪（课件会使用系统中文字体）')
print('构建完成')
