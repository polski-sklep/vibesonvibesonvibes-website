# PORTFOLIO_FACTS.md

Single source of truth for every public claim about these projects.

Rule: no number, version, or capability claim appears on the website, in a README,
or in an interview answer unless it appears here first. When something changes,
edit this file, then propagate. Propagation checklist is at the bottom.

Last verified: 2026-08-13
Verified by: imported baseline from Codex attachment; fill unresolved fields before making new public claims.

---

## 1. committee-orchestrator

| Field | Value |
|---|---|
| Public repo | `polski-sklep/aiic` |
| Intended repo name | `polski-sklep/committee-orchestrator` - not currently public; do not link until created/renamed |
| Site entry | `committee_orchestrator_v2.1_multiagent_crypto.py` |
| Version | v2.1 |
| Status | Deployed, running |
| Readiness (site) | 4/5 |
| Agent count | 15 |
| Agent roster | Tokenomics, Governance, On-Chain, Tech/Infra, Competitive Intel, Field Intel, Legal/Regulatory, Technical Analyst, Maturation Scorer, Devil's Advocate, Risk Officer, Portfolio Manager, Report Writer, Ray, Chair |
| Meta-agents | Excluded from scoring: Report Writer, Ray, Chair, Technical Analyst |
| Governance layer | Chair decision layer; Risk Officer has veto authority; Chair can override veto with documented reasoning |
| Pipeline steps | Knowledge retrieval -> parallel data gathering -> sequential adversarial synthesis -> report -> independent review -> chair decision |
| Output verdicts | BUY / PASS / WATCH / VETO |
| Report sections | 24 |
| Evaluations run | <<FILL: count to date>> |
| Scope | L1s, L2s, infrastructure and middleware, not only DeFi |
| README status | Public README updated 2026-08-13 with current committee, scoring, calibration and setup details |

Stack: Python, FastAPI, SQLAlchemy, asyncpg, PostgreSQL + pgvector, Docker Compose,
Anthropic API (primary), OpenAI (fallback), Notion API, DeFiLlama, Binance.

Deployment: Hetzner VPS, Docker Compose, `restart: unless-stopped`, Tailscale-only access.

Problem statement worth stating publicly:
- Early-stage crypto research is inconsistent when the same analyst asks different
  questions on different days.
- The committee exists to ask adversarial questions every time, in a consistent
  order, and record why it concluded what it concluded.

Design decisions worth stating publicly:
- Postgres + pgvector as the knowledge store; Notion as the human-readable layer only.
- Agent personas as markdown files, so behaviour changes without touching Python.
- Three model tiers (FAST / BALANCED / STRONG) routed per agent by task cost.
- Structural gate before the committee runs, to reject malformed inputs early.
- Governance layer adjudicates disagreement rather than averaging it away.
- Institutional memory is injected through `mandates.md`, `risk_policy.md`,
  `thesis.md` and `trusted_accounts.md`.

README-confirmed agents:
- Tokenomics - token design, supply and emissions.
- Governance - decentralisation quality and voting.
- On-Chain - network health, usage and flows.
- Tech/Infra - technical soundness.
- Competitive Intel - market positioning.
- Field Intel - community and sentiment.
- Legal/Regulatory - compliance exposure.
- Technical Analyst - entry zones, support/resistance levels and orderbook.
- Maturation Scorer - growth trajectory.
- Devil's Advocate - contrarian challenge.
- Risk Officer - downside, fragility and veto authority.
- Portfolio Manager - diversification fit and sizing.
- Report Writer - 24-section report.
- Ray - independent macro/cycle contrarian pass.
- Chair - final decision.

Known limitations to state honestly:
- `init.sql` only runs on a fresh Postgres volume. Existing databases need
  `calibration_records` created by hand or the first calibration write fails.
- <<FILL: anything else you would not want discovered rather than disclosed>>

---

## 2. ai-curriculum-ingest

| Field | Value |
|---|---|
| Repo | `polski-sklep/ai-curriculum-ingest` |
| Site entry | `ai_curriculum_ingest_v1.4_spaced_rep.py` |
| Version | v1.4 |
| Status | <<FILL: active / dormant / archived>> |
| Readiness (site) | 4/5 |
| What it does | <<FILL: one sentence>> |
| Spaced repetition | <<FILL: algorithm used, e.g. SM-2, FSRS, custom>> |
| Last real work | <<FILL: date>> |

Stack: <<FILL: confirm - Python, and is the Next.js component here?>>

DISCREPANCY: GitHub HEAD is `f064c41` "Add requirements.txt", 2026-06-16.
Site claims v1.4. Resolve before publishing anything else.

---

## 3. telegram-contact-graph

| Field | Value |
|---|---|
| Public repo | `polski-sklep/telegram-contact-graph` |
| Private repo | `polski-sklep/telegram-bd-scraper` (NEVER public) |
| Site entry | `telegram_contact_graph_v1.0.py` |
| Version | v1.0 |
| Readiness (site) | 3/5 |
| Contacts processed | 1637 (500 frozen + 1137 open) - <<FILL: confirm current>> |
| What is public | Code only. No contact data, no exports, no Notion IDs, ever. |

Stack: Python, Telethon, Anthropic API, Notion API.

HARD RULE: the contact dataset is other people's personal data. It never goes public
in any form - not as a sample, not anonymised, not as a screenshot with names visible.
Demo path for interviews: verbal architecture walkthrough, or a blurred screenshot.

DISCREPANCY: public repo is a 5-file stub at "first commit". The site previously
presented this as 62% complete; it now shows readiness only. Fix by pushing
sanitised code, or remove the site entry.

---

## 4. fitness-tracker

| Field | Value |
|---|---|
| Repo | `polski-sklep/fitness-tracker` |
| Site entry | `fitness_tracker_power_score_v1.0.zip` |
| Version | v1.0 (Power Score formula v1.1) |
| Status | Running locally. Not deployed to VPS. |
| Readiness (site) | 2/5 |
| Schema migrations | 0001-0009 |
| Sessions backfilled | 29 strength, 6 cycling |

Power Score v1.1, stated precisely:
- `RI = weight / peak_weight_ever_lifted`, capped at 1.20
- Exercise-class EC coefficients
- Session modifiers: quality, fatigue, sensitivity, time
- `SESSION_MEDIAN_POWER = 3112` as anchor, so a median session reads Index 100
- Load-only. Zero-load work tracked separately in `accessory_reps` / `accessory_seconds`

Stack: Python, FastAPI, SQLAlchemy 2.0, PostgreSQL, HTMX, Chart.js, Caddy,
python-telegram-bot, Anthropic API (text + vision).

HARD RULE: code is publishable, training data is not. No DB dumps, no `profile/` files.

Known open bug to disclose rather than hide:
- Count-review multi-session save: batching multiple workouts with a count mismatch
  saves only one session on Confirm.

---

## 5. skills

| Field | Value |
|---|---|
| Repo | `polski-sklep/skills` - <<FILL: created? y/n>> |
| Site entries | sharpener, distil, unpack, github-deploy, concise |
| Excluded | life-map (personally revealing - stays private, permanently) |

| Skill | Lines | Site rating |
|---|---|---|
| sharpener | 268 | 4/5 |
| distil | 224 | 5/5 |
| unpack | 152 | 4/5 |
| github-deploy | 449 | 3/5 |
| concise | 279 | 5/5 |

Line counts must be regenerated with `wc -l` on publish, not copied forward.

---

## 6. vibesonvibesonvibes-website

| Field | Value |
|---|---|
| Repo | `polski-sklep/vibesonvibesonvibes-website` |
| Live | vibesonvibesonvibes.com |
| Host | Cloudflare Pages |
| Page weight | ~34KB (down from ~204KB) |

---

## Consistency items

- [x] Next.js appeared in the site tech-stack filter with count 1. Removed from the site until verified.
- [x] Development-progress percentages (81/78/62/43) had no stated denominator. Site now labels bars as readiness fractions.
- [ ] `teachme` fork carries mattpocock's description verbatim. Rewrite or hide.
- [ ] `ai-job-search` fork - same check.

---

## Propagation checklist

Run this every time a value above changes.

1. Edit this file first.
2. Update the affected README(s) in the repo(s).
3. Update the website table row (name, version, readiness, stack tags).
4. Update the vault project note.
5. Re-read the changed rows aloud once. That is your interview answer.

Anything you cannot state from this file, you do not claim.
