#!/usr/bin/env python3
"""从 engine/ 生成新一周的课件骨架：weekNN/（三节课样板、首页、学生指南、教师指南模板、构建脚本、实践课脚本）。

用法：
  python3 scripts/new_week.py --dest ~/courses/AI基础 --week 5 \
      --course "人工智能基础" --teacher "张三" --school "某某大学" --term "2026 年秋季学期" \
      --topic "定义问题与准备数据" --l1 "从问题到数据" --l2 "数据的质量" --lab "整理你的第一份数据集" \
      --style academic          # 课件风格：academic（A 学术刊物）/ stage（B 黑底舞台）/ blocks（C 几何色块）

换风格：把 src/styles/themes/ 里对应的文件复制成 src/styles/theme.css 即可（同一门课各周保持一致）。

已存在的 weekNN/ 不会被覆盖（加 --force 才覆盖）。若同一父文件夹里有上一周，会在两周首页之间互加链接。
生成后：先写《第 N 周 设计文档.md》，再按 SKILL.md 的流程把样板页替换成真实内容。
"""
import argparse, json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.join(os.path.dirname(HERE), "engine")
TEXT_EXT = {".html", ".json", ".md", ".py", ".js", ".css"}

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("--dest", required=True, help="课程文件夹（各周 weekNN/ 并列放在这里）")
ap.add_argument("--week", type=int, required=True)
ap.add_argument("--course", required=True)
ap.add_argument("--teacher", default="授课教师")
ap.add_argument("--school", default="学校")
ap.add_argument("--term", default="学期")
ap.add_argument("--topic", default="本周主题")
ap.add_argument("--l1", default="理论一标题")
ap.add_argument("--l2", default="理论二标题")
ap.add_argument("--lab", default="实践课标题")
ap.add_argument("--style", default="academic", choices=["academic", "stage", "blocks"],
                help="课件风格：academic = A 学术刊物（默认）；stage = B 黑底舞台；blocks = C 几何色块")
ap.add_argument("--force", action="store_true")
a = ap.parse_args()

dest_root = os.path.abspath(os.path.expanduser(a.dest))
d = f"week{a.week:02d}"
out = os.path.join(dest_root, d)
if os.path.exists(out) and not a.force:
    sys.exit(f"{out} 已存在；如要覆盖请加 --force")
if os.path.exists(out):
    shutil.rmtree(out)
shutil.copytree(ENGINE, out, ignore=shutil.ignore_patterns("__pycache__", ".DS_Store"))

shutil.copy(os.path.join(out, "src", "styles", "themes", a.style + ".css"), os.path.join(out, "src", "styles", "theme.css"))
prev_dir = f"week{a.week - 1:02d}"
has_prev = a.week > 1 and os.path.exists(os.path.join(dest_root, prev_dir, "index.html"))
label = f"第 {a.week} 周"
M = {
    "COURSE": a.course, "TEACHER": a.teacher, "SCHOOL": a.school, "TERM": a.term, "TOPIC": a.topic,
    "WEEK": str(a.week), "WEEK_LABEL": label, "DIR": d,
    "L1_TITLE": a.l1, "L2_TITLE": a.l2, "LAB_TITLE": a.lab,
    "L1_SUB": "一句副标题", "L2_SUB": "一句副标题", "LAB_SUB": "一句副标题",
    "PREV_LINK": f'<a href="../{prev_dir}/index.html">← 第 {a.week - 1} 周</a>　' if has_prev else "",
    "PREV_JSON": json.dumps({"dir": prev_dir, "label": f"第 {a.week - 1} 周"}, ensure_ascii=False) if has_prev else "null",
}
for dp, dn, fn in os.walk(out):
    if "assets" in os.path.relpath(dp, out).split(os.sep):
        continue
    for f in fn:
        p = os.path.join(dp, f)
        if os.path.splitext(f)[1] not in TEXT_EXT:
            continue
        s = open(p, encoding="utf-8").read()
        s2 = re.sub(r"\{\{([A-Z0-9_]+)\}\}", lambda m: M.get(m.group(1), m.group(0)), s)
        if s2 != s:
            open(p, "w", encoding="utf-8").write(s2)

# 上一周首页加“第 N 周 →”
if has_prev:
    pi = os.path.join(dest_root, prev_dir, "index.html")
    s = open(pi, encoding="utf-8").read()
    link = f'<a href="../{d}/index.html">{label} →</a>'
    if link not in s:
        s2 = re.sub(r'(<div class="top">.*?<span>)([^<]*)(</span></div>)', lambda m: m.group(1) + m.group(2) + "　" + link + m.group(3), s, count=1, flags=re.S)
        if s2 != s:
            open(pi, "w", encoding="utf-8").write(s2)
            print("已在", pi, "加上链接", label, "→")
        else:
            print("提示：没能自动在上一周首页加链接，请手动加", link)
    pj = os.path.join(dest_root, prev_dir, "week.json")
    if os.path.exists(pj):
        w = json.load(open(pj, encoding="utf-8"))
        w["next"] = {"dir": d, "label": label}
        json.dump(w, open(pj, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print(f"已生成 {out}（风格：{a.style}）")
print("下一步：① 写 / 完善《第 N 周 设计文档.md》 ② 按设计文档替换 lecture1/lecture2/lab1 的样板页"
      " ③ python3 tools/run_lab.py ④ python3 build.py ⑤ 截图与重叠检查（scripts/check_week.sh）")
