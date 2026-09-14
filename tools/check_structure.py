"""Structural checks on the built pages: tag balance, one h1, heading order,
label binding, and internal links that actually resolve."""

import os, re, sys, pathlib
from html.parser import HTMLParser

ROOT = str(pathlib.Path(__file__).resolve().parent.parent / "site")
PAGES = sorted(q.name for q in pathlib.Path(ROOT).glob("*.html"))

VOID = {"area","base","br","col","embed","hr","img","input","link","meta",
        "param","source","track","wbr","path","rect","circle","use","stop"}

fails = []

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.headings=[]; self.ids=set(); self.labels=[]
        self.inputs=[]; self.links=[]; self.unbalanced=[]
        self.cur_heading=None; self.titles=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))
        if "id" in a: self.ids.add(a["id"])
        if tag in ("h1","h2","h3","h4"):
            self.headings.append(int(tag[1]))
        if tag=="label" and "for" in a: self.labels.append(a["for"])
        if tag in ("input","select","textarea"):
            if a.get("type") not in ("hidden",):
                self.inputs.append((tag, a.get("id"), a.get("name"), a.get("type")))
        if tag=="a" and "href" in a: self.links.append(a["href"])
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and self.stack: self.stack.pop()
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack:
            self.unbalanced.append(f"stray </{tag}> at {self.getpos()}"); return
        top, pos = self.stack.pop()
        if top != tag:
            self.unbalanced.append(f"</{tag}> at {self.getpos()} closes <{top}> opened at {pos}")

for page in PAGES:
    path = os.path.join(ROOT, page.replace("/", os.sep))
    html = open(path, encoding="utf-8").read()
    p = P(); p.feed(html)

    if p.unbalanced:
        fails.append(f"{page}: tag balance — " + "; ".join(p.unbalanced[:4]))
    if p.stack:
        fails.append(f"{page}: unclosed — " + ", ".join(t for t,_ in p.stack[:6]))

    h1s = [h for h in p.headings if h == 1]
    if len(h1s) != 1:
        fails.append(f"{page}: {len(h1s)} h1 elements, expected exactly 1")

    prev = 0
    for h in p.headings:
        if prev and h > prev + 1:
            fails.append(f"{page}: heading order jumps h{prev} -> h{h}")
            break
        prev = h

    # every visible form control is labelled: <label for>, aria-label, or by
    # being wrapped in a <label> (which is how the radios and honeypots do it)
    def wrapped_in_label(attr_snippet):
        for m in re.finditer(re.escape(attr_snippet), html):
            before = html[: m.start()]
            if before.rfind("<label") > before.rfind("</label>"):
                return True
        return False

    for tag, _id, name, typ in p.inputs:
        if typ in ("radio", "checkbox"):
            continue
        if _id and _id in p.labels:
            continue
        if name and wrapped_in_label(f'name="{name}"'):
            continue
        if re.search(r'<' + tag + r'[^>]*id="' + re.escape(_id or "@") + r'"[^>]*aria-label=', html):
            continue
        fails.append(f"{page}: control {tag}#{_id or name} has no bound label")

    for href in p.links:
        if href.startswith(("http", "mailto:", "tel:", "#")) or href == "":
            continue
        target = href.split("?")[0].split("#")[0]
        fs = os.path.join(ROOT, target.strip("/").replace("/", os.sep))
        if target.endswith("/") or os.path.isdir(fs):
            fs = os.path.join(fs, "index.html")
        if not os.path.isfile(fs):
            fails.append(f"{page}: link {href} does not resolve ({fs})")

    title = re.search(r"<title>(.*?)</title>", html, re.S)
    if not title:
        fails.append(f"{page}: no <title>")
    elif "RDM Accountants" not in title.group(1):
        fails.append(f"{page}: title missing the city pattern: {title.group(1)}")

    print(f"checked {page}: {len(p.headings)} headings, {len(p.inputs)} controls, {len(p.links)} links")

# every radio/checkbox is inside a label
for page in PAGES:
    html = open(os.path.join(ROOT, page.replace("/", os.sep)), encoding="utf-8").read()
    for m in re.finditer(r'<input[^>]*type="(radio|checkbox)"[^>]*>', html):
        before = html[:m.start()]
        if before.rfind("<label") <= before.rfind("</label>"):
            fails.append(f"{page}: {m.group(0)[:60]} is not wrapped in a label")

print()
if fails:
    for f in fails: print("FAIL ", f)
    sys.exit(1)
print("All structural checks passed.")
