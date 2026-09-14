# notes.md — open questions and decisions log

**Project:** RDM Accountants website demo
**Status:** specification phase, no code written yet
**For:** team follow-up session

---

## 1. Blocking questions for the client

These must be answered before any build starts. Nothing below has been invented — they are genuinely unknown.

| # | Question | Why it blocks | Owner |
|---|---|---|---|
| 1 | **Partner / team names, roles, photos.** | The About page has no content without them. Currently `[TBD]` throughout `03-page-specs.md`. | Client |
| 2 | **Founding year of RDM Accountants CommV.** | Used in the About page opening and in the footer. | Client |
| 3 | **Telephone number.** | Not supplied. The whole positioning rests on "we pick up" — a site that promises 24/7 personal contact and shows no phone number contradicts itself. This is the single most important missing item. | Client |
| 4 | **Confirmed service list.** | Assumed from the ITAA certification and the values, not confirmed. See §3 below. | Client |
| 5 | **What "24/7" actually means in practice.** | See §4 — this is a legal and reputational risk, not just a copy question. | Client |
| 6 | **Real tariffs for the simulator.** | Client chose "invent a rule set" for now. The invented figures in `06-price-simulator-spec.md` are placeholders and must be replaced before anything goes public. | Client |
| 7 | **VAT display.** Prices excl. or incl. btw? | B2B convention in BE is excl., but it must be stated explicitly on the simulator result. | Client |
| 8 | **Existing client testimonials / Google reviews.** | Both reference sites lean heavily on social proof. If RDM has none yet, the homepage needs a different trust device — see `03-page-specs.md` §Home, block 6. | Client |
| 9 | **Language scope.** nl-BE only was confirmed. Antwerp has significant FR and EN-speaking business clients. Is a second language planned for phase 2? | Affects the IA and whether a language switcher is built into the header now. | Client |

---

## 2. Decisions already taken (confirmed in chat)

- Site copy in **nl-BE**; all specification documents in **English**.
- **Five pages**, with the price simulator occupying one slot. The "Platform" page from astro.tax is **folded into Services** rather than standing alone.
- Logo: **three concepts, all retaining the serif monogram DNA** of the current mark.
- Simulator pricing: **invented rule set**, clearly labelled as indicative.
- Deliverable at this stage: **planning and specification documents only**. No HTML, CSS, or other file types.
- **Superseded 2026-09-14:** the demo site has been built. See `site/README.md`.
- **RDM has signed.** The build has been taken from demo to production-ready:
  self-hosted fonts (no third-party requests, GDPR), strict CSP, security headers
  and cache policy for four hosts, structured data for local search, sitemap,
  robots, full icon set, social card, 404 and thank-you pages, working form
  submission, click-to-load map, and four legal pages as reviewed skeletons.
- **A launch gate now exists: `site/tools/preflight.py`.** It fails while any
  placeholder or the invented tariff set remains, so the site cannot be deployed
  with demo content by accident. It currently reports 45 distinct blockers, which
  are precisely the items in §1 and §4 below. Those sections are no longer a
  follow-up list — they are the deploy blocker.
- **Green: kept.** Briefly replaced with navy after internal feedback that green was
  not elegant, then reinstated — green is an explicit request in the client brief, and
  both firms named as inspiration are themselves green (`#013533`, `#3f9c35`). The
  detour was still worth it: the real fault was proportion, not hue. Green now appears
  in three places only. See `04-design-system.md` §Colour.
- **Logo: Concept 2, Cashflow, is built.** The brief asks for a redesign that can be
  "a bit out of the box", so the current mark is not kept. This closes §6 item 5,
  subject to the client seeing it.
- **Navigation.** Five items: Home, Diensten, Over ons, Contact, and the tariff button.
  This also settles the contradiction in `02`, which said "four text links plus one
  button" but then listed only three links.

## 3. Proposals awaiting client sign-off

Recorded as proposals, not decisions. None of these should be treated as agreed.

- **Positioning.** Digital convenience comparable to an online-only firm, but with a named accountant in Antwerp who is actually reachable. Paperless is framed as the proof of the sustainability value rather than a separate selling point. Full argument in `01-brief-and-positioning.md`.
- **Audience.** Antwerp freelancers and owner-managed SMEs up to roughly 20 staff, including starters.
- **Primary green:** `#14453A`. Client did not respond with a hex. See `04-design-system.md` for the full palette and the reasoning.
- **The cashflow quote** is kept in **English**, treated as a found object set in Playfair italic, on the grounds that translating it destroys the cashflow/flow pun. Client has not confirmed. Dutch alternative options are listed in `03-page-specs.md` §Home, block 5.
- **Service list** in `03-page-specs.md` is inferred, not confirmed.

## 4. Risks flagged

**"24/7 personal contact availability" as a public promise.**
This is the differentiator, but as an unqualified claim on a public website it is a liability. astro.tax deliberately promises "within 24 hours on working days" — a bound they can keep. A small CommV promising round-the-clock availability will break that promise the first time someone calls at 23:00 on a Sunday, and the broken promise will land in a Google review. Recommendation: keep the *feeling* of constant availability but bind it concretely, e.g. a named accountant reachable by phone, mail and WhatsApp, with a stated response window and genuine out-of-hours access for urgent matters. The client needs to define what they will actually commit to. Do not publish the unqualified version.

**Invented prices on a real firm's site.**
The simulator numbers are fabricated for demo purposes. RDM is a real, ITAA-certified practice (53.374.753). If this demo is shown to anyone outside the team, every price must carry a visible "indicatief / demo" marker, or be replaced. Flagging explicitly so it cannot be forgotten.

**Spelling in the supplied brand details.**
The supplied credentials read "Gecertificiëerd accountant". Correct Dutch is **"Gecertificeerd accountant"**. Worth checking whether the error also appears on existing stationery, business cards, or the ITAA listing.

**Comparative claims.**
The positioning implicitly contrasts RDM with astro.tax on availability. Do not name competitors anywhere in the copy. Comparative advertising is regulated in Belgium and it also looks small. Claim what RDM does; don't attack.

**Logo legibility.**
In the current mark the script "Accountants" crosses the top of the M and collides with its apex. At favicon and mobile-header sizes this becomes an unreadable smudge. All three concepts in `05-logo-concepts.md` address this. Confirm with the client that changing it is acceptable — they asked for a redesign, but people are often more attached to an existing mark than they say.

## 5. Research limitations

- The astro.tax price simulator at `/offerte` is client-side JavaScript. Its question flow and pricing rules could **not** be read. Only the published floors are public: from €150/month for an eenmanszaak or vzw, from €250/month for a vennootschap, with the final price depending on legal form and turnover. The rule set in `06-price-simulator-spec.md` is therefore an independent construction, not a reconstruction of theirs.
- No existing RDM Accountants website was found, so there is no current copy, sitemap, or analytics to work from.

## 6. Suggested agenda for tomorrow

1. Sign off or reject the positioning (§3) — everything else depends on it.
2. Resolve the "24/7" wording (§4). Bring a decision, not a discussion.
3. Collect the missing company facts (§1, items 1–4).
4. Decide: real tariffs, or ship the demo with visibly-marked indicative pricing.
5. Pick a logo direction from the three concepts.
6. Confirm the green.
