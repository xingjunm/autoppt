# 在 OpenAI Codex 中使用 AutoPPT

AutoPPT 的流程、模板、引擎、脚本与 Claude Code 版完全相同；下面只列 Codex 里不一样的地方。

## 安装与调用
```bash
python3 install.py --agent codex                  # 个人级：~/.agents/skills/autoppt
python3 install.py --agent codex --project <课程文件夹>   # 项目级：<课程文件夹>/.agents/skills/autoppt
```
在 Codex 里输入 `$autoppt 帮我做第 1 周的课件：……`，或直接描述需求，让 Codex 按 skill 的描述自动选用。技能更新后若没有生效，重启 Codex。

## 提问方式
Codex 没有弹出式选择题。需求访谈时，把问题编号、给出备选项，放在一条消息里，例如：
```text
开始之前想确认 4 件事（回复编号即可，如“1b 2a 3c 4a”）：
1. 学生：a 大一新生零编程　b 本科高年级有编程基础　c 研究生
2. 每周：a 2 节理论 + 1 节实践，各 45 分钟　b 其他（请说明）
3. 实践课：a 编程　b 案例研讨　c 实验与数据分析　d 习题　e 写作展示
4. 风格（见 styles/styles.jpg）：a 学术刊物　b 黑底舞台　c 几何色块
```
老师回答前不要开始做课件；老师说“你看着办”时用默认值，并在设计文档里标“假设”。

## 沙箱与网络
Codex 默认在沙箱里运行，**工作区可写、网络默认关闭**。以下步骤需要网络：
- 安装依赖：`pip install …`、`npm i -g playwright && npx playwright install chromium`；
- 搜图下载：`scripts/find_images.py`；
- 联网核对事实（若 Codex 的网页搜索未开启）。

遇到网络错误时，向老师说明是哪一步需要网络，请老师批准这条命令，或在 `~/.codex/config.toml` 里为工作区打开网络：
```toml
[sandbox_workspace_write]
network_access = true
```
（以老师所用 Codex 版本的文档为准。）不能联网时：事实核对列出“待核对”清单交给老师；配图改用自绘 SVG，或把找到的图片链接列给老师下载。

## 查看截图
逐页截图与总览图是质量检查的关键。Codex 能查看本地图片时（如 view_image 工具），逐张查看 `weekNN/_shots/*_sheet*.png`；不能查看时，把总览图路径告诉老师，请老师过目，并以 `audit_overlap.js` 的结果为准。

## 其他
- `AGENTS.md`：Codex 会读取仓库根目录的 AGENTS.md；课程文件夹里也可以放一份，写上“做课件前先读 autoppt 技能，并遵守《课件制作约定》”。
- 长任务分步做：先交设计文档，再逐节实现；每完成一节运行一次 `check_week.sh`，避免一次改动太多难以排查。
