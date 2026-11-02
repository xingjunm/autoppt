# {{COURSE}} · {{WEEK_LABEL}} HTML 课件

由 [AutoPPT](https://github.com/) 生成的骨架。打开 `index.html` 即可（离线可用）；演讲者视图需要本地服务器：`python3 start.py`。

## 目录
| 路径 | 内容 |
|---|---|
| lecture1.html / lecture2.html / lab1.html | 三节课（教师版，含备注） |
| student/ | 学生版（build.py 生成，去掉教师备注） |
| teacher-guide.html | 教师指南（分钟级安排 + 数据核对，build.py 生成；模板在 src/teacher-guide.tpl.html） |
| student-setup.html / sources.html / image-sources.html | 学生指南、事实出处、图片来源（build.py 生成） |
| examples/ | Notebook（学生版 + 参考答案）、数据、模板 |
| src/ | deck.js（外壳）、styles/、components/、data/ |
| tools/ | run_lab.py（实践课代码真实运行 → 课件 + Notebook）及本周的数据脚本 |
| week.json | 课程名、周次、三节课标题、上下周链接、图片来源登记 |

## 修改后重新生成
1. 改实践课代码：编辑 `tools/run_lab.py` 的 CELLS → `python3 tools/run_lab.py`
2. `python3 build.py`
3. 检查：`bash <AutoPPT>/skills/autoppt/scripts/check_week.sh .`
