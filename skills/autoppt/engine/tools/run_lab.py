"""实践课：按顺序真实运行全部代码，生成课件里的“代码 + 运行结果”和 Notebook。

用法（在本周文件夹里运行）：python3 tools/run_lab.py
- CELLS 是唯一的代码来源：课件（data-cell / data-out）、学生 Notebook、参考答案 Notebook 都从这里来，
  保证三者出自同一次运行。
- 需要学生电脑上才有的东西（大模型、GPU）的格子放进 SKIP_RUN，课件里显示占位，由教师机脚本补。
- 跑完做自检（assert），通过后写 src/data/lab_run.js 和 checks.json（教师指南的核对表）。
"""
import contextlib, io, json, os, platform, sys, time

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX = os.path.join(HERE, "examples")
TAG = os.path.basename(HERE)                       # 如 week05

CELLS = [
    ("md", None, """# 实践课：……

按顺序运行每一格。"""),
    ("code", "demo", r'''scores = [72, 85, 90, 64, 88]          # 示例数据（课程组撰写）
mean = sum(scores) / len(scores)
print("人数", len(scores))
print("平均分", round(mean, 2))'''),
    ("md", None, """## 换成你自己的数据"""),
    ("code", "mine", r'''# scores = [...]                       # ① 换成你的数据'''),
]
SKIP_RUN = {"mine"}


def run_cells(keys, ns, outputs):
    code = {k: s for kind, k, s in CELLS if kind == "code"}
    for key in keys:
        buf, t = io.StringIO(), time.time()
        with contextlib.redirect_stdout(buf):
            exec(compile(code[key], f"<cell {key}>", "exec"), ns)
        outputs[key] = buf.getvalue().rstrip("\n")
        print(f"[{key}] {round(time.time() - t, 1)} 秒", file=sys.stderr)


def notebooks(outputs):
    def build(with_out):
        cells = []
        for kind, key, src in CELLS:
            if kind == "md":
                cells.append({"cell_type": "markdown", "metadata": {}, "source": src.splitlines(True)})
                continue
            c = {"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": src.splitlines(True)}
            if with_out and outputs.get(key):
                c["outputs"].append({"output_type": "stream", "name": "stdout", "text": (outputs[key] + "\n").splitlines(True)})
            cells.append(c)
        return {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                                             "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 5}
    os.makedirs(EX, exist_ok=True)
    json.dump(build(False), open(os.path.join(EX, f"{TAG}_lab.ipynb"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(build(True), open(os.path.join(EX, f"{TAG}_lab_answers.ipynb"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    os.makedirs(EX, exist_ok=True)
    os.chdir(EX)
    ns, outputs, t0 = {}, {}, time.time()
    run_cells([k for kind, k, s in CELLS if kind == "code" and k not in SKIP_RUN], ns, outputs)
    # ---------------- 自检：课件里引用的每个数字都在这里断言一次
    assert abs(ns["mean"] - 79.8) < 1e-9, "平均分与讲稿不一致"
    print("自检通过", file=sys.stderr)
    nums = {"mean": ns["mean"], "n": len(ns["scores"])}
    meta = {"backend": "real", "python": platform.python_version(), "date": time.strftime("%Y-%m-%d"), "seconds": round(time.time() - t0, 1)}
    code = {k: s for kind, k, s in CELLS if kind == "code"}
    open(os.path.join(HERE, "src", "data", "lab_run.js"), "w", encoding="utf-8").write(
        "/* 由 tools/run_lab.py 生成，请勿手改 */\nwindow.LAB = " + json.dumps({"meta": meta, "out": outputs, "img": {}, "code": code, "nums": nums}, ensure_ascii=False, indent=1) + ";\n")
    json.dump([["实践课脚本自检", f"通过；Python {meta['python']}；{meta['date']}"], ["示例平均分", f"{nums['mean']:.2f}（{nums['n']} 人）"]],
              open(os.path.join(HERE, "checks.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    notebooks(outputs)
    print(f"完成（{meta['seconds']} 秒）。然后运行 python3 build.py", file=sys.stderr)
