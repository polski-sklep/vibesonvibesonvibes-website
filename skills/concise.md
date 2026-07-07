---
name: concise
description: Use when the user wants the prior Claude answer compressed to its shortest form while losing no information — distinct from summarising, which drops information to save length. Triggers include "concise", "concise this", "compress that", "tighten this up", "shorter but keep everything", "make this concise", or invoking the skill on a just-generated answer. Also use when the user replies to or highlights a specific span and asks to shorten it. Do NOT use to summarise (which sheds information), to rewrite or improve content quality, to shorten the user's own text rather than Claude's, or to generate a fresh concise answer to a new question (the user's own brevity preferences govern that). Compresses by removing filler, hedging-that-is-filler, redundancy, and padding while preserving every fact, number, relationship, condition, and qualification. Output is bullet points by default unless the content is demonstrably ill-suited to them. Returns only the compressed content with no preamble or postamble.
compatibility: No special tools or dependencies. Operates entirely on conversation context. Works in Claude.ai, Claude Code, and all API surfaces.
license: MIT
metadata:
  author: Jacob Kowalewski (kowachefski)
  version: 0.3.1
---

# Concise

## OUTPUT CONTRACT — READ FIRST

**The first character of your response is the first character of the compression.** No line precedes it. No announcement, no orientation, no "here is the compressed version," no "Skill triggered."

Specifically forbidden as an opening (this list is not exhaustive — the rule is zero preamble):
- "Skill triggered. Output below is the compression of the prior answer."
- "Skill triggered."
- "Here's a more concise version:"
- "Here's the compression:"
- Any sentence describing what you are about to do before doing it

The output is the compressed content and nothing else. The only permitted non-compression text in the entire response is the floor note (when the content is already at the information floor) — see "The floor". There is no postamble either: the response ends on the last compressed item, with no "let me know if you want it shorter."

A compression skill that announces itself has already failed at concision before producing a word of output. Do not narrate. Compress.

**Emphasis is mandatory and on by default.** On every run (unless the user toggled it off), bold the single most load-bearing token in each point that has one — the number, value, name, or pivotal identifier the eye must land on. This is not optional and it is not satisfied by markdown headers rendering bold: headers are structure, not information, and structure is never the emphasis. If a compressed answer contains numbers, values, or named identifiers and none of them are bolded, the emphasis has failed to fire — that is a defect, not a clean run. Apply inline bold (`**token**`) to the information anchors themselves. See "Emphasis" below for the precise bar and the never-bold list. If the user toggled emphasis off ("plain", "no bold"), produce the same compression with zero bold.

---

Compresses the prior Claude answer to its shortest form while losing no information. The operation is **compression, not summarisation**: remove words, retain information. Summarisation sheds information to save length; this skill never does that.

The skill exists because "be concise" as a plain instruction drifts toward summarisation — the model shortens by deleting content, not by saying the same content in fewer words, and the loss is invisible because the result looks fine. This skill holds the harder line: maximum information retained at minimum length.

Distinct from any "concisely" preference the user has for fresh generation. That governs how a *new* answer is produced; this skill compresses an *already-generated* prior answer after the fact.

## The core distinction

| | Summarisation (NOT this) | Compression (this skill) |
|---|---|---|
| What it cuts | Information | Words |
| Example input | "The API rate limit, which is set at 100 requests per minute, may cause issues if exceeded." | same |
| Output | "Watch the API rate limit." | "API rate limit: 100 req/min — exceeding causes errors." |
| What survived | the topic | the topic, the number, the consequence |
| What died | the number, the consequence | only the filler |

The skill always does the right column. If shortening would require doing the left column — dropping information — it stops and reports the floor (see below).

## What must survive vs what can die

**Must survive (information — never cut):**
- Specific facts, numbers, names, values, thresholds, dates
- Logical relationships (X causes Y, A unless B, do X before Y)
- Conditions and caveats that change meaning (works *only if*, fails *when*)
- Distinctions the original draws (X differs from Y in that…)
- Steps in a procedure and their order
- Qualifications that bound a claim (true for X but not Y)
- Genuine uncertainty (see the hedging rule below)

**Can die (compressible — remove freely):**
- Filler and hedging that adds no information ("it's worth noting", "one important consideration", "may potentially")
- Redundancy — the same point stated twice
- Throat-clearing and transitions ("with that said", "moving on to")
- Explanatory padding around a point the compressed form makes self-evident
- Politeness scaffolding and engagement softeners

## The hedging boundary (the decisive rule)

Hedging splits into two kinds and they are treated oppositely:

- **Hedging that is filler** — soft phrasing for a definite claim. "This may potentially cause issues" where the original meant "this causes issues." Cut the hedge.
- **Hedging that is information** — genuine uncertainty the original held. "This may fail" where the original genuinely did not know whether it fails. Keep the hedge.

Flattening genuine uncertainty into a flat assertion ("may fail" → "fails") is information loss disguised as compression, and it is the most dangerous failure this skill can have: it looks like tight confident writing while asserting something the original did not.

**Default: when unsure whether a hedge is filler or information, keep it.** False confidence is a worse failure than a slightly longer bullet.

## Format

**Bullet points are the standard.** The skill bullets by default.

Non-bullet output requires the skill to **affirmatively assess that the content is ill-suited to bullets before producing any other format.** The bar is high and specific:

- Content is ill-suited to bullets ONLY when bulleting would **sever a logical relationship that carries information** — a causal or conditional chain where each step depends on the last and the dependency is part of the meaning.
- Aesthetic preference, flow, readability, "it reads better as prose" — none of these clear the bar.
- If the skill cannot name the specific connective logic (the "therefore", the "only because", the dependency between steps) that bulleting would destroy, it bullets.
- The burden of proof is on prose, and the proof is information loss, not taste.

A single compressed answer may be mostly bullets with one short compressed-prose passage where a genuine causal chain lives. That is correct — the skill keeps prose only for the passages where severing the connection loses information.

**Within bullets:**
- Shallow nesting (one level) allowed where it preserves a real grouping; flat preferred otherwise; no deep trees.
- Compress to fragments where the fragment loses nothing ("API limit: 100 req/min").
- Keep enough grammar to preserve relationships — a bullet stating a conditional ("X fails if Y unset") keeps the "if", because dropping it loses the condition. Cut words, not information, even inside a single bullet.

## Emphasis (on by default, toggleable off)

By default the skill bolds the single most load-bearing token or short phrase per point, to make the output scannable. This is pure typography on information already present — it adds nothing, selects nothing, ranks nothing. It makes the existing key token easy for the eye to land on.

**The bar for emphasis is high, and sparse is the goal.** Over-emphasis destroys scannability the same way over-compression destroys intelligibility — if half the words are bold, nothing stands out. Emphasis is reserved for the one token the reader's eye must land on, and nothing else.

**What gets emphasis (at most one per point):**
- The specific number, value, or threshold ("**100 req/min**")
- The specific name or identifier where it is the point of the bullet
- The pivotal condition word where a single word carries the whole condition (rare)

**Numbers take priority over names.** When a point contains both a figure (number, value, threshold, multiple) and a name, the figure is the bold target — not the name. A name anchors the bold only when the point has no figure and the name is the load-bearing token. Names are the fallback anchor; numbers are the primary. Observed failure: bolding "Safe Ecosystem Foundation" and "Safenet" (names) while leaving "~$35B", "61M accounts", "$1.4T+", "5x" (figures) plain — in a passage about scale and revenue, the figures are the information and must carry the bold. A name-only point (e.g. "Two entities: **Safe Ecosystem Foundation** and **Safe{Labs}**" with no figure) correctly bolds the name — that is the fallback working, not a violation.

**One headline figure per bullet, even in data-dense bullets.** A bullet with many figures still gets exactly one bold — the headline figure, the single number the bullet is most about. Not all of them. The headline figure is the one the bullet is primarily reporting: usually the first or largest, the one that survives if you cut the bullet to a single number. Example: "Scale: **~$35B** assets secured, 61M accounts, $1.4T+ cumulative, $150B+ trailing, ~2% of $340B market" — only ~$35B is bold (the bullet is labelled Scale and $35B is the headline; the rest are supporting figures and stay plain). The one-bold-per-point rule does not bend for data density.

**What never gets emphasis:**
- Consequences, outcomes, results ("errors", "fails", "pile up") — these follow from the information, they are not the information
- Verbs, connectives, descriptive words
- Anything where bolding is "this seems important-ish" rather than "the eye must land here"

**Most points get one emphasised token; some get none.** A point whose information is spread across the whole bullet with no single load-bearing anchor gets no bold. The skill does not bold something in every bullet for consistency — forcing emphasis where there is no anchor is the dilution failure. Sparse, anchored emphasis only.

Example: "API rate limit: **100 req/min** — exceeding causes errors." One bold token (the number). "errors" stays plain — it is the consequence, not the information.

**The inversion failure (observed, do not repeat).** A real failure mode: the output bolds section headers (or leaves markdown headers rendering prominent) while leaving the actual information tokens — the numbers, values, identifiers inside the bullets — plain. This is the emphasis exactly backwards. Headers are structure and structure is never emphasised; the information anchors are what must be bold. Concretely, in a compressed answer containing "$460K depth" and option strikes and tenor values, those tokens (**$460K**, the strike figures, the tenor) must be the bolded ones — not the headers above them. If the headers are the most prominent thing on screen and the numbers are plain, the emphasis has inverted and failed. Bold flows to the information, never to the scaffolding.

**Self-check before producing output:** does the compressed answer contain numbers, values, or named identifiers? If yes, are those tokens the ones bolded (not headers, not consequences)? If the answer has information anchors and none are bold, the emphasis did not fire — apply it before responding.

**This does not violate the no-editorialising rule.** Emphasis falls on a token *within* a point; it does not declare which points are key, does not reorder by importance, does not add a "key takeaways" line. It is typography on the most information-dense token, not a judgement about which information matters.

**Toggle off** when the user says so ("no bold", "plain", "concise without highlighting", "no emphasis"). When off, the same compression is produced with no bolding at all.

## What the skill operates on

**Default target: the most recent substantive Claude answer.** Skip trivial acknowledgments — if Claude's last turn was "Sure, happy to help," target the substantive answer before it. Ask only when genuinely ambiguous (e.g. the last substantive turn had multiple distinct parts and it is unclear which the user means).

**Override: a reply-to or highlighted span.** When the user replies to or highlights a specific piece of text, that span is the target, not the last answer. The skill:
- Compresses ONLY that span
- Returns ONLY the compressed span — it does not re-emit the surrounding answer
- Applies the bullets-default to the span the same as anywhere (a highlighted prose span still compresses to bullets unless it clears the ill-suited bar)

A named target in words ("concise the part about rate limits") works too, but a reply-to/highlight is the primary override.

## Output

**The compressed content is the entire response.** Nothing surrounds it:
- No preamble ("Here's a more concise version:")
- No postamble ("Let me know if you want it shorter")
- No change log of what was cut

A compression skill that pads its own output with framing is self-defeating. The user can see the original above in the conversation; the compression speaks for itself.

**The only permitted addition** is the floor note (below), because that is information the user needs, not filler.

**Change log on request only.** If the user asks what was cut, report it. Never volunteer it.

## The floor

The compression floor is **the shortest length at which no information is lost AND the content remains fully intelligible.** Intelligibility is a retention criterion: a compression so terse the reader cannot reconstruct the meaning has lost the information in practice even if the words are technically present. "API limit: 100 req/min — exceeding causes errors" is at the floor; "API 100/min err" is below it (broken).

When the content is already at the floor — everything remaining is information, nothing remaining is filler — the skill says so rather than compressing further:

> This is already at the information floor — further shortening would drop content, not filler.

This matters most under repeated invocation. A user invoking concise again and again must not force the skill to start dropping information to keep shortening. Hitting the floor and saying so is a correct output, not a failure.

## Discipline rules

1. **No summarisation drift.** Never drop a must-survive item to achieve shortening. If further shortening requires cutting information, stop and report the floor. Length is sacrificed to retention, never the reverse. (Held hardest.)
2. **No false-confidence flattening.** Preserve hedges that carry uncertainty; default to keeping a hedge when unsure whether it is information or filler. (Held hardest — this failure looks like success.)
3. **No self-padding.** No preamble, no postamble, no change log unless asked. The output is the compression. Banned openers include "Skill triggered.", "Output below is the compression…", "Here's a more concise version:", and any sentence describing the operation before performing it. See the OUTPUT CONTRACT at the top of this file — it is the hardest rule in the skill because a self-announcing compression skill has failed at its one job.
4. **No format-default erosion.** Bullets unless the content is affirmatively assessed as ill-suited (a severed logical relationship the skill can name). Burden of proof on prose.
5. **No over-compression into unintelligibility.** The floor includes intelligibility. A compression the reader cannot parse has lost the information even if the words are present.
6. **No editorialising.** Compress what is there; do not improve, correct, reorder by importance, or add. A weak point in the original is preserved compressed, not fixed. The skill is a compressor, not a reviser. If the user wants the content improved, that is a different request.
7. **Emphasis is mandatory, sparse, and on the information.** On every run (unless toggled off), bold the single most load-bearing token per point that has one — the number, value, name, or pivotal condition. **Numbers take priority over names: when a point has both a figure and a name, the figure gets the bold; a name anchors only when there is no figure.** One headline figure per bullet even when the bullet is data-dense — not all figures, just the one the bullet is most about. Most points get one bold token; some get none. Four failures to avoid: (a) *not firing* — an answer with numbers/values where none are bold; (b) *dilution* — more than one anchor per point bold; (c) *inversion* — bolding headers or structure while information tokens stay plain; (d) *name-over-number* — bolding a proper noun while the figure in the same point stays plain. Bold flows to the information, never to scaffolding or consequences. Toggleable off ("plain", "no bold").

Plus: no emoji. The output is the content, not a conversation about the content.

## Examples

### Example 1 — Standard compression to bullets

Prior answer: "There are a few things worth considering when you're setting up the database connection. First, you'll want to make sure the connection pool size is configured appropriately — the default is 10, but for a high-traffic application you might want to bump that up to somewhere around 50. Also, it's important to remember to set a connection timeout, otherwise hung connections can pile up. A good default for that is 30 seconds."

User: "concise"

Output:
- Connection pool size: default **10**; raise to **~50** for high traffic
- Set a connection timeout (default **30s**) — without it, hung connections pile up

What survived: the numbers (10, 50, 30s), the conditional (high traffic), the consequence (hung connections pile up). What died: "there are a few things worth considering", "first", "you'll want to make sure", "it's important to remember", "a good default for that is". Emphasis (default on) falls only on the load-bearing numbers — not on "high traffic", "timeout", or "pile up", which are context and consequence, not the information anchor.

### Example 2 — Hedge preservation

Prior answer: "Migrating to the new auth system will probably fix the token refresh bug, though I'm not certain it addresses the underlying session race condition — that may need a separate fix."

User: "concise"

Output:
- New auth system will likely fix the token refresh bug
- Uncertain whether it addresses the underlying session race condition — may need a separate fix

The hedges ("likely", "uncertain whether", "may need") are kept — they carry genuine uncertainty the original held. Flattening to "fixes the bug; needs a separate fix for the race condition" would assert certainty the original did not have. No emphasis here — neither point has a single load-bearing token (no number, value, or pivotal identifier); the information is spread across each bullet, so nothing is bolded. Forcing a bold for consistency would be the dilution failure.

### Example 3 — Content ill-suited to bullets

Prior answer: "The reason the cache invalidation has to happen before the write completes is that if you invalidate after, there's a window where another request can read the stale value and re-populate the cache with it, which means the invalidation you just did is immediately undone."

User: "concise"

Output (compressed prose, not bullets): "Invalidate the cache before the write completes, not after — invalidating after leaves a window where another request reads the stale value and re-populates the cache, undoing the invalidation."

This is one causal chain where each step depends on the last (before/after → window → stale read → re-populate → undone). Bulleting would sever the dependency. The skill can name the severed logic, so it clears the ill-suited bar and keeps compressed prose. Note it still compressed — "the reason… is that" and other filler is gone.

### Example 4 — Floor reached

Prior answer (already compressed, from a previous concise pass): "Pool size: 10 default, 50 for high traffic. Timeout: 30s default — prevents hung connection pileup."

User: "concise"

Output:
> This is already at the information floor — further shortening would drop content, not filler.

Every remaining token is information. The skill does not summarise to shorten further.

### Example 5 — Highlighted span

User highlights one paragraph of a five-paragraph answer and replies "concise".

Output: only the compressed version of that paragraph, as bullets (unless it clears the ill-suited bar). The other four paragraphs are not re-emitted.

## Troubleshooting

### The compression lost a number or a caveat
**Cause:** summarisation drift (discipline rule 1) — the skill cut information, not just words.
**Solution:** every fact, number, condition, and qualification is must-survive. Re-compress preserving them. If they cannot fit at the target length, the floor is higher than the target — report the floor rather than dropping them.

### The compression made an uncertain claim sound certain
**Cause:** false-confidence flattening (discipline rule 2).
**Solution:** restore the hedge. "May fail" is not "fails". When unsure whether a hedge is filler or information, keep it.

### The output has "Here's the concise version:" before it
**Cause:** self-padding (discipline rule 3).
**Solution:** remove it. The compressed content is the entire response.

### The skill produced prose when bullets would have worked
**Cause:** format-default erosion (discipline rule 4) — prose chosen on aesthetics, not information loss.
**Solution:** bullets are the standard. Prose requires a nameable severed logical relationship. If none can be named, re-do as bullets.

### The compression is so terse it's hard to understand
**Cause:** over-compression past the floor (discipline rule 5).
**Solution:** the floor includes intelligibility. Add back the grammar needed to parse the meaning — that is not filler, it is part of retention.

### The user wanted the content improved, not just shortened
**Cause:** request mismatch — this skill compresses, it does not revise.
**Solution:** the skill compresses faithfully, preserving weak points compressed. If the user wants quality improved, that is a separate request handled outside this skill.

### Too much of the output is bold
**Cause:** emphasis dilution (discipline rule 7) — bolding more than the single load-bearing token per point, or forcing a bold where there is no anchor.
**Solution:** at most one emphasised token per point, only on the information anchor (number, value, name, pivotal condition), and none where the point has no single anchor. If half the output is bold, the scannability is gone. Re-emphasise sparsely, or toggle emphasis off if the user asked for plain.

### Nothing is bolded even though the answer has numbers and values
**Cause:** emphasis failed to fire (discipline rule 7a) — the default-on emphasis was not applied. The most common silent failure.
**Solution:** emphasis is mandatory on every run unless toggled off. If the compressed answer contains numbers, values, or named identifiers, those tokens must be bolded. Run the self-check: are the information anchors bold? If not, apply emphasis before responding.

### The headers are bold but the numbers inside the bullets are plain
**Cause:** emphasis inversion (discipline rule 7c) — bold landed on structure instead of information.
**Solution:** headers are structure and are never the emphasis target. The numbers, values, and identifiers inside the points are. Move the bold off the scaffolding and onto the information tokens.

### Names and entities are bold but the figures next to them are plain
**Cause:** name-over-number failure (discipline rule 7d) — the bold went to a proper noun while a figure in the same point stayed plain.
**Solution:** numbers take priority over names. When a point has both, the figure gets the bold. A name anchors only when the point has no figure. In a quantitative passage (scale, revenue, market share), the figures are the information — bold those, not the entity names. A name-only point still correctly bolds the name; that is the fallback, not this failure.

### The response opened with "Skill triggered" or "Here's the concise version"
**Cause:** preamble (output contract + discipline rule 3) — the skill announced itself instead of just compressing.
**Solution:** the first character of the response is the first character of the compression. No announcement, no orientation, no banner. Re-read the OUTPUT CONTRACT at the top. The only permitted non-compression text is the floor note.

## When to decline running the skill

- The user wants a summary (information deliberately dropped to save length). That is summarisation, a different operation. Clarify if ambiguous.
- The user wants their own text shortened, not Claude's. The skill targets Claude's prior answer; redirect or clarify.
- The user wants the content rewritten or improved. The skill compresses, it does not revise.
- The user wants a fresh concise answer to a new question. That is governed by the user's own brevity preferences for generation, not this post-hoc compression skill.
