# Wat we nog van jullie nodig hebben

De website staat klaar. Wat hieronder staat, kunnen wij niet zelf invullen —
het gaat over jullie kantoor, en we verzinnen liever niets op een site van een
gecertificeerd accountant.

Je hoeft dit niet in één keer te beantwoorden. Alles wat binnenkomt, zetten we
er meteen op.

---

## 1. Het belangrijkste: jullie telefoonnummer

De hele site zegt dat je je eigen accountant kan bellen. Op dit moment staat er
nergens een nummer. Dit is het enige punt dat de site op zichzelf laat
tegenspreken.

> **Telefoonnummer:** ______________________

## 2. Wat jullie beloven over bereikbaarheid

"24/7 bereikbaar" op een website is een belofte die één telefoontje op zondag om
23:00 kan breken, en dat beland dan in een Google-review. We zetten er liever
iets neer dat jullie altijd waarmaken.

Ons voorstel, pas het gerust aan:

> *Je belt je eigen accountant, niet een algemeen nummer. Tijdens de
> kantooruren nemen we op. Daarbuiten mag je ons mailen of appen — dringend is
> dringend.*

> **Akkoord? Of jullie versie:** ______________________
> **Binnen welke termijn krijgt iemand antwoord?** ______________________
> **Openingsuren:** ______________________
> **Bieden jullie WhatsApp aan?** ja / nee — nummer: ______________________

## 3. Jullie tarieven

De rekentool op de site werkt volledig, maar rekent nu met **verzonnen
bedragen**. Die moeten weg voor de site publiek gaat.

We hebben per onderdeel een bedrag nodig:

| | Nu (verzonnen) | Jullie tarief |
|---|---|---|
| Basis eenmanszaak | € 145 | |
| Basis vzw | € 165 | |
| Basis vennootschap | € 245 | |
| Omzet € 75.000 – 150.000 | + € 30 | |
| Omzet € 150.000 – 350.000 | + € 75 | |
| Omzet € 350.000 – 750.000 | + € 140 | |
| Omzet € 750.000 – 1.500.000 | + € 230 | |
| 26 – 75 documenten per maand | + € 35 | |
| 76 – 150 documenten per maand | + € 85 | |
| 151 – 300 documenten per maand | + € 160 | |
| Btw-vrijgesteld | − € 15 | |
| Btw per maand | + € 45 | |
| Per werknemer op de loonlijst | + € 40 | |
| Aangifte personenbelasting | + € 15 | |
| Alles digitaal aanleveren | − € 10 | |
| Starterskorting | − 20 % | |
| Jaarlijks vooruitbetalen | − 5 % | |
| Minimumtarief | € 125 | |

> **Prijzen exclusief of inclusief btw?** ______________________
> **Kloppen de grenzen** (omzetschijven, aantal documenten)? ______________________

## 4. Het team

Per persoon, voor de pagina Over ons:

| | Persoon 1 | Persoon 2 | Persoon 3 |
|---|---|---|---|
| Naam | | | |
| Functie | | | |
| Eén zin: wat volgt deze persoon op? | | | |
| Direct mailadres | | | |
| Foto | | | |

Dat directe mailadres is geen detail. Eén gedeeld `info@` voor iedereen haalt
precies de belofte onderuit waar de rest van de site op steunt.

## 5. Het kantoor

> **Oprichtingsjaar:** ______________________
> **Waarom is RDM opgericht?** Drie alinea's: waarom jullie begonnen zijn, wat
> jullie fout vonden aan hoe boekhouding meestal loopt, en wat jullie daarom
> anders doen. Geen brochuretaal — dit is de pagina waar een klein kantoor het
> wint van een groot kantoor.
>
> **Beroepsaansprakelijkheidsverzekering** (verzekeraar + polisnummer): ______
> **Dichtstbijzijnde halte en lijnnummers:** ______________________
> **Parkeren in de buurt:** ______________________

## 6. Duurzaamheid, concreet

Op de homepage staat een teller met het aantal vellen papier dat jullie niet
hebben afgedrukt. Dat cijfer moet ergens op steunen — bijvoorbeeld een
geschatte hoeveelheid per dossier per jaar, met die aanname erbij vermeld.

> **Waarop baseren we dat cijfer?** ______________________

Lukt dat niet, dan halen we het blok weg. Een duurzaamheidscijfer dat je niet
kan uitleggen is minder waard dan de ruimte die het inneemt.

> **Doen jullie nog iets anders dan papierloos werken?** Groene stroom,
> woon-werkverkeer, hosting, afvalbeleid. Alleen wat echt klopt: ____________

## 7. Diensten

We zijn uitgegaan van boekhouding, fiscaliteit, advies en starters.

> **Klopt dat?** ______________________
> **Bieden jullie ook loonadministratie, juridisch advies of
> duurzaamheidsrapportering aan?** ______________________

## 8. Juridisch — voor jullie jurist

De site heeft vier juridische pagina's. We hebben de structuur opgezet met de
verplichte onderdelen erin, maar de inhoud moet door een jurist komen. Het gaat
om een privacybeleid (GDPR), een cookiebeleid, algemene voorwaarden en een
disclaimer.

De algemene voorwaarden moeten aansluiten bij de ITAA-deontologie en bij de
verplichte opdrachtbrief, dus die kunnen we niet zelf schrijven.

> **Wie kijkt dit na?** ______________________
> **Is er een DPO aangesteld?** ja / nee — contactgegevens: ______________

Het cookiebeleid klopt op dit moment volledig: de site plaatst geen cookies,
gebruikt geen tracking en laadt niets van externe servers. Er is daarom ook geen
cookiebanner nodig. Voegen we later analytics toe, dan verandert dat en moet er
wél een banner komen.

## 9. Domeinnaam

`rdmaccountants.be` staat geregistreerd bij one.com en toont nu een parkeerpagina.

> **Wie beheert dat domein?** ______________________
> **Wanneer mag de site erop?** ______________________

---

## Kleine correctie

De gegevens die we kregen vermelden "Gecertificiëerd accountant". Correct
Nederlands is **"Gecertificeerd accountant"**, en zo staat het nu op de site.
Mogelijk staat de oude spelling ook op briefpapier, visitekaartjes of in de
ITAA-registratie — misschien de moeite om na te kijken.

---

### Voor intern gebruik

Elk antwoord hierboven hoort bij een sleutel in `content.json`:

| Vraag | Sleutel |
|---|---|
| 1 | `telefoon` |
| 2 | `bereikbaarheid`, `reactietermijn`, `openingsuren`, `whatsapp` |
| 3 | rule set in `site/assets/js/simulator.js` + `PRICES_CONFIRMED` |
| 4 | `team_1..3_naam` / `_functie` / `_rol` / `_mail` |
| 5 | `oprichtingsjaar`, `oprichtingsverhaal`, `verzekering`, `openbaar_vervoer`, `parkeren` |
| 6 | `papier_onderbouwing`, `duurzaamheid_extra` |
| 7 | `extra_diensten` |
| 8 | `av_*`, `pb_*`, `juridisch_bijgewerkt`, `_notities` |

Invullen in `content.json`, dan `python tools/apply_content.py`, dan
`bash tools/check.sh`.
