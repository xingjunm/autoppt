#!/usr/bin/env python3
"""从开放许可图库找配图，下载并登记来源（需要网络）。

  # 1. 搜候选：Wikimedia Commons + Openverse，只保留可以再分发的许可（公有领域、CC0、CC BY、CC BY-SA）
  python3 find_images.py search "Terracotta Army" --n 8 --week <weekNN 文件夹>
  # 2. 下载选中的一张到 <week>/assets/img/web/，长边缩到 1600px 以内，并登记进 <week>/week.json 的 images
  python3 find_images.py get 3 --name bingmayong --desc "秦始皇陵兵马俑" --week <weekNN 文件夹>

选项：--allow-nc 同时保留 CC BY-NC（课件公开发布时慎用）；--source commons|openverse|all。
搜索词用英文更准。候选写在 <week>/_img_candidates.json（可删）。
网络不通时会提示改用网页搜索工具 + 请老师下载。只用标准库；有 Pillow 时会缩放图片。
"""
import argparse, html, json, os, re, sys, urllib.parse, urllib.request

UA = "AutoPPT/0.1 (course slide builder; https://github.com/)"
OK = re.compile(r"^(public domain|pd\b|pdm|cc0|cc[- ]?by(?:[- ]sa)?(?:[- ][\d.]+)?$|cc[- ]by(?:-sa)?[- ][\d.]+.*)", re.I)


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))


def strip(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def license_ok(lic, allow_nc):
    l = (lic or "").strip().lower()
    if not l or "nd" in re.split(r"[- ]", l):
        return False
    if "nc" in re.split(r"[- ]", l):
        return allow_nc
    return bool(OK.match(l)) or l.startswith("public domain") or l in {"cc0", "pdm", "by", "by-sa"}


def commons(q, n, allow_nc):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query", "format": "json", "generator": "search", "gsrnamespace": 6,
        "gsrsearch": q + " filetype:bitmap", "gsrlimit": n * 3, "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiurlwidth": 1600})
    pages = (get_json(url).get("query") or {}).get("pages") or {}
    out = []
    for p in sorted(pages.values(), key=lambda p: p.get("index", 0)):
        ii = (p.get("imageinfo") or [{}])[0]
        m = ii.get("extmetadata") or {}
        v = lambda k: strip((m.get(k) or {}).get("value", ""))
        lic = v("LicenseShortName")
        if not license_ok(lic, allow_nc):
            continue
        out.append({"source": "Wikimedia Commons", "title": p.get("title", "").replace("File:", ""),
                    "creator": v("Artist") or "未署名", "license": lic, "license_url": v("LicenseUrl"),
                    "landing": ii.get("descriptionurl", ""), "url": ii.get("thumburl") or ii.get("url"),
                    "size": f'{ii.get("width")}×{ii.get("height")}', "desc": v("ImageDescription")[:120]})
    return out


def openverse(q, n, allow_nc):
    lic = "cc0,pdm,by,by-sa" + (",by-nc,by-nc-sa" if allow_nc else "")
    url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode({"q": q, "license": lic, "page_size": n * 2})
    out = []
    for r in get_json(url).get("results", []):
        l = r.get("license", "")
        name = ("CC0" if l == "cc0" else "Public Domain Mark" if l == "pdm" else f'CC {l.upper()} {r.get("license_version", "")}'.strip())
        if not license_ok(l, allow_nc):
            continue
        out.append({"source": f'Openverse / {r.get("provider", "")}', "title": r.get("title") or "", "creator": r.get("creator") or "未署名",
                    "license": name, "license_url": r.get("license_url", ""), "landing": r.get("foreign_landing_url", ""),
                    "url": r.get("url"), "size": f'{r.get("width")}×{r.get("height")}', "desc": ""})
    return out


def do_search(a):
    res, errs = [], []
    for name, fn in (("commons", commons), ("openverse", openverse)):
        if a.source in (name, "all"):
            try:
                res += fn(a.query, a.n, a.allow_nc)[: a.n]
            except Exception as e:  # 网络不通、接口变化
                errs.append(f"{name}：{e}")
    if errs:
        print("⚠ 部分来源访问失败：", "；".join(errs), file=sys.stderr)
    if not res:
        print("没有找到可用的候选。网络不通时：用网页搜索工具在 commons.wikimedia.org / openverse.org 找到图片页面，"
              "把链接和许可列给老师，请老师下载放进 assets/img/web/，再在 week.json 的 images 里登记。", file=sys.stderr)
        sys.exit(1)
    json.dump(res, open(os.path.join(a.week, "_img_candidates.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for i, r in enumerate(res, 1):
        print(f'[{i}] {r["title"][:60]}\n    {r["source"]} · {r["creator"][:40]} · {r["license"]} · {r["size"]}\n    {r["landing"]}')
    print(f"\n已存到 {a.week}/_img_candidates.json。打开链接确认画面与许可后：find_images.py get <编号> --name <文件名> --desc <内容> --week {a.week}")


def do_get(a):
    cand = json.load(open(os.path.join(a.week, "_img_candidates.json"), encoding="utf-8"))
    r = cand[a.index - 1]
    ext = os.path.splitext(urllib.parse.urlparse(r["url"]).path)[1].lower()
    ext = ext if ext in (".jpg", ".jpeg", ".png", ".webp", ".gif") else ".jpg"
    os.makedirs(os.path.join(a.week, "assets", "img", "web"), exist_ok=True)
    path = os.path.join(a.week, "assets", "img", "web", a.name + ext)
    req = urllib.request.Request(r["url"], headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        open(path, "wb").write(resp.read())
    try:
        from PIL import Image
        im = Image.open(path)
        if max(im.size) > 1600:
            im.thumbnail((1600, 1600))
        if ext in (".jpg", ".jpeg") or im.mode == "RGB":
            new = os.path.splitext(path)[0] + ".jpg"
            im.convert("RGB").save(new, quality=85)
            if new != path:
                os.remove(path)
            path = new
        else:
            im.save(path)
    except ImportError:
        pass
    fn = os.path.basename(path)
    credit = f'{r["creator"]} · {r["license"]} · {r["source"]} · {r["landing"]}'
    wj = os.path.join(a.week, "week.json")
    if os.path.exists(wj):
        w = json.load(open(wj, encoding="utf-8"))
        w.setdefault("images", {})[fn] = [a.desc or r["title"], credit]
        json.dump(w, open(wj, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"已保存 assets/img/web/{fn}（{os.path.getsize(path) // 1024} KB），已登记来源：{credit}")
    print(f'页面里：<img src="assets/img/web/{fn}" alt="{a.desc}">；页脚 data-src="{r["source"]}，{r["creator"][:20]}，{r["license"]}"')


ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = ap.add_subparsers(dest="cmd", required=True)
s = sub.add_parser("search"); s.add_argument("query"); s.add_argument("--n", type=int, default=6)
s.add_argument("--week", default="."); s.add_argument("--allow-nc", action="store_true"); s.add_argument("--source", default="all", choices=["all", "commons", "openverse"])
g = sub.add_parser("get"); g.add_argument("index", type=int); g.add_argument("--name", required=True); g.add_argument("--desc", default=""); g.add_argument("--week", default=".")
a = ap.parse_args()
(do_search if a.cmd == "search" else do_get)(a)
