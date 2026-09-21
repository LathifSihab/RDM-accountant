# RDM Accountants — website

Static site. No framework, no build step, no dependencies. Plain HTML, one
stylesheet, two scripts, self-hosted fonts.

---

## This cannot go live yet

The site was built from specification while several facts were still unknown.
Everything the client had not supplied was rendered as a **visibly marked
placeholder rather than invented** — including the tariffs, which are a demo
rule set, not RDM's prices.

Publishing it as it stands would put invented prices and placeholder facts on a
real ITAA-certified practice's website.

There is a gate that stops that:

```
python tools/preflight.py
```

It exits non-zero while any placeholder remains, and prints each remaining job
once with the pages it affects. **Deploy only when it passes.** Current state:
45 distinct blockers.

---

## What the client still has to supply

**`docs/client-checklist.md` is the version to send RDM** — plain Dutch, no
jargon, grouped by who can answer it.

**`RDM-tarieven.xlsx`** (repo root) is the client-facing pricing sheet: yellow
cells only, a Simulatie tab that mirrors the calculator, and three control rows
matching the worked examples in `docs/06-price-simulator-spec.md`. When it comes
back filled in, copy the figures into "The rule set" in
`site/assets/js/simulator.js`, update `tools/test_pricing.js`, and set
`PRICES_CONFIRMED = true`.

**`content.json` is where the answers go.** Every placeholder on the site
carries a key, so the telephone number is one entry here rather than 37 edits
across 11 files. Fill in `waarde`, then:

```
python tools/apply_content.py     # writes the answers into every page
bash tools/check.sh               # says what is still missing
```

It is safe to re-run as answers arrive, and `--dry-run` previews the change.

Run `tools/preflight.py` for the live list. The big ones:

1. **The telephone number.** Appears as a placeholder in the top bar, mobile
   menu, footer, contact page, simulator result, terminal screen and structured
   data. The site argues "we pick up" and currently shows no number.
2. **The real tariffs.** Replace every figure in "The rule set" in
   `assets/js/simulator.js`, then set `PRICES_CONFIRMED = true`. That flag both
   removes the demo badge from the result screen and satisfies the gate.
3. **The availability promise.** Do not publish an unqualified 24/7 claim — see
   `docs/notes.md` §4. The contact page and Over ons carry a bindable version plus
   a note.
4. **Team names, roles, photographs, direct mail addresses.**
5. **Founding year**, for Over ons and the paper counter.
6. **The paper counter's basis**, or delete block 3 of `index.html`.
   `docs/03-page-specs.md` is explicit that an unfounded number should be dropped
   rather than fudged.
7. **Legal review** of `privacybeleid.html`, `cookiebeleid.html`,
   `algemene-voorwaarden.html` and `disclaimer.html`. These are structured
   skeletons with the GDPR and ITAA-relevant sections laid out and the
   firm-specific values marked. They are **not** finished legal documents. The
   terms in particular must line up with the mandatory opdrachtbrief.
8. **Response time** on the contact confirmation. Never state one the office
   cannot keep.
9. **Confirmation of the service list**, which is inferred, not confirmed.
10. **The logo as vector artwork.** See "Logo" below.

---

## Deploying

The whole `site/` directory is the document root. Config for the common hosts is
included; use the one that matches and ignore the rest.

| Host | File | Notes |
|---|---|---|
| Netlify | `netlify.toml` (repo root) | Already set to publish `site/`. Forms work out of the box. |
| Vercel | `vercel.json` (repo root) | Already set to output `site/`. |
| Cloudflare Pages | `site/_headers`, `site/_redirects` | Build output directory `site`. |
| Apache / cPanel | `site/.htaccess` | Upload the **contents** of `site/` to the web root. Also forces HTTPS and the `www` host. |

All four set the same security headers and cache policy.

**Before the first deploy**

1. Point `ORIGIN` at the real domain if it is not `https://www.rdmaccountants.be`.
   It appears in `tools/preflight.py`, `robots.txt`, `sitemap.xml`, `.htaccess`,
   and the `<link rel="canonical">` and `og:url` of every page.
2. Run `bash tools/check.sh`. It must end with "All checks passed."
3. Submit `sitemap.xml` in Google Search Console.
4. Verify the contact form actually delivers — send a test and confirm it
   arrives in the inbox, not just that the page says thank you.

**Forms.** Both forms (contact, and "stuur me dit per mail" on the simulator)
post to `/bedankt.html` and are marked up for **Netlify Forms**
(`data-netlify`, hidden `form-name`, honeypot). On another host, point the
`action` at your endpoint — Formspree, Basin, or a small mail script — and
nothing else changes. Both work without JavaScript via a native POST; with
JavaScript they post in the background and confirm in place. A failed send is
reported to the visitor rather than swallowed.

**URLs.** Pages are `.html` and the canonicals match, so the site works on any
host with no configuration at all. Each config additionally 301s the
extensionless form (`/diensten` → `/diensten.html`), so both work, there is one
canonical form, and no redirect loop.

---

## Layout

```
README.md            this file
netlify.toml         Netlify config, publishes site/
vercel.json          Vercel config, publishes site/
content.json         the client's answers - one place for every fact
docs/                specifications (01-06), notes, and the client checklist
tools/               checks - NOT deployed
site/                the document root - everything here is deployed
  *.html
  _headers _redirects .htaccess     host config that must sit in the web root
  robots.txt sitemap.xml site.webmanifest favicon.ico
  assets/css  assets/js  assets/fonts  assets/img
```

Only `site/` is published. Tooling, specs and the font-provenance file sit
outside it so they cannot be served by accident.

---

## Running it locally

Asset paths are relative, so it works three ways: opened straight from disk,
served from `site/`, or served from the project root with `site/` as a
subfolder. To serve it:

```
cd site
python -m http.server 8765
```

Then <http://127.0.0.1:8765/>.

`404.html` is the one file using root-absolute paths, deliberately: a host
serves it at whatever path 404'd, so relative references there would resolve
against the wrong folder. `tools/preflight.py` enforces that split.

---

## Production decisions

**No third-party requests.** Nothing on the site contacts anyone but its own
origin. Fonts are self-hosted (`assets/fonts/`, 8 woff2 files, 244 KB) rather
than loaded from Google's CDN, which would disclose every visitor's IP address.
For a Belgian practice that is a GDPR exposure with no upside. `preflight.py`
fails if a third-party host reappears.

**No cookies, so no cookie banner.** The site sets none and tracks nothing, and
`cookiebeleid.html` says so plainly. If analytics are added later this stops
being true: a banner becomes mandatory and that page has to be rewritten. Use a
cookieless analytics product if you want numbers.

**The map is click-to-load.** OpenStreetMap is the one external resource and it
is not requested until the visitor presses "Toon de kaart". Until then no IP
leaves the site.

**Content-Security-Policy with no `unsafe-inline`.** The single inline script is
allowed by SHA-256 hash; every inline `style` attribute was removed so
`style-src 'self'` is possible. If you add an inline script or style, update the
CSP in all four host configs or it will be blocked silently.

**Caching.** Fonts immutable for a year, images a month, CSS and JS one day with
revalidation, HTML always revalidated. CSS and JS have no fingerprint in their
filenames, which is why they are a day rather than a year — append a query
string when you change them if you need a faster rollout.

**First paint** is about 119 KB including both webfonts.

---

## Logo and look

**Logo — "the live loop".** An open green ring whose end carries a bright dot:
money keeps flowing, and the "online now" dot says someone is there. Wordmark
`rdm accountants` in Plus Jakarta Sans, converted to outlines, so it needs no
font. Legible at 16px on light and dark tabs. Rationale in `docs/05-logo-concepts.md`.

**Look — astro.tax patterns, RDM's own expression.** The client asked for the
site to follow astro.tax. Its layout patterns are used (hero checklist, sector
chips, cards, how-it-works rows, FAQ, CTA banner); its text, images, mascot and
colours are not, and there are no invented ratings. See `docs/04-design-system.md` §v2.

---

## What is where

| Path | |
|---|---|
| `index.html` | Home — seven blocks per `docs/03-page-specs.md` |
| `diensten.html` | Services; werkwijze anchored at `#werkwijze` |
| `tarief.html` | The price simulator, all of `docs/06-price-simulator-spec.md` |
| `over-ons.html` | About |
| `contact.html` | Contact |
| `privacybeleid.html` `cookiebeleid.html` `algemene-voorwaarden.html` `disclaimer.html` | Legal — skeletons, need review |
| `bedankt.html` `404.html` | Form confirmation, not-found |
| `assets/css/style.css` | All of `docs/04-design-system.md` |
| `assets/js/main.js` | Nav, the two motion moments, counter, map consent, contact form |
| `assets/js/simulator.js` | Pricing rules and flow |
| `assets/fonts/` | Self-hosted webfonts, plus `gf.css` for provenance |
| `assets/img/` | Icons and the social card |
| `../tools/` | Checks — outside `site/`, so never deployed |

---

## Checks

```
bash tools/check.sh
```

| Script | What it proves |
|---|---|
| `tools/preflight.py` | **The launch gate.** No placeholders, no invented prices, no dead links, no third-party requests, legal pages present, canonical and structured data correct. |
| `tools/check_structure.py` | One `<h1>` per page, headings in order, every control labelled, every internal link and asset resolves. |
| `tools/check_contrast.py` | Every colour pair meets its contrast threshold, computed from the built stylesheet. |
| `tools/test_pricing.js` | The three worked examples in `06` produce €215/€595/€125, the floor holds and rounding is correct across all 12,960 answer combinations, and terminal routing fires. Runs against the shipped `calculate()`, so drift fails the test. |

Re-run `tools/test_pricing.js` after replacing the tariffs — the expected values
in it are the demo ones and will need updating to the real worked examples.

**Not covered by any of these:** how it looks and behaves in a real browser.
Nobody has yet walked the simulator, tabbed through the forms, or checked it at
phone width on a real device. Do that before launch.

---

## After launch

- Instrument the simulator: step drop-off, which terminal screen fires, the
  distribution of prices, and how often the paperless option is unchecked.
  `06` §Measurement explains why that last one is a finding about the
  positioning, not just about the form.
- `docs/02-information-architecture.md` lists what was deliberately left out —
  news feed, client portal, jobs, sector landing pages, language switcher.
  Sector pages and a second language (FR/EN) are the obvious phase 2.
