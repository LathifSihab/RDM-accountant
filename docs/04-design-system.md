# 04 — Design system

> **v2, 2026-09-15 — astro.tax patterns.** The client asked for the site to follow
> astro.tax closely. Its *patterns* are adopted — bold sans type, one highlighted
> word per heading, rounded cards and pill buttons, a hero checklist and trust
> row, sector chips, alternating how-it-works rows, an FAQ accordion, a closing
> CTA banner. Its *expression* is not: no copied text, illustrations, mascot,
> code, or colours, and no ratings or client counts RDM does not have (a row of
> publicly verifiable registrations replaces them). Implemented as the "v2" layer
> at the end of `site/assets/css/style.css`. Type is Plus Jakarta Sans, self-hosted.
> Green stays the brand colour. Where this document's editorial rules (Didone,
> no eyebrows, no highlighted words, radius 0) conflict with v2, v2 wins.

> **v2 motion, 2026-09-15.** The original rule of "two moments of motion" is
> relaxed for v2. Sections fade up once as they scroll into view, illustrations
> carry small ambient loops (a floating card, a pulsing "online" dot, typing dots,
> toggles switching on, a timeline drawing itself), and chart bars grow when their
> row appears. All of it sits inside `prefers-reduced-motion: no-preference`, and
> reveals only apply when JavaScript runs, so no visitor can end up with hidden
> content. Illustrations are HTML and inline SVG with no inline style attributes,
> because the Content-Security-Policy blocks those.

Derived from the supplied logo: a high-contrast Didone-style serif monogram, R and D above, M centred below, a fine script "Accountants" ruling across the middle, charcoal on a warm off-white. Editorial, quiet, confident. The system extends that rather than replacing it.

## Colour

> **Revision history.** Green was briefly replaced with a navy system after
> internal feedback that it was not elegant, then reinstated once the client
> brief was re-read: green is an explicit client request. The navy detour was
> still useful — it isolated the actual fault, which was proportion, not hue.
> Both firms named as inspiration are themselves green (`konsilanto.be`
> `#013533`, `rsm.global` `#3f9c35`), so green was never the problem.

Six values.

| Token | Hex | Role |
|---|---|---|
| `--forest` | `#14453A` | The quote block, the footer, the slim top bar. Nothing else. |
| `--fern` | `#2E7D5B` | Buttons, active states, the simulator's live figure, the divider curve. |
| `--ink` | `#3C3C3B` | All body and heading text. Taken directly from the logo. |
| `--paper` | `#F1F1EE` | Page background. |
| `--white` | `#FFFFFF` | Cards, form surfaces, type on forest. |
| `--moss` | `#D9E5DC` | Hairline rules and dividers, disabled states. Never for text. |

**Why forest rather than a bright green.** The logo is high-contrast,
thin-stroke, and fundamentally serious. A bright or acid green fights it and
reads as a tech startup wearing a serif. Deep forest sits underneath the Didone
the way a bottle-green cover sits under gold foil, and it separates RDM from
both reference firms, which sit in lighter and bluer greens. It also does the
sustainability work without a single leaf illustration.

**Proportion is the rule that makes it elegant.** This is what the first build
got wrong: it spent green as a filled surface — green footer, green bands, green
CTA sections, green buttons — and the result read heavy. Both reference firms use
their dark colour as a restrained ground behind mostly white space. So green
appears in exactly three places on this site (the quote block, the footer, the
slim top bar), plus the buttons and the divider curve. Paper and white carry the
rest. Green is the accent, not the field.

**Deliberate avoidance.** The warm-cream-plus-serif-plus-terracotta combination
is the current house style of AI-generated design, and the logo's off-white
already sits close to it. `--paper` is pulled cool and grey (`#F1F1EE`) rather
than warm cream. Do not introduce a warm clay or rust accent; the palette does
not need a fifth voice.

**Contrast, measured.** Computed from the built stylesheet rather than estimated:

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--paper` | 9.76:1 | Body text, comfortable |
| `--ink` on `--white` | 11.04:1 | Body on cards |
| Secondary grey `#6A6A68` on `--paper` | 4.79:1 | Passes AA for body |
| `--white` on `--forest` | 10.81:1 | Quote, footer, top bar |
| `--moss` on `--forest` | 8.34:1 | Footer headings and links |
| `--white` on `--fern` | 5.00:1 | Primary button label |
| `--forest` on `--paper` | 9.56:1 | The simulator's running figure |
| `--error` on `--white` | 6.54:1 | Form errors |
| `--moss` on `--paper` | 1.15:1 | Hairline rules only — see below |

**Correction to an earlier figure.** This document previously gave `--fern` on
white as 4.3:1 and barred it from body copy. Measured, it is **5.00:1**, which
passes AA for normal text. The bar is lifted, though `--forest` is still the
better choice for green text.

**One caveat found by measuring.** `--moss` on `--paper` is 1.15:1, which is
below the point where a 1px rule is reliably visible. That is acceptable for the
decorative hairlines between list items — they are structure, not content, and
WCAG sets no minimum for them — but it is why the divider curve takes `--fern`
instead: it is the logo's own gesture at page scale and has to read as one.
Worth a look in the browser before sign-off; if the list rules disappear in
practice, `--moss` wants to go one step darker.

## Typography

Two families, clearly distinct.

**Display — Playfair Display.** Matches the Didone construction of the logo, and is available with a genuine italic, which the quote block needs. Used for h1, h2, the simulator result figure, and the paper counter. Weights 400 and 500 only — heavy weights thicken the thin strokes and lose the family's character.

**Text — Source Sans 3.** A humanist sans with a large x-height and a real italic, warm enough to carry "je"-voice Dutch without reading like a system font. Used for body, navigation, forms, labels, and all UI.

A geometric grotesque was considered and rejected: against a Didone it produces the fashion-brand look, which is wrong for a firm whose value is approachability.

The script from the logo appears **only** inside the logo. Never in headings, never in the quote, never as a decorative flourish.

### Scale

Modular, ratio 1.25, base 18px. Long-form Dutch runs longer than English and 16px is tight for it.

| Role | Size / line-height | Family |
|---|---|---|
| Display (hero h1, quote) | 61px / 1.1 | Playfair 400 |
| h1 | 49px / 1.15 | Playfair 400 |
| h2 | 39px / 1.2 | Playfair 400 |
| h3 | 25px / 1.3 | Source Sans 600 |
| Body large (intros) | 22px / 1.6 | Source Sans 400 |
| Body | 18px / 1.65 | Source Sans 400 |
| Small (captions, legal) | 15px / 1.5 | Source Sans 400 |

Mobile: display drops to 39px, h1 to 33px, body holds at 18px.

Measure capped at 68 characters for body text.

### Typographic prohibitions

Following from the tone rules in `01`:

- No tracked-out capital eyebrow labels above headings.
- No single word in a headline picked out in a second colour or italic.
- Sentence case in all headings, including navigation.
- No arrow glyph appended to link or button text. If a link needs an affordance, it gets an underline.
- No monospace for numbers or labels. The display serif handles figures, which is the point of choosing a Didone.
- No middle-dot meta strings except in the one place specified in `03` (the hero's three supporting facts), where it is doing real separating work.

## Layout

Twelve columns, 1240px maximum, 32px gutters, 24px page margin on mobile.

**Alignment: left, consistently.** Centred text appears exactly once on the site — the cashflow quote — and that exception is what makes it read as a pause. Centring elsewhere would spend the effect.

**The asymmetry principle.** The logo's M sits below and between the R and D rather than in a neat row. The layout inherits that: content blocks range across nine of twelve columns rather than filling the width, and the free columns alternate side between blocks. The result reads as composed rather than as a page with a narrow container.

```
Hero
┌────────────────────────────────────────────────┐
│                                                │
│  Papierloos werken,              ░░░░░         │
│  zodat er tijd                   ░ ct ░        │
│  overblijft voor jou.            ░░░░░         │
│                                                │
│  Gecertificeerd accountantskantoor in          │
│  Antwerpen. Je dossier digitaal, je            │
│  accountant bereikbaar.                        │
│                                                │
│  [ Bereken je tarief ]   Leer ons kennen       │
│                                                │
│  ITAA-gecertificeerd · Eén aanspreekpunt ·     │
│  Antwerpen                                     │
└────────────────────────────────────────────────┘
   cols 1─────────────────9      cols 10────12

Quote block — the one centred moment, full bleed navy
┌────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓                                ▓▓▓▓▓▓▓▓│
│▓▓▓▓▓      Money comes and goes,           ▓▓▓▓▓│
│▓▓▓▓▓      that's why they call it         ▓▓▓▓▓│
│▓▓▓▓▓      cashflow.                       ▓▓▓▓▓│
│▓▓▓▓▓▓▓▓                                ▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└────────────────────────────────────────────────┘

Werkwijze — sequence, so numbering is earned
┌────────────────────────────────────────────────┐
│ 1  Kennismaking      ──────────────────────    │
│ 2  Je documenten, digitaal  ───────────────    │
│ 3  Wij verwerken     ──────────────────────    │
│ 4  We bespreken      ──────────────────────    │
└────────────────────────────────────────────────┘
```

**Not the card kit.** Services are a list with rules between them, not six identical rounded boxes with identical shadows. Border radius: 4px on form fields and buttons, 0 everywhere else. One shadow token, used only on the simulator's floating result on mobile, nowhere else.

Vertical rhythm on an 8px base. Section padding 120px desktop, 72px mobile.

## Motion

Two moments on the whole site. Everything else is static or responds only to direct input.

1. **Hero entry.** Headline sets in two lines with a short stagger, supporting text and buttons follow. Under 900ms, once per session.
2. **The quote.** A single slow horizontal drift of a few pixels as it enters the viewport. Once. Never loops.

Plus the paper counter, which counts up once when it first becomes visible and then holds.

Everything responding to a person's action is welcome and should be quick: 150ms on focus and hover, 200ms on the simulator's step transitions, and the price figure animating between values as inputs change, because that shows what the input did.

Fade-and-slide-up on every section is the generic default and is prohibited here.

All of it gated behind `prefers-reduced-motion: reduce`, where the hero sets immediately, the quote sits still, and the counter shows its final figure.

## Interface details

**Buttons.** Primary: steel fill, white text, 4px radius, 16px/28px padding. Secondary: no fill, ink text, 1px ink underline offset 4px. No third variant. Focus ring: 2px navy, 2px offset, always visible, never removed.

**Forms.** Labels above fields, always visible — never placeholder-as-label. 1px line border, navy on focus. Errors in a red that is specified once (`#B3261E`) and used nowhere else, with the message stating what to do, not that something is invalid.

**Images.** If photography is used, it is of the actual practice and the actual people. No stock. Duotone in navy and paper is available as a treatment for any image that has to carry text over it.

**Icons.** Minimal. Line icons at 1.5px, ink or navy, used only where they aid scanning — contact methods, form states. Never one icon per service tile; the services are a list, not a tile grid.

## Accessibility floor

Not a feature, a floor: keyboard reachable throughout with visible focus, semantic headings in order, form labels bound to inputs, motion preferences respected, contrast ratios as tabulated above, and the simulator operable and completable using only the keyboard.
