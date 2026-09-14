# 06 — Price simulator specification

> **The figures in this document are invented.** The client chose an invented rule set for the demo. astro.tax's own simulator logic could not be read — it runs client-side and only their published floors are public (from €150/month for an eenmanszaak or vzw, from €250 for a vennootschap). Nothing below is reverse-engineered from theirs; it is an independent construction calibrated to sit plausibly in the Belgian market. **Every number must be replaced or visibly marked as indicative before this is shown outside the team.** See `notes.md` §4.

## Principles

**The price appears before the form.** The visitor gets their figure without surrendering an email address. Gating the result raises captured leads and lowers trust, and for a firm whose whole proposition is openness it would contradict the site. This is the rule most likely to be challenged later; it is the one worth defending.

**Three steps, no more.** Each fits one screen without scrolling on a laptop. Progress is visible throughout.

**The figure updates live.** From step two onward the running price sits at the edge of the screen and changes as inputs change. Seeing the number move when you change a field teaches the visitor what drives their price, and that is itself the advisory pitch.

**One indicative price, not three tiers.** No bronze/silver/gold. Tiers invite comparison shopping on features; a single figure invites a conversation.

## Flow

```
/tarief
  │
  ├─ Step 1  Je onderneming     legal form · age · sector
  ├─ Step 2  Je volume          turnover · documents · VAT regime
  ├─ Step 3  Extra's            payroll · personal tax · preferences
  │
  └─ Result  € X per maand      → Plan je kennismaking
                                → Liever bellen? [phone]
                                → Stuur me dit per mail (optional)
```

Back navigation is always available and preserves answers. State is held in the URL query string so a result can be bookmarked or forwarded.

## Step 1 — Je onderneming

| Field | Type | Options | Notes |
|---|---|---|---|
| Ondernemingsvorm | radio, required | Eenmanszaak · Vennootschap (BV, NV, CommV) · Vzw | Drives the base rate |
| Hoe lang actief? | radio, required | Nog op te starten · Minder dan 1 jaar · Langer dan 1 jaar | First two trigger the starter discount |
| Sector | select, optional | Consultancy · Bouw en vakmensen · Zorg en vrije beroepen · Horeca en retail · Creatief · E-commerce · Andere | **No price effect.** Collected for the intake conversation only, and the form says so. |

Sector is deliberately priced at zero. It could plausibly carry a multiplier, but an unexplained sector surcharge feels arbitrary to the visitor and invites the question "why do I pay more for being in horeca". If the client wants sector pricing, it needs a stated reason.

## Step 2 — Je volume

| Field | Type | Options |
|---|---|---|
| Jaaromzet | radio, required | Minder dan €75.000 · €75.000 – €150.000 · €150.000 – €350.000 · €350.000 – €750.000 · €750.000 – €1.500.000 · Meer dan €1.500.000 |
| Documenten per maand | radio, required | Tot 25 · 26 – 75 · 76 – 150 · 151 – 300 · Meer dan 300 |
| Btw-regime | radio, required | Vrijgesteld (kleine onderneming) · Kwartaalaangifte · Maandaangifte |

"Documenten per maand" is explained inline: *Alle aankoop- en verkoopfacturen samen. Weet je het niet precies? Kies wat het dichtst benadert — we verfijnen dit tijdens de kennismaking.*

Two options are **terminal**: turnover above €1.5M, and more than 300 documents per month. Both route to a contact screen rather than a price. A file that size needs a real conversation, and producing an automated figure for it would either be wrong or would undersell the work.

## Step 3 — Extra's

| Field | Type | Options |
|---|---|---|
| Personeel | stepper, 0–20 | Number of employees on payroll |
| Aangifte personenbelasting | checkbox | For the operator or company director |
| Alles digitaal aanleveren | checkbox, default on | Documents digital, no paper delivery |
| Jaarlijks vooruitbetalen | checkbox | Annual instead of monthly payment |

**"Alles digitaal aanleveren" is the value made visible in the price.** Choosing paperless makes the figure go down, on screen, immediately. It is the clearest possible demonstration that the sustainability claim is operational rather than decorative — it costs RDM less, so it costs the client less. Default on, with a line explaining that unchecking it means physical documents are handled, which takes time.

Payroll above 20 employees routes to contact.

## Pricing rules

All amounts in EUR per month, excluding VAT.

**Base rate by legal form**

| | Base |
|---|---|
| Eenmanszaak | 145 |
| Vzw | 165 |
| Vennootschap | 245 |

**Turnover adder**

| Band | Adder |
|---|---|
| < €75.000 | 0 |
| €75.000 – €150.000 | +30 |
| €150.000 – €350.000 | +75 |
| €350.000 – €750.000 | +140 |
| €750.000 – €1.500.000 | +230 |
| > €1.500.000 | terminal → contact |

**Document volume adder**

| Band | Adder |
|---|---|
| ≤ 25 / month | 0 |
| 26 – 75 | +35 |
| 76 – 150 | +85 |
| 151 – 300 | +160 |
| > 300 | terminal → contact |

**VAT regime**

| Regime | Effect |
|---|---|
| Vrijgesteld (kleine onderneming) | −15 |
| Kwartaalaangifte | 0 |
| Maandaangifte | +45 |

**Extras**

| Item | Effect |
|---|---|
| Payroll | +40 per employee per month |
| Aangifte personenbelasting | +15 |
| Alles digitaal aanleveren | −10 |
| Starter (not yet trading, or under 1 year) | −20% on the subtotal |
| Jaarlijks vooruitbetalen | −5%, applied after the starter discount |

**Order of operations**

```
subtotal = base
         + turnover_adder
         + volume_adder
         + vat_adder
         + (employees × 40)
         + personal_tax_adder

after_paperless = subtotal − (paperless ? 10 : 0)
after_starter   = after_paperless × (starter ? 0.80 : 1)
after_annual    = after_starter   × (annual  ? 0.95 : 1)

price = max(125, round_to_nearest_5(after_annual))
```

**Floor: €125.** No combination of discounts produces a figure below this. A price under €125 would misrepresent what the work costs and would have to be corrected at the intake, which is worse than showing a slightly higher honest number.

Rounding to the nearest €5 keeps the output reading as a considered rate rather than an algorithm's output.

## Worked examples

**A — Freelance consultant.** Eenmanszaak, trading two years, turnover €95k, 30 documents/month, quarterly VAT, no staff, personal tax return, paperless, monthly payment.

```
145 + 30 + 35 + 0 + 0 + 15 = 225
paperless          → 215
→ € 215 per maand
```

**B — Growing company.** BV, trading four years, turnover €480k, 120 documents/month, monthly VAT, 3 employees, paperless, annual prepayment.

```
245 + 140 + 85 + 45 + 120 + 0 = 635
paperless          → 625
annual  (−5%)      → 593.75
round to nearest 5 → 595
→ € 595 per maand
```

**C — Starter, floor applied.** Eenmanszaak not yet trading, turnover under €75k, 15 documents/month, VAT-exempt, no staff, personal tax return, paperless.

```
145 + 0 + 0 − 15 + 0 + 15 = 145
paperless          → 135
starter (−20%)     → 108
floor              → 125
→ € 125 per maand
```

Example C is the case to check in QA: discounts must never drive the figure below the floor, and the result screen must not display a struck-through "was €108".

## Result screen

The figure set large in Playfair, treated as an answer rather than a pricing card.

*Je richtprijs: **€ 215 per maand**, excl. btw.*

*Dit is een indicatie op basis van wat je invulde. Je definitieve tarief spreken we af tijdens de kennismaking — en dan ligt het vast.*

Beneath it, a list of what that price covers, assembled from the answers given so the visitor sees their own situation reflected rather than a generic feature list. For example A: verwerking van je aankoop- en verkoopfacturen · btw-aangiftes per kwartaal · je aangifte personenbelasting · fiscaal advies · één vast aanspreekpunt.

Then, in order:
1. **Plan je kennismaking** — primary.
2. *Liever eerst even bellen? `[TBD phone]`* — the path-B exit, and on this page it matters. A visitor who has just seen a price is exactly the person who wants to speak to someone.
3. *Stuur me dit per mail* — optional, one field, clearly optional. This is where an address is requested, after the value has been delivered.

While the rule set is invented, a visible marker sits alongside the figure: *Demo — indicatieve cijfers, nog niet definitief.*

## Terminal screens

Turnover above €1.5M, more than 300 documents per month, or more than 20 employees:

*Jouw dossier vraagt maatwerk.*

*Bij dit volume hangt de prijs af van hoe je onderneming precies werkt. Dat rekenen we liever niet automatisch uit — bel of mail ons en we maken een voorstel op maat.*

Phone and mail, no form. This must not read as a rejection: the visitor has just identified themselves as the most valuable lead on the site.

## Edge cases and validation

- Nothing can be skipped; the next step stays disabled until the required fields are answered, with the reason stated rather than implied.
- A vzw with employees is valid and common — do not block it.
- An eenmanszaak with more than 20 employees is unusual; allow it, but route to the terminal screen.
- Refreshing the page restores answers from the query string.
- With JavaScript unavailable, the page shows the three questions as static text plus phone and mail, and does not pretend to calculate.
- The running figure is announced to screen readers via a polite live region when it changes, not on every keystroke.
- The whole flow is completable by keyboard alone.

## Measurement

Worth instrumenting from day one: step-by-step drop-off, which terminal screen fires and how often, the distribution of calculated prices, take-up of the paperless option, and the ratio of visitors who reach a price to those who then book. If the paperless checkbox is being unchecked often, the explanation beside it is not working — and that is a finding about the positioning, not just the form.
