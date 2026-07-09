---
name: unpack
description: Use when the user wants to engage with material that would otherwise be too time-consuming, via a manual depth-ratchet: it gives the shallowest useful summary first, and the user pulls the lever to go progressively deeper only on what interests them. Triggers include "unpack this", "unpack:", pasting an article/paper/link/document and asking to unpack or summarise-then-expand it, or naming a concept to explain progressively. The ladder: rung 1 is two sentences surfacing the hook, rung 2 is two paragraphs, both plain-language with no equations, rung 3 is a full treatment with a visualisation where it helps, and each further pull ("more", "deeper") goes exponentially deeper — mechanics, foundations, edge cases. The USER holds every gate; the skill ends each rung silently and never auto-escalates or guesses their interest. Accepts pasted text, URLs (fetched), attached documents, or named concepts. Do NOT use to compress a prior answer (that is concise) or to rewrite in the user's voice (that is humanizer).
compatibility: Uses web fetch when the input is a URL, and reads attached documents when supplied. Works from the model's own knowledge for named concepts and pasted text. No local filesystem or code execution required. Visualisations render inline. Works in Claude.ai, Claude Code, and API surfaces; URL fetching and document reading depend on those capabilities being available in the surface.
license: MIT
metadata:
  version: 0.3.0
---

# Unpack

A manual depth-ratchet for material too time-consuming to engage with fully. The user chucks in material — an article, a paper, a link, a document, or a named concept — and the skill gives the shallowest useful summary. If it interests the user, they pull the lever and get more. If not, they walk away having spent ten seconds. Depth on demand, gated entirely by the user.

The time saving comes from the user bailing early on most things and going deep only on the few that earn it. That only works if two things hold: the user holds every gate (the skill never guesses their interest), and each rung is genuinely useful for the triage decision at that rung — especially rung 1.

## The hard contract (read first)

1. **The USER holds every gate. Never auto-escalate. End each rung silently.** Give one rung, then STOP. Do NOT append a lever offer, a "pull for more" line, a "want the full treatment?" prompt, or any call-to-action. The user knows they can go deeper — they invoked a depth-ratchet. The silence after the rung IS the gate; the user pulls the lever with any continuation word when they want more. Announcing the stop is redundant engagement-milking and is banned. Do not continue to the next rung until the user signals. Do not guess what interests them.
2. **Rung 1 surfaces the HOOK, not a neutral precis.** Two sentences that make the user able to decide whether to go deeper — the crux, the counterintuitive part, the claim, the "why this matters". NOT "This examines X using method Y and finds Z." See "Rung 1 is the whole game".
3. **Each rung adds a genuinely deeper LAYER, never re-explains the last one louder.** Going deeper means new information — mechanics the previous rung omitted, foundations under it, edge cases, sources — not the same content with more words. If the skill has nothing genuinely deeper to add, it says so rather than padding.
3a. **The register ladder is as binding as the length ladder. NO FORMALISM UNTIL RUNG 3.** Each rung has a technical *level*, not only a word count:
   - **Rung 1:** plain language. Zero jargon, zero notation, zero equations. The hook in words a smart non-specialist reads once.
   - **Rung 2:** plain language still. The intuition and the mechanism, in words. NO equations, NO notation, NO named technical objects (no metric components, no Greek-letter parameters, no formulae). If a term of art is unavoidable, it is explained in the same sentence it appears.
   - **Rung 3:** full treatment. Technical terms may now be introduced, each explained as it appears. First formalism allowed here, and only if the previous rungs motivated it in plain language.
   - **Rung 4+:** the mathematics, the derivations, the primary literature, the notation.
   
   **The binding rule: no rung introduces formalism that the previous rung did not motivate in plain language.** Rung 2 reaching for an equation before rung 3 has explained what the objects in it are is a violation, and it collapses the ladder — if rung 2 is already at specialist level, rungs 3-6 have nowhere to go but more equations, and the user loses the ability to stop at the depth they actually wanted. **Observed failure (never repeat):** asked to unpack "black holes", rung 1 gave a perfect plain-language hook (the singularity is a moment in time, not a place in space), then rung 2 immediately produced g_tt and g_rr sign flips in the Schwarzschild metric, tidal forces as M/r³ ~ 1/M², and T = ℏc³/8πGMk. That is rung 4-5 material delivered at rung 2. The ladder skipped two rungs and the topic's technical gravity pulled the register down. Resist it. Rung 2 explains why the horizon is one-way and what Hawking radiation *is*, in words, before any rung states what its temperature *equals*.
   
   The model will believe its equation is the clearest statement of the idea. It is not, at rung 2. If the mathematics genuinely is the point, the user gets it one lever-pull later at no cost.
4. **The lever is any continuation signal.** "more", "deeper", "go on", "next", "unpack", "+", or anything that clearly means continue → pull the lever, give the next rung. The user never has to remember an exact word.
5. **Detect the input, route it, then run the same ladder.** URL → fetch. Attached document → read. Pasted text → use directly. Named concept → explain from knowledge. The ingestion differs; the ladder is identical.

## The ladder

Five-plus rungs. The first three are fixed; rung 3 onward is continuable and each pull goes exponentially deeper.

**Rung 1 — Two sentences. The hook. Plain language, zero jargon.**
The shallowest triage. Two sentences that surface what would make this worth the user's time: the central claim, the surprising result, the crux of the argument, the reason it matters. Not a description of what the material is *about* — a statement of what it *says* or *is* that lets the user decide. No notation, no equations, no terms of art.

**Rung 2 — Two paragraphs. Enough to commit. STILL plain language.**
For when rung 1 hooked them and they want enough to decide whether the full treatment is worth it. The core argument or explanation, its main moves, the key evidence or mechanism, the essential caveat. Enough that they could hold a conversation about it. **No equations, no notation, no named technical objects.** The mechanism explained in words: what happens and why, not what it equals. A term of art only if unavoidable and explained in the same sentence. If the topic pulls toward formalism, resist — that is rung 3+.

**Rung 3 — Full treatment, with a visualisation where it helps. First formalism allowed.**
The complete explanation the material warrants — the full argument with its structure, the concept explained properly, the context that makes it land. Technical terms may be introduced here, each explained as it appears, and only where the previous rungs motivated them in plain language. Include a visualisation ONLY when it genuinely aids understanding (a process → flow diagram, data → chart, a structure or relationship → diagram, a spatial or system concept → illustrative visual). Do not force a visual onto material that is not visual; a forced diagram is worse than none. The skill picks the form that fits.

**Rung 4+ — Exponentially deeper, continuable.**
Each further pull goes to a genuinely deeper layer, roughly doubling depth and specificity each time. There is always somewhere deeper to go until the material is exhausted:
- The mechanics under the explanation — how it actually works, step by step.
- The foundations under the mechanics — the theory, the maths, the first principles.
- The edge cases, failure modes, controversies, open problems.
- The primary sources, the specific citations, the technical literature, the exact derivations.
- Adjacent material that deepens understanding — what this connects to, what it contradicts, what it builds on.

Each rung is new information, never a louder restatement. When there is genuinely no deeper layer left that the skill can responsibly provide, it says so plainly ("That is about as deep as I can take this reliably — beyond here you would want [the primary source / a specialist / the specific paper]") rather than padding or fabricating depth.

## Rung 1 is the whole game

The skill's entire value rests on rung 1 being triage-useful. A bland rung 1 makes the user bail on things they would have found interesting and continue on things they would not. The test for every rung-1 summary: **does this let the user decide whether to go deeper?** If it is a neutral description, it fails.

Bad rung 1 (neutral precis, useless for triage): "This paper investigates the relationship between X and Y using a longitudinal study of Z, and discusses implications for the field."

Good rung 1 (surfaces the hook): "This paper argues the standard way everyone measures X is systematically wrong, and the error gets bigger the more careful you are. If it holds, a chunk of the existing literature is measuring an artefact."

The good version tells the user what is *at stake* and lets them decide in one read. The bad version could describe a thousand papers and helps them decide nothing.

For **supplied material** (article, paper, document), rung 1 answers: what does THIS specific piece say that is worth your time? For a **named concept**, rung 1 answers: what IS this and why would you care? Both two sentences, both surfacing the hook, but the triage question differs by whether the user gave material or a topic.

## Input detection and routing

Look at what the user handed over and route it:

- **A URL** → fetch the content first, then unpack it. If fetching is unavailable or fails, say so plainly and offer to unpack pasted text instead. Do not fabricate the content of a link you could not read.
- **An attached document** (PDF, file in the conversation) → read it, then unpack. Handle its full content, not just the first page.
- **Pasted text** → unpack it directly. No fetching needed.
- **A named concept or topic** with no supplied material ("unpack sheaf cohomology", "unpack the Byzantine generals problem") → explain from the model's own knowledge, running the same ladder. State confidence honestly; if the concept is one the skill does not know well, say so rather than confabulating depth.

The ingestion differs by source. Once the content is in hand, the ladder is identical regardless of where it came from.

## Output shape

- **One rung per turn.** Give the current rung, then stop.
- **End each rung silently. No lever offer, no CTA.** After the rung, stop. Do not append "pull for more", "want the full treatment?", "go deeper?", or any prompt. The user knows they can continue; the silence is the gate. Announcing it is redundant.
- **No preamble.** Do not restate the request or announce the rung mechanics. Rung 1 starts with the hook.
- **Rung 3+ can use structure** (headers, numbered mechanics, a diagram) because the material is now substantial. Rungs 1 and 2 stay prose — they are short enough not to need structure and structure would slow the triage read.
- **The visualisation** at rung 3+ is inline, the form chosen to fit the material, included only when it aids understanding.

## Discipline rules

1. **User holds the gate.** One rung, then stop and wait. Never auto-escalate. Never guess interest. (Held hardest — it is the whole point.)
2. **Rung 1 surfaces the hook.** Triage-useful, not a neutral precis. The test: can the user decide whether to go deeper from this alone?
3. **Every rung is new depth.** Genuinely deeper information, never the previous rung restated louder. Padding is a failure.
3a. **No formalism until rung 3. The register ladder binds as hard as the length ladder.** Rungs 1 and 2 are plain language — no equations, no notation, no named technical objects. Formalism starts at rung 3, and only where the previous rungs motivated it in words. No rung introduces formalism the previous rung did not motivate. A rung-2 equation collapses the ladder and steals the user's ability to stop at the depth they wanted. (Held hardest alongside the gate.)
4. **Honest depth ceiling.** When there is no responsible deeper layer left, say so and point to the primary source. Never fabricate depth or confabulate detail to keep the ladder going.
5. **Honest ingestion.** A link that would not fetch, a document that would not read, a concept not known well — stated plainly, never faked.
6. **No engagement-milking, no CTA.** End each rung silently. No lever offer, no "pull for more", no cliffhanger, no "you won't believe how deep this goes". The user invoked a depth-ratchet and knows they can pull the lever. The skill is a tool, not a cliffhanger machine. Announcing the stop is the exact engagement-optimisation closer to avoid.

## Examples

### Example 1 — Pasted paper, user stops at rung 2

User pastes a dense economics paper, "unpack this".
- Rung 1 (two sentences, the hook): the paper's central counterintuitive claim and what is at stake if it holds.
- User: "more".
- Rung 2 (two paragraphs): the argument's main moves, the key identification strategy, the essential caveat.
- User: "that's enough". Skill stops. Total user time: under a minute, and they got the real content, not a neutral abstract.

### Example 2 — Named concept, driven deep

User: "unpack eigenvectors".
- Rung 1: what an eigenvector is and why it matters, framed as the hook (the direction a transformation does not rotate).
- Rung 2: the geometric intuition plus the defining equation.
- Rung 3: full treatment — computation, what eigenvalues mean, a visualisation of a transformation acting on its eigenvectors versus other vectors.
- Rung 4: the mechanics — how to actually find them, the characteristic polynomial.
- Rung 5: foundations — diagonalisation, the spectral theorem, why symmetric matrices are special.
- Rung 6: edge cases and applications — defective matrices, complex eigenvalues, PageRank, PCA, where it connects. Each rung genuinely deeper, never a restatement.

### Example 3 — URL

User pastes a link, "unpack".
- Skill fetches the page. If fetch succeeds: rung 1 on the actual content. If fetch fails: "I couldn't fetch that link. Paste the text and I'll unpack it."

## Troubleshooting

### The skill dumped a full explanation when the user only asked to unpack
**Cause:** auto-escalation (discipline rule 1). It ran past rung 1 without the user pulling the lever.
**Solution:** one rung per turn, then stop and wait silently. Rung 1 is two sentences and nothing more — no lever offer, no CTA. The user decides whether to continue.

### Rung 1 was a neutral description and the user couldn't tell if it was interesting
**Cause:** rung 1 gave a precis, not the hook (discipline rule 2).
**Solution:** rung 1 must surface the crux, claim, or counterintuitive part — what is at stake, what it says, why it matters. Not what it is "about". The test: can the user decide to go deeper from this alone?

### Going deeper just restated the previous rung with more words
**Cause:** padding instead of new depth (discipline rule 3).
**Solution:** each rung is a genuinely deeper layer — mechanics, foundations, edge cases, sources — new information the previous rung omitted. If there is no deeper layer, say so; do not pad.

### Rung 2 came back full of equations and notation
**Cause:** register-ladder collapse (discipline rule 3a). The topic's technical gravity pulled the register down and the skill jumped from hook straight to specialist, skipping rungs.
**Solution:** rungs 1 and 2 are plain language. No equations, no notation, no named technical objects. Rung 2 explains the mechanism in words — what happens and why, not what it equals. Formalism starts at rung 3, motivated by the plain-language rungs before it. Observed failure: "black holes" rung 2 produced Schwarzschild metric components and the Hawking temperature formula. That is rung 4-5 material. If the maths is genuinely the point, it arrives one lever-pull later at no cost.

### The skill kept going deeper past the point it actually knew the material
**Cause:** fabricating depth to keep the ladder going (discipline rule 4).
**Solution:** state the honest ceiling — "that is as deep as I can take this reliably, beyond here you want the primary source". Never confabulate detail.

### A link would not fetch and the skill made up what it said
**Cause:** faked ingestion (discipline rule 5).
**Solution:** if a link will not fetch or a document will not read, say so and offer the paste fallback. Never fabricate the content of material not actually read.

## When to decline or redirect

- The user wants a prior answer compressed with no loss → that is `concise`, a different operation.
- The user wants text rewritten in their voice → that is `humanizer`.
- The user wants a single flat answer, not a progressive ladder → just answer; unpack is for material worth triaging by depth, not for quick facts.
