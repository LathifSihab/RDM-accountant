# 03 — Page specifications

Notation: quoted Dutch is proposed final site copy. Anything in `[TBD]` is a genuine gap awaiting client input — see `notes.md`. English text is annotation for the build team.

---

# Page 1 — Home (`/`)

Seven blocks. The job is to state the proposition, prove it, and route to the simulator.

## Block 1 — Hero

No mascot, no stock photography of handshakes, no video of an office. The hero is typographic.

**H1:** *Papierloos werken, zodat er tijd overblijft voor jou.*

**Sub:** *Gecertificeerd accountantskantoor in Antwerpen. Je dossier digitaal, je accountant bereikbaar.*

**Primary CTA:** Bereken je tarief → `/tarief`
**Secondary:** Leer ons kennen → `/over-ons`

Three supporting facts in a single line beneath, not as icon tiles:
*ITAA-gecertificeerd · Eén vast aanspreekpunt · Antwerpen*

**Treatment.** The headline set large in the display serif, left-aligned, ranging across roughly nine columns of twelve. Right of it, negative space with one element: the paper counter from block 3 in its small form, or nothing at all. Resist filling it. The asymmetry echoes the off-centre M in the logo.

**Motion.** One orchestrated page-load sequence, and nothing else on this screen. The headline sets in two lines with a short stagger; the supporting line and buttons follow. Under 900ms total. Respects `prefers-reduced-motion`.

## Block 2 — The chain

The four values as a single argument rather than a grid. Three linked statements, read left to right, with a thin green rule connecting them.

*Geen papier* → *geen kantoorbezoek* → *wel een accountant die opneemt.*

Beneath, one short paragraph:

*Je facturen komen digitaal binnen, je btw-aangifte vertrekt digitaal, je jaarrekening bespreken we in een gesprek — niet in een enveloppe. Dat scheelt ons tijd. Die tijd gaat naar jou.*

This is the only place on the site where the values are explained. Everywhere else they are demonstrated.

## Block 3 — The paper counter

> **Not built (2026-09-14).** No defensible basis for the figure was supplied,
> and this section already says to drop the block rather than fudge it. The
> homepage therefore ships six blocks, not seven. The specification below stands
> unchanged: supply a basis and the block goes back in as written.

A single number, set large in the display serif, counting sheets of paper not printed since RDM was founded.

*`[TBD]` vellen papier die we niet hebben afgedrukt sinds `[TBD founding year]`.*

**Note for the client.** This needs a defensible basis — an estimate per client file per year, stated in a footnote. An invented number on a real accountant's website is a bad idea. If no basis can be established, drop the block rather than fudge it; a vague sustainability claim is worth less than the space it occupies. Alternative if dropped: the same treatment applied to the number of client files handled digitally.

## Block 4 — Services preview

Four items, listed, not tiled. Each is a heading plus one sentence, with the whole block linking to `/diensten`.

- **Boekhouding** — *Van aankoopfactuur tot jaarrekening, volledig digitaal verwerkt.*
- **Fiscaliteit** — *Btw, personenbelasting, vennootschapsbelasting. Aangiftes op tijd, zonder herinnering van ons nodig.*
- **Advies** — *We bellen je als we iets zien, niet alleen als je belt.*
- **Starters** — *Van ondernemingsnummer tot eerste factuur, samen doorlopen.*

Service list inferred, not confirmed — see `notes.md` §1, item 4.

## Block 5 — The cashflow quote

The memorable element of the site. Full-bleed section in deep forest green, white type, generous vertical space, nothing else in the viewport.

> Money comes and goes, that's why they call it cashflow.

**Treatment.** Set in Playfair italic, large, centred, roughly 60% of the container width so it breaks over three lines. No quotation marks drawn as glyphs — the isolation does that work. No attribution line unless the client has a source. One slow horizontal drift on entry, a few pixels, once. Never loops.

**Language.** Kept in English deliberately: the pun is on *cash* and *flow*, and no Dutch rendering preserves it. Treated as a found object on a Dutch page, the way an English aphorism would appear in a Flemish magazine.

Client has not confirmed. Dutch alternatives if they insist:
- *Geld komt en gaat. Daarom heet het cashflow.* — keeps the sense, keeps the English term, loses nothing much. **Recommended fallback.**
- *Geld komt en gaat — daarom spreken we van cashflow.* — more formal, less punch.

## Block 6 — Proof

Contents depend on what RDM actually has. See `notes.md` §1, item 8.

**If testimonials exist:** three, with name, profession, and one sentence. No star graphics unless there is a review platform behind them. No stock portraits — real photographs or initials only.

**If none exist yet:** do not fabricate any. Substitute a credentials block instead: ITAA certification with registration number and a link to the public register, RPR Antwerpen, VAT number, professional insurance if applicable. For a new practice, verifiable credentials are stronger proof than three anonymous quotes, and honest.

## Block 7 — Simulator call to action

*Benieuwd wat het kost? Drie vragen, één richtprijs.*

*In minder dan twee minuten weet je wat je maandelijks betaalt. Vrijblijvend, en zonder dat je eerst je nummer moet achterlaten.*

**CTA:** Bereken je tarief

The second sentence is the differentiator: the price appears before the lead form, not behind it. Worth protecting if anyone proposes gating it.

---

# Page 2 — Diensten (`/diensten`)

Five blocks. Absorbs the platform content from astro.tax's separate page.

## Block 1 — Intro

**H1:** *Alles wat je boekhouding nodig heeft, op één plek.*

*Je hebt geen lijst met losse diensten nodig. Je hebt iemand nodig die je dossier van begin tot eind opvolgt. Dat doen we.*

## Block 2 — The services in full

Each service: heading, two or three sentences, and a plain list of what is included. No pricing here — pricing lives in the simulator, and repeating it creates two sources of truth.

**Boekhouding**
*Je aankoop- en verkoopfacturen, je bankverrichtingen, je afschrijvingen. Wij verwerken alles digitaal en houden je cijfers actueel — niet één keer per kwartaal, maar doorlopend.*
Inbegrepen: verwerking aankoop- en verkoopfacturen · bankkoppeling · btw-aangifte · jaarrekening · neerlegging bij de Nationale Bank

**Fiscaliteit**
*Aangiftes op tijd en correct, en advies voordat je een beslissing neemt in plaats van erna.*
Inbegrepen: btw-aangiftes · personenbelasting · vennootschapsbelasting · UBO-registratie · fiscale optimalisatie

**Advies**
*Zien we iets in je cijfers dat je geld kost of oplevert, dan nemen we contact op. Dat zit in je maandtarief, je krijgt er geen aparte factuur voor.*

**Starters**
*Een onderneming opstarten is vooral veel niet weten wat je moet weten. We lopen het samen door: ondernemingsvorm, ondernemingsnummer, btw-activering, je eerste factuur.*

`[TBD: confirm whether payroll, legal, or sustainability reporting are offered — none assumed]`

## Block 3 — Werkwijze (anchor `#werkwijze`)

The folded-in platform content. Four steps, and this is one of the few places where numbering is legitimate because it genuinely is a sequence.

1. **Kennismaking** — *We beginnen met een gesprek. Op kantoor in Antwerpen of via video, wat jou uitkomt. Je weet daarna precies wat we doen en wat het kost.*
2. **Je documenten, digitaal** — *Foto van een bonnetje, factuur per mail, of rechtstreeks via Peppol. Je hoeft niets te verzamelen, te nieten of binnen te brengen.*
3. **Wij verwerken** — *Je boekhouding loopt mee met je onderneming. Je ziet je cijfers wanneer je wil, niet wanneer het kwartaal afgesloten is.*
4. **We bespreken** — *Je jaarrekening overlopen we samen. Wat er in staat, wat het betekent, en wat je volgend jaar anders kan doen.*

Step 2 is where the paperless value stops being a claim and becomes a description of the client's own Tuesday.

## Block 4 — Overstappen

*Al een boekhouder? Overstappen is minder werk dan je denkt.*

*Je stapt over bij de start van een kwartaal. Jij laat je huidige kantoor weten dat je vertrekt — dat is één mail, we sturen je de tekst. De overdracht van je dossier regelen wij onderling.*

Genuinely reduces friction for the secondary audience, and it is the one piece of the astro model worth adopting wholesale because it reflects how Belgian practice actually works.

## Block 5 — CTA

Primary: Bereken je tarief. Secondary: Stel je vraag → `/contact`.

---

# Page 3 — Bereken je tarief (`/tarief`)

Full logic in `06-price-simulator-spec.md`. Content notes only here.

No marketing above the tool. The visitor clicked a button that said "calculate your rate" and they should see step one immediately. astro.tax puts a benefits list above the form; it delays the thing the visitor came for.

**H1:** *Bereken je tarief*
**Sub:** *Drie stappen. Je krijgt meteen een richtprijs, zonder je gegevens achter te laten.*

Progress indicator: three steps, current one marked. Numbered, because it is a sequence.

Step headings:
1. *Je onderneming*
2. *Je volume*
3. *Extra's*

**Result screen.** The figure set large in the display serif — an answer, not a pricing tier.

*Je richtprijs: **€ X per maand**, excl. btw.*

*Dit is een indicatie op basis van wat je invulde. Je definitieve tarief spreken we af tijdens de kennismaking — en dan ligt het vast.*

Beneath: what is included at that price, drawn from the answers given. Then the primary CTA, *Plan je kennismaking*, and beneath it *Liever eerst even bellen? `[TBD phone]`*.

**Demo marking.** While prices are invented, a visible marker must sit next to the result. See `notes.md` §4.

---

# Page 4 — Over ons (`/over-ons`)

Four blocks. This page carries path B on its own, so it has to do real work rather than being a formality.

## Block 1 — Opening

**H1:** *`[TBD]`* — depends on the founding story, which we don't have.

A working structure: why the practice was started, what the founders found wrong with how bookkeeping was being done, what they decided to do differently. Three paragraphs, first person plural, no corporate register. This is the page where a small firm beats a network firm, and it fails entirely if it reads like a brochure.

## Block 2 — The team

`[TBD: names, roles]`

> **Built without photographs (2026-09-14).** None were supplied, and `04` bans
> stock. The block is a ruled list — matching the services and werkwijze blocks —
> with each person's initials set in the display serif in place of a portrait,
> which `04` sanctions ("real photographs or initials only"). Initials are
> derived automatically from the name in `content.json`. When real portraits
> arrive they drop into the same list; nothing else changes.

Per person: initials or photograph, name, role, one line about what they handle, direct mail address. The direct mail address is the point — it proves the reachability claim in a way a paragraph cannot. A generic `info@` for everyone undercuts the whole positioning.

## Block 3 — Waar we voor staan

The four values, stated plainly, once, for the visitor who came looking for them. Same chain as the homepage, more room to explain. Sustainability gets its concrete grounding here: what paperless means operationally, what RDM does beyond paper, what it does not claim.

## Block 4 — Credentials and location

ITAA 53.374.753 with a link to the public register. RPR Antwerpen. BTW BE 1007.002.332. Address at Boomgaardstraat 145A, 2018 Antwerpen with a map, and a note on reaching it — public transport, parking.

---

# Page 5 — Contact (`/contact`)

Two blocks. The shortest page on the site, and the one the positioning is judged on.

## Block 1 — Reach us

Contact details first, form second. A site promising personal availability that leads with a web form is arguing against itself.

**H1:** *Spreek iemand.*

Then, in order: telephone `[TBD]`, mail `info@rdmaccountants.be`, WhatsApp `[TBD if offered]`, and the address.

**The availability line.** This is the sentence that needs the client decision in `notes.md` §4. Do not publish an unqualified "24/7". A bindable version, pending their commitment:

*Je belt je eigen accountant, niet een algemeen nummer. Tijdens de kantooruren nemen we op. Daarbuiten mag je ons mailen of appen — dringend is dringend.*

## Block 2 — Form

Short: name, mail, telephone, one message field, and a single dropdown for subject (nieuwe klant / overstappen / bestaande klant / iets anders). Nothing more. Every additional field costs completions.

Confirmation message, in the same voice, saying what happens next and by when: *We hebben je bericht. Je hoort van ons `[TBD: binnen welke termijn]`.*

Never state a response time the practice cannot keep. That number is a promise, and it is the promise the whole site rests on.
