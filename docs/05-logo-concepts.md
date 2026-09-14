# 05 — Logo concepts

> **Superseded 2026-09-15 — new identity: "the live loop".** The client asked
> for a complete, out-of-the-box redesign, and for the site to follow astro.tax's
> patterns, so the Didone monogram and all three concepts below are retired.
>
> The mark is an open ring whose loose end carries a bright green dot. The ring
> is one continuous stroke — money comes and goes, the cashflow line the client
> wants on the site. The dot is the same dot every messaging app uses for "online
> now" — the availability value, in a form everyone already reads. Together:
> money keeps flowing, and someone is there.
>
> The wordmark is lowercase `rdm accountants` in Plus Jakarta Sans 800/600,
> **converted to outlines**, so it renders identically everywhere with no font
> dependency. That closes the old "live SVG text" launch warning.
>
> Tested: legible at 16px on light and dark browser chrome, which the Didone
> monogram never was. Files: `site/assets/img/favicon.svg` (app mark), inline
> lockups in every page header and footer, icons and social card rendered from
> the vector in Edge.
>
> One risk to put to the client: an open ring can read as a loading spinner.
> The dot overlapping the ring is what separates the two; if it still reads as a
> spinner to them, closing the gap further is a one-number change.


> **Decided 2026-09-14. Concept 2, Cashflow, is built.** The client brief asks
> to "redo their logo as well, can be a bit out of the box", which rules out
> keeping the current mark. Concept 2 is the direction on the site now: the
> letter positions are measured off the supplied mark so the composition is
> unchanged, and the colliding script is replaced by a single forest stroke that
> leaves the M, passes beneath the R and D, and exits both sides.
>
> The same curve is reused once at page scale as a section divider on the
> homepage, which is the "one idea, extended into a system" argument for
> choosing this concept over the other two.
>
> Still outstanding: the mark is live SVG `<text>`, not outlines, and the
> favicon falls back to a system Didone because a favicon cannot load a webfont.
> A type designer draws the real one, and it is tested at 16px before sign-off.
> Concepts 1 and 3 remain on record below in case the client wants to compare.

Three directions. All retain the serif monogram DNA of the current mark, as confirmed.

## Reading of the current mark

R and D set as high-contrast Didone capitals on the upper line, M centred beneath, a fine English-script "Accountants" ruling horizontally across the middle, charcoal on warm off-white.

**What works and must survive.** The Didone capitals — hairline-to-stem contrast, bracketed serifs, a genuinely elegant register that no other Antwerp accountancy practice is using. The stacked arrangement, which makes a square mark that behaves well in an avatar. The restraint: no icon, no swoosh, no abstract shape claiming to represent growth.

**What fails and has to change.** The script collides with the apex of the M and with the baseline of the R and D, so at any size below roughly 80px the centre of the mark becomes an unreadable tangle — a favicon, a mobile header, an email signature, an invoice footer. The script is also the only informal element in an otherwise formal mark, and it carries the one word a visitor most needs to read. And the mark is monochrome, with no green.

Each concept below keeps the first list and fixes the second.

---

## Concept 1 — Ledger

*The conservative move. Lowest risk, and still a clear improvement.*

The stacked R D M is kept almost exactly as it is. The script is removed and replaced by a single fine horizontal rule in forest green, running the full width of the monogram at the same height the script occupied — reading as a ruled line in a ledger, or as the line you sign above. "ACCOUNTANTS" moves below the M, set in Source Sans at small size with generous letter-spacing, in ink.

*Note: this is the one sanctioned use of spaced capitals anywhere in the identity. In a wordmark, letter-spaced caps are a construction; in page copy they are a tell.*

**Why it works.** The green enters as a structural element rather than as decoration, so the mark reads as green without any letter being coloured in. The rule stops competing with the M and starts organising the composition. Everything legible at 24px.

**Against it.** The safest of the three. It improves the mark without giving RDM anything to talk about, and the brief did ask for something a bit out of the box.

```
   ┌─────────────────┐
   │   R      D      │
   │ ━━━━━━━━━━━━━━  │   ← forest rule, hairline
   │        M        │
   │  A C C O U N T S│   ← sans, spaced, below
   └─────────────────┘
```

---

## Concept 2 — Cashflow

*The recommended one.*

The M's central vertex — the point where the two inner diagonals meet — is drawn down and extended into a single continuous curved stroke in forest green that flows out of the M, passes beneath the R and D, and exits the mark. It occupies the position and weight of the original script, so the composition is unchanged, but instead of a word it is a line of movement: a river, a flow, a running balance.

Stroke weight matches the Didone hairline, so it reads as belonging to the letterforms rather than applied over them. "Accountants" sits below in Source Sans, quiet.

**Why it works.** It ties the identity to the quote the client asked to feature, and does it structurally rather than by putting the quote in the logo. Money moving through the business, not sitting in it. It is the only one of the three that gives RDM a story to tell in a first meeting, and it is the one that makes the mark memorable at the size it will most often be seen — in a browser tab and on an invoice.

It also sets up a system: the same curve, isolated, becomes a section divider, an underline for links, and the progress line in the simulator. One idea, extended across the site, which is what an identity is.

**Against it.** It is the most drawing-dependent of the three. A curve that is fractionally wrong reads as a stray mark, and it will need several rounds with a real type designer to sit correctly against Didone hairlines. Budget for that rather than approving the first pass.

```
   ┌─────────────────┐
   │   R      D      │
   │  ╭──────────╮   │
   │ ─╯    M     ╰── │   ← forest stroke from the M's vertex
   │   Accountants   │
   └─────────────────┘
```

---

## Concept 3 — Counter

*The sustainability-forward option.*

The letters are untouched except for one: the counter of the D — the enclosed white space inside the bowl — is reshaped into a leaf, filled forest green. A single asymmetric curve on the inner contour, nothing added outside the letterform. The script is removed; "Accountants" sits below in Source Sans.

**Why it works.** It is the most economical statement of the sustainability value available: nothing is added to the mark, one existing shape is simply seen differently. It rewards a second look, which is the definition of a good monogram. And the D of RDM doing the work means the idea is anchored in the name rather than bolted on.

**Against it.** A leaf on a green logo is the most-travelled road in sustainability branding, and the mark risks being read as an eco-consultancy rather than an accountancy practice. It also fixes the identity to one of the four values permanently — if RDM's emphasis shifts toward availability or advice in two years, the leaf still says sustainability. Concept 2 ages better.

```
   ┌─────────────────┐
   │   R      D◗     │   ← counter of the D becomes a leaf
   │        M        │
   │   Accountants   │
   └─────────────────┘
```

---

## Recommendation

**Concept 2, Cashflow.** It is out of the box in the way the brief asked for while keeping the serif monogram intact, it connects to the quote the client wants featured, it survives at favicon size, and it extends into a system that gives the whole site a consistent gesture. Concept 1 is the fallback if the client turns out to be more attached to the current mark than they said. Concept 3 is the one to show and not choose — it will make the others easier to judge.

## Required deliverables, whichever is chosen

**Lockups**
- Primary: stacked monogram with "Accountants" beneath. Square-ish, for avatars, social profiles, favicons.
- Horizontal: monogram left, "RDM Accountants" set to the right. For the site header and email signatures.
- Monogram only: no wordmark. For favicon at 32px and 16px, and app icons.

**Colourways**
- Forest and ink on paper — primary.
- All white — for use on forest sections and the footer.
- All ink — single-colour print, stamps, fax-grade documents.
- Black on white — legal and official filings, where a coloured mark is inappropriate.

**Specification**
- Clearspace: the cap height of the R on all four sides. No exceptions.
- Minimum sizes: 32px height for the primary lockup, 24px for the horizontal, 16px for the monogram alone.
- Do-nots, illustrated: no stretching, no drop shadows, no rotation, no recolouring outside the four colourways, no placement on busy photography without the duotone treatment, and no reinstating the original script alongside the new mark.

**Files:** SVG for all web use, with the wordmark converted to outlines; EPS for print; PNG at 1x, 2x, 3x for anyone who needs to drop it into a document.

**Favicon:** test the chosen mark at 16px before final approval, rendered on both light and dark browser chrome. This is where the current logo fails, and it is the test the replacement has to pass.
