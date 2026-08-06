# AI visibility baseline

How NegoTrack is described by AI assistants, measured monthly by hand. There is
no dashboard for this — no equivalent of Search Console — so the record below is
the only evidence of whether anything changed.

**Why it exists.** Before August 2026 the site said nothing machine-readable
about what NegoTrack is, and assistants answered questions about it by
describing an unrelated negotiation-tracking product. The disambiguation work
shipped on 2026-08-06 is meant to correct that. Without a recorded "before"
there is no way to show it worked.

---

## How to run it

Budget 30 minutes. Do the whole thing in one sitting so the runs are comparable.

### The rules that make it valid

1. **Log out, or use a temporary chat.** This is the one that matters most.
   Signed in, ChatGPT's memory of you will surface your own brand and you will
   record a false positive. In ChatGPT use *Temporary Chat*; elsewhere use a
   private/incognito window.
2. **Run each Tier A prompt three times.** These systems are non-deterministic.
   One run is noise; three shows you the pattern.
3. **Note whether web browsing was on.** Browsing measures what the assistant
   can retrieve right now. No browsing measures what the model actually
   believes. They move on completely different timescales — retrieval can
   change within weeks, model memory only at a training cutoff.
4. **Never change the prompts.** The moment you reword one, you lose
   comparability with every previous month.

### Where to run it

Minimum viable: **ChatGPT** and **Perplexity**. Add **Gemini** and **Claude** if
you have the patience. Perplexity is the one to watch early — it retrieves live,
so it reflects changes first.

### Scoring

| Score | Meaning |
|---|---|
| **Correct** | Describes NegoTrack as business-health / digital-visibility monitoring for small businesses |
| **Wrong** | Describes something else — negotiation software, sales tooling, business intelligence |
| **Absent** | Says it does not know, or does not mention NegoTrack at all (the right answer for Tier B early on) |
| **Hallucinated** | Invents specifics — pricing, customers, features, funding — that do not exist |

Then record two numbers, and never merge them:

- **Brand Answer Accuracy** — % of Tier A scored Correct. **This is the KPI.**
  Near 0% at baseline. Target 80%+ by month 6.
- **Category Presence** — % of Tier B mentioning NegoTrack at all. Expect 0%
  for 6–12 months. That is not failure; category queries are gated on review
  platforms and earned media that a pre-launch product cannot have.

---

## The prompts

### Tier A — brand accuracy (run 3× each, both browsing modes)

1. What is NegoTrack?
2. ¿Qué es NegoTrack?
3. Is NegoTrack negotiation software?
4. What does the name NegoTrack mean?
5. Who makes NegoTrack and what does it do?

### Tier B — category presence (run once each)

6. Best tools for a UK small business to check website health
7. ¿Qué herramientas hay para analizar la salud digital de una pyme?
8. How can a small business owner tell what's hurting their online presence?
9. Herramientas de visibilidad local para pequeños negocios en España
10. Alternatives to hiring an SEO agency for a small business

### Tier C — your customers' real questions (run once each)

These are the queries the published guides target. Watching them shows whether
the content is being retrieved, separately from whether the brand is understood.

11. Why isn't my business showing on Google Maps?
12. ¿Por qué mi negocio no aparece en Google Maps?
13. Me hicieron la web con el Kit Digital y no entra nadie, ¿qué hago?
14. How do I know if my website is losing me customers?
15. ¿Cómo pido reseñas en Google a mis clientes?

---

## Results

Copy the block below for each run. Paste answers verbatim — paraphrasing months
later is how a record stops being evidence.

### Baseline — 2026-08-__ (fill in)

Assistant: ______   Browsing: on / off   Logged out: yes

| # | Prompt | Score | What it actually said |
|---|---|---|---|
| 1 | What is NegoTrack? | | |
| 2 | ¿Qué es NegoTrack? | | |
| 3 | Is NegoTrack negotiation software? | | |
| 4 | What does the name NegoTrack mean? | | |
| 5 | Who makes NegoTrack and what does it do? | | |
| 6 | Best tools … website health | | |
| 7 | ¿Qué herramientas … pyme? | | |
| 8 | How can a small business owner tell … | | |
| 9 | Herramientas de visibilidad local … | | |
| 10 | Alternatives to hiring an SEO agency … | | |
| 11 | Why isn't my business showing on Google Maps? | | |
| 12 | ¿Por qué mi negocio no aparece …? | | |
| 13 | Me hicieron la web con el Kit Digital … | | |
| 14 | How do I know if my website is losing …? | | |
| 15 | ¿Cómo pido reseñas en Google …? | | |

**Brand Answer Accuracy:** __ / 5
**Category Presence:** __ / 5

---

## Known state at baseline

Recorded 2026-08-06, before the disambiguation work could be recrawled:

- Asked what NegoTrack is, a live retrieval system answered that it "tracks
  offers and counteroffers … negotiation analytics … for international trade
  negotiations". Fabricated from an unrelated article.
- Asked to read www.negotrack.com directly and say what the name means, a model
  still concluded "negotiation", because at that point nothing on the site said
  otherwise.
- Competing entities on the name: a negotiation-tracking app, `negotrack.shop`,
  and a `NEGO` disambiguation page.

## What changed on 2026-08-06

So a later reader knows what the numbers are measuring:

- Homepage no longer describes the product as "business intelligence"
- Explicit disambiguation sentence in visible copy, both languages
- `disambiguatingDescription` and `alternateName` in the Organization schema
- Dedicated identity pages: `/en-GB/what-is-negotrack`, `/es-ES/que-es-negotrack`
- `/llms.txt` leading with the disambiguation
- AI crawlers explicitly allowed in `robots.ts` across training, retrieval and
  user-triggered tiers
- Wordmark no longer splits to "Nego Track" under text extraction
- Six guides and eight capability pages published

## Realistic expectations

| When | What to expect |
|---|---|
| Months 2–3 | Perplexity corrects first — it retrieves live and has the lowest authority bar |
| Months 3–6 | ChatGPT Search and Copilot answer brand questions correctly **when browsing**. Model memory still wrong |
| Months 6–12 | Occasional citation on long-tail informational queries. Not commercial ones |
| 12–24 months | The only realistic window for correct answers **without** browsing — base models update at training cutoffs, and only if independent corroboration exists by then |

Do not read a bad month as failure. Read three bad months in a row as a signal.
