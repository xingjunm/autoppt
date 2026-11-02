#!/usr/bin/env python3
"""安装 AutoPPT 技能到 Claude Code 或 OpenAI Codex（Windows / macOS / Linux 通用）。

  python3 install.py --agent claude                       # ~/.claude/skills/autoppt
  python3 install.py --agent codex                        # ~/.agents/skills/autoppt
  python3 install.py --agent codex --project <课程文件夹>  # <课程文件夹>/.agents/skills/autoppt
  python3 install.py --agent both                         # 两个都装

Codex 版使用 SKILL.codex.md 作为 SKILL.md（多了 Codex 的提问方式、沙箱与网络说明）。
已安装的同名技能会被覆盖（先备份为 autoppt.bak）。
"""
import argparse, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "skills", "autoppt")
TARGETS = {"claude": (".claude", "skills"), "codex": (".agents", "skills")}

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("--agent", required=True, choices=["claude", "codex", "both"])
ap.add_argument("--project", help="装到某个课程文件夹（项目级）；不填则装到个人目录")
a = ap.parse_args()

root = os.path.abspath(os.path.expanduser(a.project)) if a.project else os.path.expanduser("~")
for agent in (["claude", "codex"] if a.agent == "both" else [a.agent]):
    dest = os.path.join(root, *TARGETS[agent], "autoppt")
    if os.path.exists(dest):
        bak = dest + ".bak"
        shutil.rmtree(bak, ignore_errors=True)
        shutil.move(dest, bak)
    shutil.copytree(SRC, dest, ignore=shutil.ignore_patterns("__pycache__", ".DS_Store", "_shots"))
    codex_md = os.path.join(dest, "SKILL.codex.md")
    if agent == "codex":
        shutil.move(codex_md, os.path.join(dest, "SKILL.md"))
    elif os.path.exists(codex_md):
        os.remove(codex_md)
    how = "在 Claude Code 里直接说“帮我做第 1 周的课件：……”" if agent == "claude" else "在 Codex 里输入 $autoppt 帮我做第 1 周的课件：……（更新后若未生效请重启 Codex）"
    print(f"✓ 已安装到 {dest}\n  使用：{how}")
