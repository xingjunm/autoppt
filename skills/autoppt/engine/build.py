"""构建脚本：python3 build.py（修改课件后运行；可重复运行）
读取 week.json，然后：
0. 把 examples/ 里列出的文件夹打成 zip（如示例应用 myapp/ → myapp.zip）
1. 生成去掉教师备注与教师专用片段的学生版（student/）
2. 按各页备注里的【建议用时】【本页目标】生成 teacher-guide.html 的分钟级安排；
   若有 checks.json（[[项目, 结果], ...]，由 tools/ 下的脚本写入），填进“数据与互动核对”表
3. 扫描各页 <img>/<video> 引用，生成 image-sources.html（来源写在 week.json 的 images 里；没写的会被标红）
4. （可选，需 fontTools 与 Noto CJK 字体）按课件实际用字裁剪字体子集到 assets/fonts/
"""
import glob, html, json, os, re, sys, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
W = json.load(open('week.json', encoding='utf-8'))
DECKS = [(d['file'], d['title']) for d in W['decks'] if os.path.exists(d['file'])]
LABEL = W.get('label', f"第 {W['week']} 周")
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
        notes = re.search(r'<aside class="notes">(.*?)</aside>', body, re.S)
        n = text(notes.group(1)) if notes else ''
        tm = re.search(r'【建议用时】([^【]*)', n)
        goal = re.search(r'【本页目标】([^【]*)', n)
        mins = re.search(r'([\d.]+)\s*分钟', tm.group(1)) if tm else None
        out.append(dict(no=i, title=text(t.group(1)) if t else '', time=tm.group(1).strip() if tm else '',
                        mins=float(mins.group(1)) if mins and '可选' not in tm.group(1) else 0,
                        goal=goal.group(1).strip() if goal else '', body=body, has_notes=bool(n)))
    return src, out


# ---------- 0. 示例文件夹打包 ----------
for d in W.get('zip', []):
    src_dir = os.path.join('examples', d)
    if not os.path.isdir(src_dir):
        continue
    with zipfile.ZipFile(src_dir + '.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for dp, dn, fn in os.walk(src_dir):
            dn[:] = [x for x in dn if x != '__pycache__' and not x.startswith('.')]
            for f in fn:
                p = os.path.join(dp, f)
                z.write(p, os.path.relpath(p, 'examples'))

# ---------- 1. 学生版 ----------
os.makedirs('student', exist_ok=True)
for f, name in DECKS:
    s = open(f, encoding='utf-8').read()
    s = re.sub(r'\s*<aside class="notes">.*?</aside>', '', s, flags=re.S)
    s = re.sub(r'<button class="btn sm teacher-only".*?</button>', '', s, flags=re.S)
    s = re.sub(r'<div class="[^"]*\bteacher-only\b[^"]*".*?<!-- /teacher-only -->', '', s, flags=re.S)
    s = re.sub(r'(href|src)="(assets|src|examples)/', r'\1="../\2/', s)
    s = s.replace('<title>', '<title>学生版 · ')
    open(os.path.join('student', f), 'w', encoding='utf-8').write(s)
links = ''.join(f'<a href="../{l["href"]}"{" download" if l.get("download") else ""}>{html.escape(l["text"])}</a>' for l in W.get('student_links', []))
nav = ''
if W.get('prev'):
    nav += f'<a href="../../{W["prev"]["dir"]}/student/index.html">← {html.escape(W["prev"]["label"])}学生版</a>'
if W.get('next'):
    nav += f'<a href="../../{W["next"]["dir"]}/student/index.html">{html.escape(W["next"]["label"])}学生版 →</a>'
open('student/index.html', 'w', encoding='utf-8').write(f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{LABEL} 学生版课件</title>
<link rel="stylesheet" href="../src/styles/tokens.css"><link rel="stylesheet" href="../src/styles/page.css"><link rel="stylesheet" href="../src/styles/theme.css"></head><body><div class="wrap">
<div class="top"><span>{html.escape(W["course"])} · {LABEL}</span><span>学生版（不含教师备注）</span></div><h1>{LABEL}课件</h1>
<div class="cards">''' + ''.join(f'<a class="navcard" href="{f}"><div class="t">{html.escape(n)}</div><p>用 ← → 翻页，F 全屏。</p></a>' for f, n in DECKS) + f'''</div>
<div class="links">{links}{nav}</div></div></body></html>''')

# ---------- 2. 教师指南 ----------
rows, missing = [], []
for f, name in DECKS:
    _, ss = slides(f)
    total, acc, tr = sum(x['mins'] for x in ss), 0.0, []
    for x in ss:
        start = acc
        acc += x['mins']
        if not x['has_notes']:
            missing.append(f'{f} 第 {x["no"]} 页')
        tr.append(f'<tr><td>{x["no"]:02d}</td><td>{html.escape(x["title"])}</td><td>{html.escape(x["time"])}</td><td>{start:.1f}–{acc:.1f}′</td><td>{html.escape(x["goal"])}</td></tr>')
    rows.append(f'<h2>{html.escape(name)}</h2><p class="note">逐页合计约 {total:.1f} 分钟（不含备用页），其余为提问与机动时间。<a href="{f}">打开课件 →</a></p><table><tr><th>页</th><th>标题</th><th>建议用时</th><th>累计</th><th>本页目标</th></tr>{"".join(tr)}</table>')
CH = json.load(open('checks.json', encoding='utf-8')) if os.path.exists('checks.json') else [['（尚无）', '运行 tools/ 下的脚本后写入 checks.json']]
if os.path.exists('src/teacher-guide.tpl.html'):
    tg = open('src/teacher-guide.tpl.html', encoding='utf-8').read()
    tg = tg.replace('{{SCHEDULE}}', '\n'.join(rows)).replace('{{CHECKS}}', ''.join(f'<tr><td>{html.escape(a)}</td><td>{html.escape(b)}</td></tr>' for a, b in CH))
    open('teacher-guide.html', 'w', encoding='utf-8').write(tg)

# ---------- 3. 图片来源 ----------
IMG = W.get('images', {})
uses = {}
for f, name in DECKS:
    _, ss = slides(f)
    for x in ss:
        for m in re.finditer(r'src="(assets/(?:img|video)/[^"]+)"', x['body']):
            uses.setdefault(m.group(1), []).append(f'{name.split(" ")[0]} 第 {x["no"]} 页')
tr, unknown = [], []
for p in sorted(uses):
    k = os.path.basename(p)
    d, r = IMG.get(k, ['', ''])
    if not r and p.startswith('assets/img/new/'):
        r = '课程自制（tools/ 下的脚本生成或自绘）'
    if not r:
        unknown.append(k)
        r = '<b style="color:#B4471F">未登记来源</b>'
    tr.append(f'<tr><td><code>{html.escape(k)}</code></td><td>{html.escape(d)}</td><td>{r}</td><td>{"、".join(sorted(set(uses[p])))}</td></tr>')
open('image-sources.html', 'w', encoding='utf-8').write(f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>图片来源｜{html.escape(W["course"])} {LABEL}</title>
<link rel="stylesheet" href="src/styles/tokens.css"><link rel="stylesheet" href="src/styles/page.css"><link rel="stylesheet" href="src/styles/theme.css"></head><body><div class="wrap">
<div class="top"><span><a href="index.html">← {LABEL}首页</a></span><span>图片来源</span></div><h1>图片来源</h1>
<p class="sub">{html.escape(W.get("images_note", "未列出的插图均为课程自绘 SVG 或浏览器现场计算。"))}</p>
<table><tr><th>文件</th><th>内容</th><th>来源与授权</th><th>使用位置</th></tr>{"".join(tr)}</table></div></body></html>''')

# ---------- 4. 字体子集 ----------
FONT_DIRS = [os.environ.get('AUTOPPT_FONTS', ''), '/usr/share/fonts/opentype/noto/', '/usr/share/fonts/noto-cjk/',
             os.path.expanduser('~/Library/Fonts/'), '/Library/Fonts/', 'C:/Windows/Fonts/']
try:
    from fontTools import subset
    from fontTools.ttLib import TTCollection
    chars = set()
    for f in glob.glob('*.html') + glob.glob('student/*.html') + glob.glob('src/components/*.js') + glob.glob('src/data/*.js'):
        chars |= set(open(f, encoding='utf-8').read())
    chars |= set('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,:;!?()[]{}<>+-*/=%#@&_"\'，。、：；！？（）《》“”‘’…—·→←✓✕')
    text_ = ''.join(sorted(c for c in chars if c.isprintable()))
    plan = [('serif-black', 'NotoSerifCJK-Black.ttc', 2), ('serif-bold', 'NotoSerifCJK-Bold.ttc', 2),
            ('sans-regular', 'NotoSansCJK-Regular.ttc', 2), ('sans-bold', 'NotoSansCJK-Bold.ttc', 2), ('mono', 'NotoSansCJK-Regular.ttc', 7)]
    for name, ttc, idx in plan:
        path = next((os.path.join(d, ttc) for d in FONT_DIRS if d and os.path.exists(os.path.join(d, ttc))), None)
        if not path:
            print('缺少字体', ttc, '，跳过（课件会使用已有子集或系统字体）')
            continue
        font = TTCollection(path).fonts[idx]
        opt = subset.Options(); opt.flavor = 'woff'; opt.layout_features = ['*']; opt.name_IDs = ['*']; opt.notdef_outline = True
        sub = subset.Subsetter(opt); sub.populate(text=text_); sub.subset(font)
        font.flavor = 'woff'; font.save(f'assets/fonts/{name}.woff')
        print('字体', name, os.path.getsize(f'assets/fonts/{name}.woff') // 1024, 'KB')
except ImportError:
    print('未安装 fontTools，跳过字体裁剪（课件会使用已有子集或系统字体）')

if missing:
    print('⚠ 以下页面没有教师备注：', '、'.join(missing))
if unknown:
    print('⚠ 以下图片没有在 week.json 的 images 里登记来源：', '、'.join(unknown))
print('构建完成')
