# AGENTS.md

This repository is **AutoPPT (AI备课神器)**: an agent skill + engine for building a full week of interactive HTML lecture decks
(two lectures + one lab, ~45 min each) from a course outline and a weekly design doc.

## If you are an agent asked to build course slides (课件)
1. Read `skills/autoppt/SKILL.md` first (if you are OpenAI Codex, read `skills/autoppt/SKILL.codex.md` and `skills/autoppt/references/codex.md`). Follow its workflow exactly.
2. Study the reference implementation `examples/week01/` and its design doc `examples/week01/第一周 设计文档.md`.
3. Intake first (`references/intake.md`): read the teacher's syllabus/materials, ask the missing questions (students, weeks, weekly topics, lab type, image policy, style), write the course content design and get it confirmed before building week 1.
4. Ask the user to pick a style (show `skills/autoppt/styles/styles.jpg`): `academic` (A 学术刊物, default), `stage` (B 黑底舞台), `blocks` (C 几何色块). Record it in the course conventions memo.
5. Scaffold a week: `python3 skills/autoppt/scripts/new_week.py --dest <course folder> --week N --style academic --course ... --l1 ... --l2 ... --lab ...`
6. Find images (`references/images.md`, `scripts/find_images.py`): draw → compute → teacher assets → open-licensed libraries (Commons, Openverse) → AI-generated illustrations (labelled). Register every image's source.
7. Verify: `bash skills/autoppt/scripts/check_week.sh <course folder>/weekNN` and look at every contact sheet.

## Installing the skill
`python3 install.py --agent claude|codex|both [--project <course folder>]` — Claude Code: `~/.claude/skills/autoppt`; Codex: `~/.agents/skills/autoppt` (invoke with `$autoppt`).

## Non-negotiables
- Never fabricate facts, numbers or model outputs. Verify facts online and record them in `sources.html`.
- Interactive demos compute for real in the browser and are cross-checked against Python.
- Lab code, outputs and notebooks come from one real run of `tools/run_lab.py` with assert self-checks.
- No overlapping text (audit_overlap.js must report no OV / OUT); code slides use `data-fit="off"`, lines ≤ 86 columns.
- Register every third-party image's source in `week.json`; replace classroom-only images before public release.

## Editing this repository itself
- Engine changes go in `skills/autoppt/engine/`; re-run `new_week.py` into a temp folder and `check_week.sh` it.
- Keep `examples/week01/` self-contained (its own `src/`); it documents an earlier engine version and must keep working.
