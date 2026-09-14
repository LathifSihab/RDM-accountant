#!/usr/bin/env python3
"""Launch gate for the RDM Accountants website.

Run this before every deploy:

    python tools/preflight.py

It exits non-zero if the site still carries anything that must not reach a
real, ITAA-certified practice's public website: invented tariffs, placeholder
facts, dead links, or missing legal content.

BLOCKERS fail the build. WARNINGS are printed and do not.

This exists because the site was built as a demo. Everything the client had
not yet supplied was rendered as a visibly marked placeholder rather than
invented, and this script is what stops those placeholders going live.
"""

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
ORIGIN = "https://www.rdmaccountants.be"

blockers: dict[str, set[str]] = {}
warnings: list[str] = []


def html_files() -> list[pathlib.Path]:
    return sorted(ROOT.glob("*.html"))


def block(msg: str, where: str = "") -> None:
    """Group by cause. One missing fact is one job, however many pages show it."""
    blockers.setdefault(msg, set())
    if where:
        blockers[msg].add(where)


def warn(msg: str) -> None:
    warnings.append(msg)


# --- 1. Placeholders the client still has to fill -----------------------------

for p in html_files():
    s = p.read_text(encoding="utf-8")

    # NB: must tolerate attributes. The placeholders carry data-field keys.
    for m in re.finditer(r'<span class="tbd"[^>]*>(.*?)</span>', s, re.S):
        block(f'unresolved [TBD]: "{m.group(1).strip()[:80]}"', p.name)

    for m in re.finditer(r'<span class="demo-flag"[^>]*>(.*?)</span>', s, re.S):
        block(f'demo notice on the page: "{m.group(1).strip()[:80]}"', p.name)

    if "[TBD" in s or "TBD]" in s:
        block("literal 'TBD' left in the markup", p.name)


# --- 2. Invented pricing ------------------------------------------------------

sim = (ROOT / "assets/js/simulator.js").read_text(encoding="utf-8")
if not re.search(r"var PRICES_CONFIRMED = true\b", sim):
    block(
        "assets/js/simulator.js: PRICES_CONFIRMED is still false. The tariffs "
        "are invented. Replace every figure in 'The rule set' with RDM's real "
        "tariffs and flip the flag."
    )


# --- 3. The telephone number --------------------------------------------------
# The whole positioning is "we pick up". A site that promises that and shows
# no number contradicts itself, so this is a blocker rather than a warning.

if not any(re.search(r'href="tel:\+?[0-9 ]{6,}"', p.read_text(encoding="utf-8")) for p in html_files()):
    block("no telephone number anywhere on the site — see notes.md §1 item 3")

for p in html_files():
    s = p.read_text(encoding="utf-8")
    m = re.search(r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>', s, re.S)
    if not m:
        block("structured data missing", p.name)
        continue
    try:
        data = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        block(f"structured data is not valid JSON: {e}", p.name)
        continue
    if not data.get("telephone"):
        block("structured data has no telephone", p.name)
    if not data.get("openingHoursSpecification"):
        warn(f"{p.name}: structured data has no opening hours — costs visibility in local search")
    if not data.get("geo"):
        warn(f"{p.name}: structured data has no geo coordinates")


# --- 4. Links, assets and canonicals -----------------------------------------

for p in html_files():
    s = p.read_text(encoding="utf-8")

    if 'href="#"' in s:
        block('dead placeholder link href="#"', p.name)

    # Relative everywhere so the site works from any root. 404.html is the
    # exception: a host serves it at whatever path 404'd, so it needs
    # root-absolute references or its assets break.
    for m in re.finditer(r'(?:href|src|action)="(?!https?:|mailto:|tel:|#|data:)([^":#?]+)"', s):
        ref = m.group(1)
        if p.name != "404.html" and ref.startswith("/"):
            block("root-absolute path - breaks unless served from site/ root", p.name)
        rel = ref.lstrip("/") or "index.html"      # "/" is the home page
        target = ROOT / rel
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            block(f"{ref} does not exist", p.name)

    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', s)
    if not canonical:
        block("no canonical URL", p.name)
    elif not canonical.group(1).startswith(ORIGIN):
        block(f"canonical points at {canonical.group(1)}, expected {ORIGIN}", p.name)

    if s.count("<h1") != 1:
        block(f"{s.count(chr(60)+chr(104)+chr(49))} h1 elements, expected exactly 1", p.name)

    if "<title>" not in s:
        block("no <title>", p.name)


# --- 5. No third-party requests ----------------------------------------------
# GDPR: the site must not disclose visitor IPs to anyone the visitor did not
# choose. The map is the single exception and is click-to-load.

THIRD_PARTY = ["fonts.googleapis.com", "fonts.gstatic.com", "google-analytics",
               "googletagmanager", "cdnjs", "jsdelivr", "unpkg", "facebook.net"]
for p in html_files():
    s = p.read_text(encoding="utf-8")
    for host in THIRD_PARTY:
        if host in s:
            block(f"third-party request to {host} - GDPR exposure, self-host it", p.name)
    if re.search(r'\sstyle="', s):
        block("inline style attribute - the CSP blocks it silently in production; use a class", p.name)
    if "<iframe" in s:
        block("hard-coded iframe - third-party frames must be click-to-load", p.name)


# --- 6. Legal pages -----------------------------------------------------------

for name in ["privacybeleid.html", "cookiebeleid.html",
             "algemene-voorwaarden.html", "disclaimer.html"]:
    p = ROOT / name
    if not p.is_file():
        block(f"{name} is missing and is linked from the footer")
        continue
    s = p.read_text(encoding="utf-8")
    if "Laatst bijgewerkt" in s and re.search(r"Laatst bijgewerkt:\s*<span", s):
        block("'Laatst bijgewerkt' has no date", name)


# --- 7. Things that should exist ---------------------------------------------

for f in ["robots.txt", "sitemap.xml", "site.webmanifest", "404.html",
          "favicon.ico", "assets/img/og-default.png", "assets/fonts/fonts.css"]:
    if not (ROOT / f).is_file():
        block(f"{f} is missing")

sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8") if (ROOT / "sitemap.xml").is_file() else ""
for p in html_files():
    if p.name in {"404.html", "bedankt.html"}:
        continue
    loc = f"{ORIGIN}/" if p.name == "index.html" else f"{ORIGIN}/{p.name}"
    if loc not in sitemap:
        warn(f"{p.name} is not in sitemap.xml")



# --- 8. The staging guard ----------------------------------------------------
# While anything above is unresolved the preview must stay out of search. Once
# it is all clear, the guard has to come off or the real site never gets
# indexed. Checking it last means it never nags during staging.

CONFIGS = [ROOT.parent / "netlify.toml", ROOT / "_headers", ROOT / ".htaccess"]
guarded = [c.name for c in CONFIGS
           if c.is_file() and "X-Robots-Tag" in c.read_text(encoding="utf-8")]
missing = [c.name for c in CONFIGS if c.is_file() and c.name not in guarded]

if blockers and missing:
    block("no X-Robots-Tag noindex in " + ", ".join(missing) +
          ", but the site still has placeholders. Do not publish an indexable "
          "preview with invented prices.")
elif not blockers and guarded:
    block("last step: remove the X-Robots-Tag noindex line from " +
          ", ".join(guarded) + ". Everything else is clear, so the site is "
          "ready to be indexed.")


# --- Report -------------------------------------------------------------------

try:                                        # Windows consoles default to cp1252
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

print()
if not blockers:
    print("PREFLIGHT PASSED — no blockers. The site is safe to deploy.")
else:
    occurrences = sum(max(1, len(v)) for v in blockers.values())
    print(f"PREFLIGHT BLOCKED — {len(blockers)} distinct issue(s), "
          f"{occurrences} occurrence(s).")
    print("Each numbered line is one job. Fixing it clears every page listed under it.\n")
    for i, (msg, where) in enumerate(sorted(blockers.items()), 1):
        print(f"  {i:>2}. {msg}")
        if where:
            pages = sorted(where)
            shown = ", ".join(pages[:6])
            if len(pages) > 6:
                shown += f" (+{len(pages) - 6} more)"
            print(f"      on: {shown}")

if warnings:
    seen, unique = set(), []
    for w in warnings:                      # collapse "same warning, every page"
        key = w.split(": ", 1)[-1]
        if key in seen:
            continue
        seen.add(key)
        unique.append(key)
    print(f"\n{len(unique)} warning(s), not blocking:\n")
    for w in unique:
        print(f"   !  {w}")

print()
sys.exit(1 if blockers else 0)
