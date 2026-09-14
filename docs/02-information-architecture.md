# 02 — Information architecture

## The five pages

Confirmed: the simulator occupies one of the five slots, and astro.tax's standalone "Platform" page is folded into Services.

| # | Route | nl-BE title | Job |
|---|---|---|---|
| 1 | `/` | Home | Establish the proposition, prove it, route to the simulator |
| 2 | `/diensten` | Diensten | What RDM does, and how the paperless workflow works |
| 3 | `/tarief` | Bereken je tarief | Indicative monthly price in three steps, ending in a lead |
| 4 | `/over-ons` | Over ons | The people, the practice, the certification |
| 5 | `/contact` | Contact | Reach a human; the reachability promise made concrete |

**On folding Platform into Services.** astro.tax needs a separate platform page because the platform is the product. For RDM the platform is the *method* — how the paperless promise is delivered. Splitting it off would ask the visitor to understand a tool before understanding the service, and would leave both pages thin. It becomes the second half of `/diensten`, anchored at `/diensten#werkwijze` so it can still be linked directly from the homepage and from campaigns.

**On the route name `/tarief`.** Not `/prijzen`, which implies a fixed published price list, and not `/offerte`, which is astro's. "Bereken je tarief" describes the action the visitor takes.

## Navigation

Header, left to right: logo — Diensten — Over ons — Contact — [Bereken je tarief].

The simulator is not a plain nav item. It sits at the right as the only filled button in the header, in the accent green. Four text links plus one button; nothing else. No mega-menu — RSM needs one because it has forty service pages, RDM has one service page, and a mega-menu over four links looks like a firm pretending to be bigger than it is.

Phone number and mail address sit in a slim bar above the header on desktop, and move into the mobile menu as the first two items rather than being buried at the bottom. The availability promise is the positioning; hiding the contact details contradicts it.

Mobile: full-screen overlay menu. Same five destinations, phone and mail first, WhatsApp if confirmed.

## Footer

Four columns on desktop, stacked on mobile.

1. **Logo and proposition line**, address, phone, mail.
2. **Navigatie** — the four pages plus the simulator.
3. **Juridisch** — Privacybeleid, Cookiebeleid, Algemene voorwaarden, Disclaimer.
4. **Erkenning** — ITAA 53.374.753, RPR Antwerpen, BTW BE 1007.002.332, with a link to the ITAA register.

Bottom bar: copyright, cookie preferences link, social icons if accounts exist.

The ITAA number being visible in the footer on every page is not a formality. It is the main thing separating a small practice from a bookkeeping app, and both astro and konsilanto place their credentials prominently for exactly this reason.

## Conversion paths

There are two, and only two. Resisting the urge to add a third is what keeps the site clear.

**Path A — price-first.** Home hero → `/tarief` → three steps → indicative price → book an intake. For the price-anxious, which is most of the audience. This is the path astro.tax optimises for and it works.

**Path B — person-first.** Home → Diensten → Over ons → Contact → call or mail. For visitors who need to know who they are trusting before they care what it costs. Underserved by astro.tax, and the reason RDM exists.

Every page carries one primary call to action from path A and one secondary from path B. Never more.

| Page | Primary | Secondary |
|---|---|---|
| Home | Bereken je tarief | Leer ons kennen (`/over-ons`) |
| Diensten | Bereken je tarief | Stel je vraag (`/contact`) |
| Tarief | Plan je kennismaking | Liever eerst bellen? (phone link) |
| Over ons | Bereken je tarief | Plan een kennismaking (`/contact`) |
| Contact | — (the page is the action) | Bereken je tarief |

## Page depth

Rough scroll budget, to stop pages sprawling.

- Home: 7 blocks. The longest page, and still short by the standards of all three reference sites.
- Diensten: 5 blocks.
- Tarief: 3 steps plus result. No marketing sections above the tool — the visitor arrived to do one thing.
- Over ons: 4 blocks.
- Contact: 2 blocks.

## Not in scope for the demo

Named here so nobody builds them by accident, and so the client can see they were considered.

- News or insights feed. Both konsilanto and RSM run one; both have staff to feed it. An empty news page is worse than no news page. Revisit once RDM commits to a publishing cadence.
- Client portal login. There will be one in reality; the demo links to `#` with a note.
- Jobs page. Six people don't need a careers site.
- Sector landing pages (astro has eight). Good for SEO, wrong for a five-page demo. Note as phase 2.
- Language switcher. See `notes.md` §1, item 9.

## Technical notes for the build phase

- URLs in Dutch, lowercase, hyphenated.
- One `<h1>` per page, matching the page's job above.
- Simulator state held in the URL query string so a visitor can return to a result or send it to their partner.
- The simulator must work without JavaScript to the extent of showing the phone number and mail address as a fallback.
- Page titles: `{Page} | RDM Accountants — Antwerpen`. The city belongs in the title; local search is where a one-office practice wins.
