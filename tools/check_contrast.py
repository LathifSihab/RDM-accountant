import re, pathlib
css = pathlib.Path(r"D:\Lathif Personal\DRPBuildLab\RDM\site\assets\css\style.css").read_text(encoding="utf-8")
tok = dict(re.findall(r'--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6});', css))

def lum(h):
    c = [int(h[i:i+2], 16)/255 for i in (1, 3, 5)]
    c = [v/12.92 if v <= 0.04045 else ((v+0.055)/1.055)**2.4 for v in c]
    return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi+0.05)/(lo+0.05)

pairs = [
    ("ink on paper",        tok['ink'],    tok['paper'],  4.5, "body text"),
    ("ink on white",        tok['ink'],    tok['white'],  4.5, "body on cards"),
    ("ink-60 on paper",     tok['ink-60'], tok['paper'],  4.5, "secondary text"),
    ("ink-60 on white",     tok['ink-60'], tok['white'],  4.5, "secondary on cards"),
    ("white on forest",     tok['white'],  tok['forest'], 4.5, "quote, footer, top bar"),
    ("moss on forest",      tok['moss'],   tok['forest'], 4.5, "footer headings, links"),
    ("white on fern",       tok['white'],  tok['fern'],   4.5, "primary button label"),
    ("fern on white",       tok['fern'],   tok['white'],  3.0, "focus/UI components only"),
    ("forest on paper",     tok['forest'], tok['paper'],  4.5, "the running figure"),
    ("error on white",      tok['error'],  tok['white'],  4.5, "form errors"),
    ("moss on paper",       tok['moss'],   tok['paper'],  1.0, "hairline rules — decorative, no WCAG minimum"),
    ("fern on paper",       tok['fern'],   tok['paper'],  3.0, "the divider curve"),
]
bad = 0
print(f"{'pair':22s} {'ratio':>7s}  {'min':>5s}  verdict   use")
for name, a, b, need, use in pairs:
    r = ratio(a, b)
    ok = r >= need
    bad += not ok
    print(f"{name:22s} {r:6.2f}:1  {need:5.1f}  {'PASS ' if ok else 'FAIL '}    {use}")
print("\nAll palette pairs meet their threshold." if not bad else f"\n{bad} pair(s) below threshold.")
raise SystemExit(1 if bad else 0)
