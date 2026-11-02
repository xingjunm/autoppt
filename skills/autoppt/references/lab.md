# 实践课：可以直接跑的代码

目标：学生在自己的电脑上运行 Notebook，得到的结果和课件里**一模一样**。做法是让一份代码同时产生三样东西。

```text
tools/run_lab.py 的 CELLS ──► 真实运行（自检通过）──► src/data/lab_run.js（课件里的代码、输出、数字、图片）
                                               ├──► examples/weekNN_lab.ipynb（学生版，无输出）
                                               └──► examples/weekNN_lab_answers.ipynb（参考答案，带输出）
```

## CELLS
```python
CELLS = [
    ("md", None, "# 第 N 周实践课：……"),
    ("code", "load", r'''import pandas as pd
df = pd.read_csv("data.csv")
print(df.shape)'''),
    ...
]
SKIP_RUN = {"qwen_load", "mine"}     # 需要教师机 / 学生自己填的格子
```
- 每格一个 key；课件里 `<div class="code" data-cell="load" data-from="1" data-to="12">` 显示该格第 1–12 行，`<div class="term out" data-out="load">` 显示输出。
- 代码行 ≤ 86 列；注释用中文，写给零基础的学生看。
- 先在课程组的示例数据上走一遍，最后一格是“换成你自己的项目”。

## 自检（不可省略）
在 `if __name__ == "__main__":` 里，全部格子运行后用 `assert` 检查：
- 数据规矩没被破坏（例如没读测试集、划分与前几周一致）。
- 讲稿里引用的关键数字（例如“袋外准确率与上周一致 94.2%”）。
- 生成的文件存在、能被再次加载。
自检通过后才写 `lab_run.js` 和 `checks.json`（教师指南的“数据与互动核对”表）。

## 示例应用 / 示例项目
如果课程有贯穿全学期的项目，课程组先做一个示例项目，放在 `examples/`，在 `week.json` 的 `zip` 里登记，build.py 会打包成 zip 供学生下载。每周只在上面加东西（测试、提示、说明卡……），并保证上一周的测试仍然全部通过。

## 截图
需要展示应用界面时，在 run_lab.py 里用 Playwright 启动应用、操作、截图到 `assets/img/new/`，并在 `LAB.img` 里登记——截图与代码出自同一次运行。
