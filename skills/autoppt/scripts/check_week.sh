#!/usr/bin/env bash
# 一键检查：bash check_week.sh <weekNN 文件夹>
# 依次：构建 → 冒烟测试 → 版式检查 → 逐页截图与总览图（输出到 weekNN/_shots/，检查完可删）
set -e
W=$(cd "${1:-.}" && pwd); S=$(cd "$(dirname "$0")" && pwd)
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
(cd "$W" && python3 build.py)
node "$S/smoke_test.js" "$W"
node "$S/audit_overlap.js" "$W"
for d in lecture1 lecture2 lab1; do
  node "$S/shoot.js" "$W/$d.html" "$W/_shots/$d" >/dev/null && python3 "$S/contact_sheet.py" "$W/_shots/$d" "$W/_shots/${d}_sheet" >/dev/null
done
echo "截图与总览图：$W/_shots/（逐张看一遍；确认后可删除）"
