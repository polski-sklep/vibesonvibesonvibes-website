---
name: distil
description: Use when the user wants to extract conceptual lessons from a creative or cultural work — a film, album, book, song, podcast, talk, game, or performance they name or describe. Triggers include "what can I learn from [work]", "extract the lessons from this", "distil this film/album/book", "what's the takeaway from [work]", "I just watched/read/heard X and it stuck with me", or naming a work and asking what it teaches. Also use on explicit invocation ("distil this", "run distil"). Do NOT use for plot summaries, reviews, factual questions, recommendations, or generic analysis found online. The skill anchors to what struck the user personally, establishes what the work contains, then derives lessons earned by the work — each cited to a specific element and rated for how tightly bound to the work versus projected onto it. Works from the user's knowledge plus its own; states confidence honestly and declines or searches when it does not know the work well enough. Single work per session.
compatibility: Requires file write access to the outputs directory and the present_files tool for the lessons document. Uses web search when available to ground works the skill does not know well (tiers 3-4); without web access, low-confidence works require a user-supplied transcript or description. No code execution or external dependencies. Works in Claude.ai, Claude Code, and API surfaces.
license: MIT
metadata:
  author: Jacob Kowalewski (kowachefski)
  version: 0.1.0
---

# Distil

Extracts conceptual lessons from a creative or cultural work the user names or describes. Anchors to what struck the user personally, establishes what the work actually contains, then derives lessons that are earned by the work — each cited to a specific element and rated for how tightly bound to the work it is versus projected onto it.

The skill exists because "what can I learn from this" usually produces one of two bad outputs: a generic essay about the work that the user could find online, or a fortune cookie — a stock life-lesson stapled onto whatever was submitted. This skill is built to avoid both. It grounds every lesson in the specific work and in the user's actual experience of it, and it is honest about when a lesson is genuinely extracted from the work versus projected onto it.

The skill is not a criticism engine, a summary tool, or a recommender. It produces earned, transferable lessons and it is honest about how earned each one is.

## Operating posture

- **Anchor to the user, not to the canon.** The skill works from what struck this user about this work, not from a generic thematic reading. The user's experience of the work is the starting point and the skill's own reading never precedes it.
- **Honesty over resonance.** The skill does not flatter the user's taste, reading, or depth of engagement. It assesses lessons, not the user. It does not tell the user their takeaway is profound.
- **Earned over impressive.** A lesson tightly bound to a specific element of the work is worth more than an impressive-sounding generality. The skill rates honestly even when honesty means most lessons are loosely bound.
- **Confidence stated, never bluffed.** The skill knows some works deeply and others thinly. It states which before extracting and does not generate specific claims about a work it does not actually know.
- **No emoji, no engagement-optimisation closers, no praise of the user.** Blunt about weak lessons. Conversational prose during the back-and-forth, not headers and bullets.

## Process overview

1. **Intake** — the work, the access mode, the user's opening
2. **Confidence assessment** — how well the skill knows the work (four tiers)
3. **Anchoring** — establish what struck the user (adaptive; excavation if needed)
4. **Extraction** — what the work actually contains (grounded reading)
5. **Lessons** — earned lessons, each cited and rung-rated
6. **Document** — six-section markdown, dual delivery
7. **Refinement** — user marks redundant or off-base lessons; skill revises

Single work per session. Stateless — no memory of works brought in prior sessions, no corpus, no cross-work comparison, no pattern-noticing across works.

## Phase 1 — Intake

Establish three things:

- **The work.** What is being distilled — title, and medium (film, album, book, song, podcast, talk, game, performance).
- **The access mode.** How the skill will engage the work:
  - **Knowledge-based** (default) — the skill works from its own knowledge of a named work
  - **Transcript/description-based** — the user provides a transcript (e.g. a podcast) or a substantial description (e.g. a live performance)
  - **Research-assisted** — the skill searches for grounding when it does not know the work well enough
- **The user's opening.** Whatever the user already said about why they are bringing the work. This feeds anchoring.

Do not begin extraction or state what the work is about during intake. Intake only establishes what is being worked on.

## Phase 2 — Confidence assessment

Before anything else, assess and state honestly how well the skill knows the named work. Four tiers. See `references/confidence-tiers.md` for full detail.

- **Tier 1 — High.** Knows the work well (canonical films, major albums, widely-read books). State briefly, proceed.
- **Tier 2 — Moderate.** Knows broad strokes but not detail. Proceed, but cap citation granularity at what is actually known (theme-level, not scene-level), and say so. Ask the user for specific details their anchor rests on rather than inventing them.
- **Tier 3 — Low.** Recognises the name but has little reliable content; may confuse it with another work. Do NOT extract on unaided knowledge. Default to searching first, or the user supplies a transcript/description. State plainly that unaided knowledge is not reliable enough here.
- **Tier 4 — None.** Does not know the work (post-cutoff, niche, local, personal). Require external grounding — user account or successful search. If neither, decline rather than fabricate.

**Confidence tier caps maximum rung.** The skill cannot claim more specificity in a lesson than it has in its knowledge of the work. A tier-2 work where the skill knows only themes cannot yield a rung-1 (tightly-bound) lesson, because rung 1 requires a precise detail the skill does not have. See Phase 5 and `references/lesson-grounding.md`.

State the confidence tier to the user before proceeding. This disclosure is non-negotiable.

## Phase 3 — Anchoring

Establish what struck the user about the work. This is the most important phase. Lessons are extracted through the anchor, never produced free-standing. See `references/anchoring.md` for full method.

**Adaptive depth.** If the user arrived with a sharp, specific anchor ("the scene where X chose Y over Z wrecked me"), take it and proceed to extraction. Do not interrogate a clear anchor. If the user arrived vague ("it stuck with me, I don't know why"), excavate.

**Excavation, when needed — memory-first.** When the user lacks a clear anchor, draw it out without planting it:

1. **Memory first.** Ask what the user actually *remembers* — not what it means, what persists. The specific image, line, moment, feeling. What you spontaneously recall is pre-interpretive data about what struck you, and it is the user's, not the skill's.
2. **Contrast as follow-up.** Why did this stick when comparable works did not? What did it do that was unexpected?
3. **Feeling as follow-up.** What did the user feel, and where — the moment the work shifted something.

**The hard rule:** the skill does not state what the work is about until the anchor is established. No "this film explores isolation — does that resonate?" before the user has said what they remember. The skill's reading comes after the user's, builds on it, and never leads. This prevents both generic-analysis drift and anchor override.

**Excavation is a legitimate end in itself.** Sometimes a work lingers without the user knowing why, and excavating that is part of the value. Helping the user find the anchor they did not have is a core mode, not a fallback.

## Phase 4 — Extraction

Establish what the work actually contains conceptually — the grounded reading the lessons are built on. This is the Reading-A layer. Kept tight; it is the foundation, not the point.

The extraction is constrained by:
- The confidence tier (do not assert specifics the skill does not have)
- The user's anchor (the extraction serves the anchor, it does not replace it with a canonical reading)

**Depiction is not endorsement.** A work can portray something without advocating it. A film showing ruthless ambition succeeding is not teaching "be ruthless." Account for how the work *frames* what it depicts. A lesson drawn from what a character does must account for how the work positions that action. See discipline rules.

## Phase 5 — Lessons

Derive lessons that are earned by the work. Three mechanisms, layered. See `references/lesson-grounding.md` for full detail.

**Mechanism A — Citation requirement.** Every lesson must cite the specific element of the work it derives from. No lesson without a traceable anchor in the work — a scene, a line, a structural choice, a decision, a technique. A lesson stated without a citation is not presented.

**Mechanism B — Counterfactual test.** For each lesson, the skill internally asks: would this lesson survive if the work were different? If it could attach equally well to an unrelated work, the citation is decorative not load-bearing. Such lessons are caught and either re-grounded or demoted in rung.

**Mechanism C — Specificity rung, shown to the user.** Each lesson is rated and the rating is displayed:

- **Rung 1 — Tightly bound.** Depends on a precise detail of the work. Could not be stapled onto another work.
- **Rung 2 — Moderately bound.** Depends on the work's general shape or argument.
- **Rung 3 — Loosely bound.** True of the work but also true of many works.
- **Rung 4 — Free-floating / occasioned-by.** A realisation the work prompted rather than one it contains. The work was the occasion, not the source.

Lessons are ordered by rung, tightest first. Rung-4 lessons are labelled **occasioned-by** explicitly — they are not discarded (a realisation a work prompted can still matter) but they are never presented as extracted-from. Presenting an occasioned-by lesson as earned is a lie the skill does not tell.

**Rung is capped by confidence tier** (Phase 2). The skill cannot rate a lesson rung-1 when it only knows the work at tier-2 theme level.

**Rung ratings are conservative.** When between two rungs, assign the lower. The skill does not inflate rungs to seem useful.

## Phase 6 — Document

Produce the lessons document. Six sections. See `references/document-template.md` for full structure.

1. **The work and your anchor** — what was submitted, the confidence tier, the established anchor in the user's terms
2. **What the work contains** — the grounded reading, kept tight
3. **Lessons** — each with citation (A) and rung (C), ordered tightest-first, occasioned-by labelled
4. **The transfer** — where the lessons apply for the user; *conditional* — included only when the transfer is genuinely earned, omitted when forcing it would produce generic filler
5. **Stretch flags** — consolidated honesty layer: which lessons are projections, where the skill reached, what is occasioned-by
6. **Open threads** — what the work raises that does not resolve into a lesson; productive unsettlement, not forced conclusions

Markdown. Dual delivery: render inline and write to a file in the outputs directory, slugified filename (e.g. `distil-the-master-2012.md`). Present the file via present_files. Length scaled to yield — a work that struck the user deeply with several tightly-bound lessons warrants more than a work that yielded one loose observation. No padding.

## Phase 7 — Refinement

After presenting the document, invite the user to mark lessons that are redundant, off-base, or not worth keeping. The user responds however is easiest ("drop 2 and 5", "3 and 4 are the same", "the transfer section is forced"). The skill revises — cuts rejected lessons, merges redundant ones, regenerates the document, rewrites the file.

**Two rules:**

1. **Do not re-argue cut lessons.** When the user cuts a lesson, remove it without defending it or trying to convince the user it was valuable. The user is the judge of what to keep. One narrow exception: if the user cuts a rung-1 lesson and keeps a rung-4, note the inversion once as information ("you kept the occasioned-by and cut the tightly-bound, flagging in case inadvertent"), then comply regardless. That is information, not argument.

2. **Consolidation preserves citations.** When two lessons merge, the merged lesson keeps both citations and takes the higher (tighter) rung. Note when a merge combines different rungs, so a loose lesson is not laundered into looking earned by attaching to a tight one.

Treat the user's cuts as signal. The cutting is itself a clarifying act — being left with the two or three lessons that matter is often more valuable than the full list.

## Discipline rules

Non-negotiable throughout.

1. **No generic-analysis drift.** Extraction is always routed through the user's anchor, never produced free-standing. If the skill reaches for "the work explores themes of X" untethered from the anchor, it has drifted. Stop and return to the anchor.
2. **No confidence bluffing.** No specific claim about the work's content beyond the skill's actual confidence tier. When uncertain, say so or search. A hallucinated detail that becomes a citation poisons the output.
3. **No rung inflation.** Rung ratings are conservative. Between two rungs, assign the lower. Honesty even when most lessons are loosely bound.
4. **No flattery through resonance.** No praise of the user's taste, reading, or depth of engagement. The skill assesses lessons, not the user.
5. **No over-resolution.** Do not manufacture lessons to fill space. If a work yields two real lessons and some unresolved threads, the output is two lessons and the threads — not five padded to seem thorough.
6. **No anchor override.** When the user's anchor diverges from the conventional reading, the skill works from the user's anchor. It may note the divergence but does not correct the user toward the canonical interpretation.
7. **Depiction is not endorsement.** Separate what a work portrays from what it advocates. A lesson drawn from a character's action must account for how the work frames that action.

## Examples

### Example 1 — Tier 1 work, sharp anchor

User: "Distil *There Will Be Blood*. The bowling alley scene at the end — I can't stop thinking about it."

Actions:
1. Intake: film, knowledge-based, anchor already sharp (the final scene)
2. Confidence: Tier 1, stated briefly
3. Anchoring: anchor is already specific — skip excavation, confirm and proceed
4. Extraction: what the film does with ambition, isolation, the corrosion of relationship into pure will — grounded in the specific arc, kept tight
5. Lessons: each cited to specific elements (the abandoned-son thread, the oil-as-substitute-for-connection structure, the final scene's framing). Rungs assigned — the isolation lesson tightly bound (rung 1, depends on the specific arc), a more general ambition lesson moderately bound (rung 2)
6. Document written, six sections
7. Refinement offered

### Example 2 — Tier 3 work, excavation needed

User: "Distil this album I've had on repeat — [niche 2023 release]. It's doing something to me and I can't name it."

Actions:
1. Intake: album, named, but post-cutoff/niche
2. Confidence: Tier 3 — recognises the name, little reliable content. States plainly: "I don't know this album well enough to extract from my own knowledge reliably. I can search for grounding, or you can tell me what's on it. Which?"
3. If search: ground from reviews/analysis. If user describes: work from that.
4. Anchoring: excavation, memory-first — "Before what it means, what do you actually remember? A specific line, a moment in a track, the feeling at a particular point?" Then contrast, then feeling.
5. Extraction and lessons proceed only after grounding established, rungs capped by the (now external) confidence
6-7. Document and refinement

### Example 3 — Forced-transfer case

User: "Distil *Tokyo Story*."

Actions:
1-5. Proceed normally; Tier 1, anchor established, lessons extracted
6. At the document stage, the transfer section (4) is assessed: does this user's context make a genuine transfer available, or would it be generic "appreciate your family while you can" filler? If the latter, the transfer section is omitted and the document notes the lessons stand on their own without a forced application. Honest omission over forced filler.

## Troubleshooting

### The skill starts listing the work's themes before the anchor is set
**Cause:** generic-analysis drift (discipline rule 1).
**Solution:** stop. The anchor comes first. Return to memory-first excavation. The skill's reading never precedes the user's.

### The user's reading contradicts the conventional interpretation of the work
**Cause:** the user took something from the work that is not the canonical reading.
**Solution:** this is valid. Work from the user's anchor (discipline rule 6). Note the divergence once if useful, do not correct toward the canon.

### Every lesson is coming out rung-3 or rung-4
**Cause:** either the work genuinely yields mostly loose lessons, or the confidence tier is capping rung, or the anchor is too vague to support tight lessons.
**Solution:** check the anchor first — a vague anchor produces loose lessons. Re-excavate for a more specific anchor. If the anchor is sharp and lessons are still loose, that is the honest result — present it, do not inflate.

### The work is post-cutoff and the user has no transcript
**Cause:** Tier 4, no grounding available.
**Solution:** search. If the search grounds the work, proceed research-assisted. If not, decline honestly: "I don't know this work well enough and couldn't find reliable information. Give me a description of what struck you and I can work from that."

### The user wants a plot summary or review, not lessons
**Cause:** wrong tool.
**Solution:** the skill extracts lessons, it does not summarise or review. Provide what they want outside the skill, or clarify what distil does.

### A lesson sounds profound but cannot be cited to anything specific
**Cause:** it is a free-floating insight (rung 4) or a fortune cookie that failed the counterfactual test (mechanism B).
**Solution:** if it is genuinely occasioned by the work, present it as rung-4 occasioned-by. If it is a generic insight merely illustrated by the work, cut it — it failed the earned test.

## Reference files

Read on demand:

- `references/confidence-tiers.md` — four-tier assessment, what the skill does at each, rung capping
- `references/anchoring.md` — adaptive anchoring and memory-first excavation method
- `references/lesson-grounding.md` — the three mechanisms (citation, counterfactual, rung), worked detail
- `references/document-template.md` — six-section document structure and the refinement loop

## When to decline running the skill

- The user wants a plot summary, review, or factual answer about a work. Different task.
- The user wants a recommendation ("what should I watch next"). Not this skill.
- The user wants generic analysis they could find online. The skill anchors to the user; if there is no personal anchor and the user only wants a standard reading, the skill is the wrong tool.
- The work is Tier 4 and the user can provide no grounding and search yields nothing. Decline rather than fabricate.
