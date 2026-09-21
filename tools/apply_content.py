#!/usr/bin/env python3
"""Fill the client's answers into the site.

    python tools/apply_content.py            # apply
    python tools/apply_content.py --dry-run  # show what would change

Reads content.json and replaces every keyed placeholder in site/*.html with the
supplied value. Placeholders with no value yet are left exactly as they are, so
this is safe to run repeatedly as answers trickle in.

The point is that the telephone number lives in 37 places on the site but in
exactly one place here.
"""

import html
import json
import pathlib
import re
import sys

esc = lambda v: html.escape(str(v), quote=True)

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
DRY = "--dry-run" in sys.argv

content = json.loads((ROOT / "content.json").read_text(encoding="utf-8"))
notes = content.get("_notities", {})
team_members = content.get("_team", {}).get("leden", [])
fields = {k: v for k, v in content.items() if not k.startswith("_")}


def tel_href(number: str) -> str:
    """+32 3 123 45 67 -> tel:+3231234567"""
    cleaned = re.sub(r"[^\d+]", "", number)
    if cleaned.startswith("0"):
        cleaned = "+32" + cleaned[1:]
    return cleaned


def render(key: str, spec: dict) -> str:
    """Turn one answer into the markup that replaces the placeholder."""
    value = str(spec["waarde"]).strip()
    kind = spec.get("type", "tekst")
    if kind == "telefoon":
        return f'<a href="tel:{tel_href(value)}">{value}</a>'
    if kind == "mail":
        return f'<a href="mailto:{value}">{value}</a>'
    return value          # "tekst" and "html" both go in as-is


applied, skipped, changed_files = {}, [], set()

for page in sorted(SITE.glob("*.html")):
    original = page.read_text(encoding="utf-8")
    s = original

    # --- values ------------------------------------------------------------
    def sub_field(m):
        key = m.group(1)
        spec = fields.get(key)
        if not spec or spec.get("waarde") in (None, ""):
            return m.group(0)                     # not answered yet, leave it
        applied[key] = applied.get(key, 0) + 1
        return render(key, spec)

    s = re.sub(r'<span class="tbd" data-field="([^"]+)">.*?</span>', sub_field, s, flags=re.S)

    # --- resolved notices: drop the whole paragraph that carries them ------
    for key, note in notes.items():
        if not note.get("opgelost"):
            continue
        pattern = (r'\s*<p[^>]*>\s*<span class="demo-flag" data-note="'
                   + re.escape(key) + r'">.*?</span>\s*</p>')
        s, n = re.subn(pattern, "", s, flags=re.S)
        if n:
            applied["note:" + key] = applied.get("note:" + key, 0) + n

    # --- team: rendered as a whole list from content.json -------------------
    # The team size is unknown, so the list is data, not fixed slots. Anything
    # not yet supplied renders as a keyed placeholder, which preflight blocks.
    if "<!-- team:start" in s:
        items = []
        for i, lid in enumerate(team_members, 1):
            def part(key, placeholder, render=esc):
                val = (lid.get(key) or "").strip()
                if val:
                    return render(val)
                return f'<span class="tbd" data-field="team.{i}.{key}">{placeholder}</span>'

            def mail_link(v):
                return '<a href="mailto:' + esc(v) + '">' + esc(v) + "</a>"

            naam = (lid.get("naam") or "").strip()
            words = [w for w in naam.split() if w[:1].isalpha()]
            if len(words) > 1:
                initials = (words[0][0] + words[-1][0]).upper()
            elif words:
                initials = words[0][0].upper()
            else:
                initials = ""

            foto = (lid.get("foto") or "").strip()
            if foto:
                avatar = ('            <img class="people__photo" alt="" loading="lazy" decoding="async"'
                          ' width="128" height="128"'
                          f' src="{esc(foto)}-128.jpg"'
                          f' srcset="{esc(foto)}-128.jpg 128w, {esc(foto)}-256.jpg 256w" sizes="64px">')
            else:
                avatar = ('            <span class="people__initials" aria-hidden="true">'
                          + (esc(initials) or "&mdash;") + "</span>")

            items.append("\n".join([
                "          <li>",
                avatar,
                "            <div>",
                "              <h3>" + part("naam", "Naam") + "</h3>",
                '              <p class="small muted">' + part("functie", "Functie") + "</p>",
                '              <p class="mt-2">' + part("rol", "E&eacute;n zin over wat deze persoon opvolgt.") + "</p>",
                '              <p class="small mt-2">' + part("mail", "direct mailadres", mail_link) + "</p>",
                "            </div>",
                "          </li>",
            ]))

        region = "\n".join(
            ["<!-- team:start - generated from content.json by tools/apply_content.py; edit there, not here -->"]
            + items
            + ["          <!-- team:end -->"]
        )
        s, n = re.subn(r"<!-- team:start.*?<!-- team:end -->", lambda _m: region, s, flags=re.S)
        if n:
            applied["team members rendered"] = len(team_members)

    # --- telephone also belongs in the structured data ---------------------
    phone = fields.get("telefoon", {}).get("waarde")
    if phone:
        m = re.search(r'(<script type="application/ld\+json">\s*)(\{.*?\})(\s*</script>)', s, re.S)
        if m:
            data = json.loads(m.group(2))
            if data.get("telephone") != phone:
                out = {}
                for k, v in data.items():
                    out[k] = v
                    if k == "email":
                        out["telephone"] = phone
                if "telephone" not in out:
                    out["telephone"] = phone
                s = s[:m.start(2)] + json.dumps(out, ensure_ascii=False, indent=2) + s[m.end(2):]
                applied["structured-data:telephone"] = applied.get("structured-data:telephone", 0) + 1

    if s != original:
        changed_files.add(page.name)
        if not DRY:
            page.write_text(s, encoding="utf-8")

for key, spec in fields.items():
    if spec.get("waarde") in (None, ""):
        skipped.append(key)
for i, lid in enumerate(team_members, 1):
    for f in ("naam", "functie", "rol", "mail"):
        if not (lid.get(f) or "").strip():
            skipped.append(f"team.{i}.{f}")
            fields[f"team.{i}.{f}"] = {"vraag": f"Teamlid {i} ({lid.get('naam') or '?'}): {f}"}

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

print()
if applied:
    print(("Would apply" if DRY else "Applied") + f" {sum(applied.values())} replacement(s) "
          f"across {len(changed_files)} file(s):\n")
    for k, n in sorted(applied.items()):
        print(f"   {k:<34} {n}x")
else:
    print("Nothing to apply — no answers filled in yet.")

if skipped:
    print(f"\nStill unanswered in content.json ({len(skipped)}):\n")
    for k in sorted(skipped):
        print(f"   {k:<34} {fields[k]['vraag'][:64]}")

open_notes = [k for k, v in notes.items() if not v.get("opgelost")]
if open_notes:
    print(f"\nNotices still on the site ({len(open_notes)}): " + ", ".join(sorted(open_notes)))

print("\nNext: bash tools/check.sh\n")
