---
name: github-deploy
description: Use when the user wants to take a working local project to a clean, secure, well-documented GitHub repository, or to push the latest local changes to a repository that is already on GitHub. Triggers include "deploy this to GitHub", "publish my repo", "github-deploy", "let's ship this", "make this repo presentable", "push this to GitHub", "push my changes", "update my repo", "commit and push my latest work", or any presentation of a local project directory asking for it to be published or updated. Also use on explicit invocation ("run github-deploy", "github-deploy on this project"). Do NOT use for deployment to hosting platforms (Vercel, Railway, Fly, etc.), CI/CD pipeline setup, custom domain configuration, code quality improvements (linting, testing, refactoring), or app store publication. Has two modes: publish (first-time, full workflow) and update (push latest changes to a live repo, lighter workflow). Refuses to push when unresolved security or critical findings exist unless explicitly overridden.
compatibility: Requires Code Execution tool access for filesystem and shell operations. macOS or Linux. Dependencies git, gh CLI (authenticated), gitleaks. Optional git-filter-repo for history cleaning in state-3 scenarios. Skill will pre-flight check all dependencies and walk user through installation if missing. Not supported in vanilla Claude.ai chat without Code Execution. Designed for Claude Code primarily; works on API surfaces with Code Execution enabled.
license: MIT
metadata:
  author: Jacob Kowalewski (kowachefski)
  version: 0.2.0
---

# Github-deploy

Action-heavy skill that takes a working local project to a clean, secure, well-documented GitHub repository. Performs security audit, repo hygiene, documentation generation, first-run experience audit, and GitHub publish through a staged workflow with explicit phase boundaries, declared action contracts, and pre-flight failure-recovery setup.

The skill exists because vibe-coded apps tend to ship with secrets in the source, no README, no LICENSE, and arbitrary repo structure. Publishing them as-is causes embarrassment at best and security incidents at worst. This skill enforces a floor of repo quality before any code reaches GitHub.

The skill performs destructive operations on the user's filesystem and GitHub account. The discipline rules in this file are non-negotiable. Read them before doing anything.

## Operating posture

- **Action-first, narration-second.** The skill does work, then reports what was done. It does not narrate intentions before doing them unless the action is destructive and requires confirmation.
- **No skill attribution in generated artefacts.** README, LICENSE, ONBOARDING, and any other generated file must not contain a marker indicating the skill generated it. The repo should look like the user prepared it carefully.
- **Personal-conversational tone in generated documentation by default**, matched to the project where the project signals otherwise (enterprise library, formal infrastructure). See `references/documentation-templates.md` for tone-matching logic.
- **No flattery, no engagement softeners.** The user invoked this skill to publish a repo, not to be reassured.
- **Security and destructiveness override everything.** When the skill detects a critical security finding or is about to perform a destructive operation, it stops and requires explicit user action. No proceeding through critical findings on assumed intent.

## Two modes

The skill operates in one of two modes, decided at state detection (Phase 2):

- **Publish mode** — first-time publication of a project to GitHub. The full workflow below. This is the default for a project not yet on GitHub.
- **Update mode** — pushing the latest local changes to a repository that is already on GitHub. A lighter, targeted workflow. See `references/update-mode.md` for the full specification.

The two modes share a spine: intake, pre-flight checks, state detection, the security audit machinery, and failure-recovery setup are common to both. They diverge after state detection into two distinct flows. The phase overview below describes publish mode. Update mode is described in its own reference file because its flow is different — lighter doc handling, diff-scoped security, commit-and-push rather than repo-creation.

**How the mode is decided:** at state detection, if the repo is already on GitHub (state 3) and has local changes not yet pushed (uncommitted changes, or local commits ahead of the remote), the skill asks directly whether to **update** (review and push those changes) or **republish** (redo from scratch). A state-3 repo with nothing to push is not offered update mode — there is nothing to update. States 1 and 2 (not yet on GitHub) always go to publish mode. See State detection (Phase 2) and `references/update-mode.md`.

## Phase overview (publish mode)

In publish mode the skill moves through nine phases in strict order. Do not skip, reorder, or collapse phases. Each phase produces a phase-end summary before the next phase begins.

0. **Intake** — collect required inputs
1. **Pre-flight** — verify environment dependencies
2. **State detection** — identify state 1/2/3, project type, and mode
3. **Security audit** — nine detection categories
4. **Repo hygiene** — gitignore, files-that-shouldn't-be-here, build verification, dependency audit
5. **Documentation generation** — README, LICENSE, .env.example, ONBOARDING if warranted
5.5. **First-run experience audit** — static analysis plus bounded dry-run from a clean state; surfaces what an unfamiliar user would encounter; blocks publish on critical first-run failures
6. **Final verification** — re-run security checks, confirm build, confirm all phases passed
7. **Publish** — create GitHub repo, push, confirm
8. **Summary** — write summary report to ~/.github-deploy-summaries/, print path

See `references/phases.md` for detailed phase-by-phase specification of publish mode. See `references/update-mode.md` for the update-mode flow.

## Pre-flight setup (before Phase 0)

Before intake even starts, the skill must establish failure-recovery preconditions and the action-contract preference:

1. **Capture invocation count.** Read `~/.github-deploy-summaries/.invocation-count` (create with value 0 if not present). Increment by 1 at start of run. Used to determine default action-contract mode and verbosity.
2. **Determine action-contract default.** Invocations 1-3 = conservative default (detect-propose-ask before any fix). Invocation 4+ = aggressive default (auto-fix everything fixable, ask only on destructive operations). User can override at intake with "use conservative mode" or "use aggressive mode".
3. **Determine verbosity default.** Same as action contract — invocations 1-3 = verbose (narrate every action), 4+ = quiet (phase headers and findings only). User can override with "use verbose mode" or "use quiet mode".

## Intake (Phase 0)

Collect inputs. Required:

- **Project path** (absolute path to the project directory)
- **GitHub username or organisation** (where the repo will be created)
- **Visibility** — public or private

Optional but useful:

- **License preference** — defaults to MIT for public, "All rights reserved" / proprietary for private
- **Specific audience** — public/community, team, specific recipients (does not change documentation amount, only tone matching)
- **Repo name** — defaults to the project directory's basename

Modal options:

- **Dry-run** — runs all detection phases but performs no writes, no GitHub operations
- **Action-contract override** — conservative or aggressive
- **Verbosity override** — verbose or quiet

If any required input is missing, ask for it before proceeding. Do not infer the GitHub username from environment variables or git config without explicit confirmation — wrong-account pushes are a real failure mode.

## Pre-flight checks (Phase 1)

Run `scripts/preflight.sh`. The script verifies:

1. `git` installed and version ≥ 2.20
2. `gh` CLI installed and authenticated
3. `gitleaks` installed
4. Project path exists and is a directory
5. Write access to project path
6. `~/.github-deploy-summaries/` exists or can be created

If any check fails, the script outputs a specific error with the exact installation command for the missing dependency. The skill displays this and stops until the user resolves it. Resume from Phase 1 after resolution.

## State detection (Phase 2)

Run `scripts/state-detect.sh` to determine:

- **State 1** — project exists locally, no `.git` directory
- **State 2** — project has `.git` initialised, no remote configured (or remote is local-only)
- **State 3** — project has `.git` and a remote (GitHub or other) with existing commit history

If state 3, the skill first determines whether this is an update or a republish, because a state-3 repo can be either.

**Mode decision (state 3 only):** check whether the working tree has uncommitted changes OR the local branch is ahead of the remote.

- **State 3 with local changes to push** — ask directly: "This repo is already on GitHub and you have changes that aren't pushed yet. Do you want to **update** it — review and push those changes — or **republish** it from scratch (full re-run, regenerated docs, fresh security audit)?" Wait for explicit choice. If **update**, switch to update mode and follow `references/update-mode.md`. If **republish**, continue with the republish warning below.
- **State 3 with nothing to push** (working tree clean, local not ahead of remote) — there is nothing to update. Do not offer update mode. If the user invoked the skill on a clean, already-published repo, tell them there are no local changes to push and ask what they intended.

States 1 and 2 always go to publish mode — the project is not yet on GitHub, so there is nothing to update.

**Republish warning (state 3, republish chosen):**

> This repo has existing history. If secrets were committed in past commits, cleaning them requires history rewriting which has irreversible implications including breaking any clones or forks. Recommend treating this as a fresh repo (archive current, start clean) unless commit history must be preserved. Continue with state-3 cleaning (`yes-clean-history`), archive-and-restart (`yes-archive`), or abort (`abort`)?

Wait for explicit user choice. Do not default.

The state-detect script also identifies project type from project files (node, python, rust, go, ruby, deno, generic) which is used by hygiene and documentation phases.

## Failure recovery setup (Phase 2 end)

Before any modifying operation:

1. **Stash uncommitted changes** with name `github-deploy-pre-run-{timestamp}`. Skill announces the stash name.
2. **Create backup branch** at current HEAD with name `github-deploy-backup-{timestamp}` if `.git` exists (states 2 or 3). Skill announces the branch name. Backup branch is never deleted automatically.

These names appear in the summary report's recovery information section. The user must manually clean them up after confirming the run was successful.

## Security audit (Phase 3)

Run `scripts/security-audit.sh`. Performs nine detection categories:

1. Known-format API keys (OpenAI, Anthropic, GitHub PAT, AWS, Google, Stripe, Slack, Twilio, SendGrid, Hugging Face, Etherscan, Alchemy, Infura, Helius, Pinata, others)
2. Generic credential patterns (high-entropy strings near `key`/`secret`/`token`/`password`/`auth`/`bearer`)
3. Private keys (PEM, SSH, GPG)
4. Crypto seed phrases (BIP-39 wordlist matches) and wallet private keys (raw hex 64 chars with/without `0x`)
5. Database connection strings with embedded credentials
6. Personal identifiers (email addresses, phone numbers, payment card patterns)
7. Internal URLs and IPs (configurable patterns)
8. Config files committed by mistake (`.env`, `*.pem`, `*.key`, `id_rsa`, etc.)
9. History scan (states 2 and 3 only — runs gitleaks on full git history)

The script outputs findings as structured JSON to stdout. The skill reads the JSON and presents findings to the user.

See `references/security-categories.md` for detection patterns, the user-action protocol per category, and override mechanics.

**Refuse-to-push rule:** if any category produces unresolved findings, the skill refuses to advance to Phase 7 (publish). Per-finding override is available but requires explicit per-category acknowledgement with stated reason. Overrides are logged in the summary.

**Phase 3 is a detection-heavy phase** — runs to completion across all nine categories before presenting findings.

## Repo hygiene (Phase 4)

Action-heavy phase. Halts on first failure. Operations in order:

1. **`.gitignore` enforcement** — auto-add stack-appropriate template entries; auto-remove tracked files that should be ignored. Templates in `scripts/gitignore-templates/`.
2. **Files-that-should-not-be-here scan** — flag/remove `node_modules/`, `venv/`, IDE files, OS junk, log files, large binaries above 10MB threshold. Removal requires confirmation unless action-contract is aggressive.
3. **Project structure recommendations** — suggest src/, tests/, docs/ separation if absent. Recommend only, do not enforce.
4. **Build verification** — detect build target from project files. Standard targets first (`npm run build`, `python -m build`, `cargo build`, `go build`, etc.). If no standard target detected, ask the user how the project is built. Skip build verification entirely for non-buildable repos (docs-only, dotfiles, raw data — no `package.json`, no `pyproject.toml`, no `Cargo.toml`, no `Makefile`, no `Dockerfile`).
5. **Dependency audit** — `npm audit`, `pip-audit`, or `cargo audit` based on stack. Surface critical CVEs as flags, do not block.

## Documentation generation (Phase 5)

Action-heavy phase. See `references/documentation-templates.md` for the full template library and generation logic.

Mandatory outputs:

1. **README.md** — generated via code-analysis-then-interview. Skill reads the project, drafts a README, asks 3-7 specific questions to fill gaps, presents draft for user review.
2. **LICENSE** — MIT default for public, "All rights reserved" for private. Asks once if user wants a different license.
3. **.env.example** — if project uses environment variables (detected from code), generate with placeholder values and comments.

Conditional outputs:

4. **ONBOARDING.md** — if project has state, persistent data, or external integrations. Six-section minimum. See template.
5. **CONTRIBUTING.md** — only if public visibility and the user opts in.

Audience assumption: always unfamiliar users. Do not ask. Tone defaults to personal-conversational; match-to-project only if signals indicate otherwise.

## First-run experience audit (Phase 5.5)

**Purpose:** Determine what an unfamiliar user would actually encounter on first contact with the project. Documentation alone does not guarantee a working first-run. This phase tests the documented first-run against reality.

Runs after documentation generation (so the audit can test the just-written ONBOARDING.md / README against actual behaviour) and before final verification.

This is an **action-heavy phase** in that it executes the project, but it performs no writes to the project. Halts on critical findings.

See `references/first-run-audit.md` for full detail.

### Part 1 — Static analysis

Read the code for known bad-first-run patterns. No execution. Detects:

- No `--help` / `-h` / `--version` handling in CLI entry points
- Raw unhandled exceptions on missing environment variables (vs a clear "set X in .env" message)
- No input validation on required configuration
- No welcome message, usage hint, or guidance in the main entry point
- Error messages that do not tell the user how to fix the problem
- No setup script or documented setup step for a project that clearly needs one
- Required services with no connection-failure handling (app crashes if the database/API is unreachable rather than reporting it)

Each pattern produces a finding with severity.

### Part 2 — Bounded dry-run

Attempt to run the project's documented first-run command. **Bounded** means:

- The skill uses the exact command from ONBOARDING.md or README, not inferred alternatives. If the documented command does not work, that is itself the finding — do not try to find a command that does work.
- Maximum three attempts:
  1. With no configuration (no `.env`)
  2. With `.env.example` copied to `.env` and placeholder values
  3. With minimal valid configuration if the user provides it when asked
- 30-second timeout per attempt. If the process is still running at 30 seconds (e.g., a server that started successfully, or a bot in a poll loop), that is treated as "started successfully" — kill the process and record success.
- Capture stdout, stderr, exit code for each attempt.

After each attempt, classify the outcome:

- **Started successfully** — process ran without crashing (or ran past 30s, indicating a successful long-running start)
- **Failed with clear error** — process exited non-zero but the error message tells the user what to fix (e.g., "Missing TELEGRAM_BOT_TOKEN — set it in .env")
- **Failed with cryptic error** — process exited non-zero with an unhelpful error (raw stack trace, no guidance)
- **Hung** — process neither completed nor produced output (waiting on stdin with no prompt, deadlock)

### Findings and severity

- **Critical:** documented first-run command does not exist, or crashes with a cryptic error even when given valid placeholder configuration, or hangs with no indication of what it is waiting for. These block Phase 7.
- **High:** documented command works but only after undocumented steps; or fails with a clear error at the placeholder-config stage that the docs do not warn about.
- **Medium:** missing `--help`, no welcome message, error messages that could be clearer.
- **Low:** stylistic first-run improvements.

### Docs-reality drift

The highest-value finding. If ONBOARDING.md says one thing and the dry-run does another, surface the specific mismatch. Example: "ONBOARDING.md step 3 says `python bot.py` produces a ready message, but the dry-run with placeholder config crashed with `KeyError: 'TELEGRAM_BOT_TOKEN'`. Either the docs should document the token requirement before step 3, or the code should report the missing token clearly."

### Blocking and override

Critical findings block Phase 7 (publish) by default. The user can override with explicit reason (e.g., "this is a library with no runnable entry point, the dry-run is not applicable" — though the skill should detect non-runnable projects and skip the dry-run rather than fail it). Override is logged in the summary.

### Skip conditions

Skip the dry-run portion (but still run static analysis) when:

- Project type is `docs` or `generic` with no runnable entry point
- No build system and no obvious main/entry file detected
- User opts out with "skip first-run audit" at intake

## Final verification (Phase 6)

Re-run security audit. Re-run build verification (if applicable). If anything that previously passed now fails, halt and surface the regression. The skill must not advance to publish on a state that has regressed since Phase 4.

## Publish (Phase 7)

Action-heavy. Halts on first failure with cleanup.

1. Create GitHub repo via `gh repo create [username/repo] --[public|private]`. If creation fails, surface specific error and halt.
2. Add remote if state 1, verify remote if state 2.
3. Stage all current files: `git add .` (after final `.gitignore` check).
4. Commit if commits do not already cover the current state.
5. Push: `git push -u origin [primary-branch]`.

**Cleanup on failure:** if `gh repo create` succeeded but push failed, the skill deletes the empty GitHub repo via `gh repo delete --yes`. This requires gh CLI to have repo deletion scope. If the scope is missing, skill walks user through `gh auth refresh -s delete_repo` once.

## Summary (Phase 8)

Generate the eight-section summary report. Write to `~/.github-deploy-summaries/{slug-of-repo-name}-{timestamp}.md`. Print the full path of the summary at the end of the run regardless of verbosity.

See `references/summary-template.md` for the structure.

## Discipline rules

Non-negotiable throughout the skill's operation.

1. **Explicit phase ordering.** One phase completes before the next begins. Phase header announced before the phase starts. No interleaving.
2. **Per-action contract declared.** Every operation is detect-only, detect-and-fix-automatically, or detect-then-ask. The skill announces which when the action begins. User can override the default at intake.
3. **Destructive operations require explicit confirmation.** User types "yes" (full word, not "y") to confirm. The confirmation prompt names the operation and its irreversibility specifically, not generically.
4. **Re-verification after every fix.** Whenever the skill changes something in response to a finding, it immediately re-runs the specific check. The fix must verify before moving on.
5. **Phase-level summary before transitioning.** End-of-phase summary names what was checked, what passed, what failed, what was fixed, what was deferred. User sees the boundary clearly.
6. **Stop on critical security findings.** A critical finding (known-format key in committed history of a soon-to-be-public repo, exposed wallet private key, etc.) halts the skill until resolved. No advancing.
7. **Logging.** Every action logged to `.github-deploy-log.md` in project root (added to `.gitignore`). The log records checks, fixes, overrides, confirmations. Critical for reconstruction if something goes wrong.
8. **Atomic multi-file operations.** Operations that touch multiple files for one logical change (e.g., moving secrets to `.env` + updating `.gitignore` + updating `.env.example`) happen as a unit. If any step fails, the others roll back.
9. **Dry-run mode available.** User can request dry-run at intake. All detection phases run, no writes occur, no GitHub operations.
10. **Skill exits role only at intake, phase transitions, and final summary.** Mid-phase, no conversational drift, no tangents, no offering opinions on unrelated parts of the codebase.

## Destructive operations list

These specifically require explicit confirmation per Discipline Rule 3:

- `git rm` on any file with content
- History rewriting (filter-repo, BFG, force push)
- Any file deletion
- Overwriting existing README, LICENSE, or other doc with substantive existing content
- Creating a public repo
- Pushing to a remote with commits the local branch does not have

## User abort handling

User types "abort" at any prompt, or sends Ctrl-C at shell level. Skill must:

1. Revert any uncommitted skill-initiated changes
2. Preserve committed skill-initiated changes on `github-deploy-aborted-{timestamp}` branch
3. Finalise log with `[ABORTED]` marker
4. Skip remaining phases
5. If abort during Phase 7 after `gh repo create`, delete the partial GitHub repo per the Phase 7 cleanup logic

The next invocation of the skill should detect prior aborted runs by checking for `github-deploy-aborted-*` branches and offer to review them.

## Examples

### Example 1 — Fresh project, state 1, vibe-coded Python tool

User says: "Run github-deploy on `/Users/jacob/Projects/sentiment-analyser`."

Actions:
1. Phase 0 intake: path, GitHub username = `kowachefski`, visibility prompted = private
2. Phase 1 pre-flight: git ✓, gh ✓ authenticated, gitleaks ✓
3. Phase 2 state detection: state 1 (no `.git`), project type = python
4. Failure-recovery setup: none needed (state 1, no `.git`)
5. Phase 3 security audit: finds an OpenAI key in `analyse.py`. Stops, presents finding, user moves key to `.env`, skill re-verifies clean.
6. Phase 4 repo hygiene: `git init`, python `.gitignore`, build verification, dependency audit
7. Phase 5 docs: README via code analysis + interview, LICENSE (private), `.env.example` with placeholder, no ONBOARDING
8. Phase 5.5 first-run audit: flags an unguarded `os.environ` read; dry-run with placeholder config starts successfully; one medium finding noted
9. Phase 6 final verification: re-scan clean, build passing
10. Phase 7 publish: `gh repo create kowachefski/sentiment-analyser --private`, commit, push
11. Phase 8 summary written, path printed

Result: clean private repo with README, LICENSE, `.env.example`, proper `.gitignore`. Summary lists the OpenAI key finding resolved at Phase 3.

### Example 2 — State 3 repo with secrets in history

User says: "github-deploy on this repo." [points at `/Users/jacob/Projects/old-bot` which has existing GitHub remote and 47 commits]

Actions:
1. Phase 0 intake
2. Phase 1 pre-flight: all dependencies present
3. Phase 2 state detection: state 3 (existing remote, 47 commits). Skill warns explicitly about history-cleaning implications. User chooses `yes-archive` — skill will guide archiving the current public repo and starting a fresh private one.
4. Skill walks user through: `gh repo archive`, then proceeds as if state 1 for a new repo. Note in summary that the predecessor repo is archived at `kowachefski/old-bot-archived`.
5. Phases 3-8 proceed normally.

Result: old repo archived (visible but read-only on GitHub), new clean repo published.

### Example 3 — Dry-run mode

User says: "github-deploy on `/Users/jacob/Projects/committee-orchestrator`, dry-run only."

Actions:
1. Intake notes `dry_run=true`
2. Phases 1-3 run normally (detection only, no writes anyway)
3. Phase 4 runs detection but does not apply any fixes; reports what would be fixed
4. Phase 5 generates docs to a temporary location, presents drafts but does not write to project
5. Phase 5.5 runs static analysis and reports what the dry-run would check, but performs no execution in dry-run mode (consistent with the no-writes, no-side-effects contract of dry-run mode); findings marked [DRY-RUN]
6. Phase 6 skipped (nothing to verify)
7. Phase 7 skipped
8. Phase 8 produces summary as if the run had happened, with `[DRY-RUN]` marker on every section

Result: full preview of what github-deploy would do, no changes made.

### Example 4 — Update mode, pushing latest changes to a live repo

User says: "github-deploy on `/Users/jacob/Projects/fitness-tracker` — push my latest changes."

Actions:
1. Intake (light): path read, remote read from existing `.git` config (no need to ask username/visibility)
2. Pre-flight: dependencies present
3. State detection: state 3 (existing remote), working tree has uncommitted changes and 2 local commits ahead of remote. Skill asks: update or republish? User chooses update → update mode (`references/update-mode.md`)
4. Failure-recovery: backup branch `github-deploy-backup-{timestamp}` created at HEAD
5. Identify change set: 2 committed local commits (with the user's messages) + uncommitted changes to 3 files
6. Divergence check: fetch shows remote has not moved — no divergence, proceed
7. Security audit (diff-scoped): scans the 3 changed files and the 2 unpushed commits. Finds a hardcoded API endpoint with an embedded token in one changed file. Stops, presents finding, user moves it to `.env`, re-scans the diff clean
8. Light hygiene: a new `data.db` appeared in the changes — flagged as something that should be gitignored, added to `.gitignore` and removed from the change set with confirmation
9. Documentation: detected a new env var introduced by the change (`STRAVA_TOKEN`); offers to add it to `.env.example`; user accepts
10. Commit: drafts a message for the uncommitted changes from the diff, user edits it, commits
11. Push: shows the 3 commits now going up (2 prior + 1 new) and the changed files, names target `origin/main`, notes it is the default branch; user confirms; `git push origin main`
12. Update summary written, noting the diff-scoped scan caveat, the gitignored `data.db`, the `.env.example` update, and the pushed commit hashes

Result: latest changes pushed to the live repo with the same security and hygiene checks as a publish, without regenerating docs or re-running the full workflow. Summary notes the scan was scoped to the diff.

## Troubleshooting

### `gh repo create` fails with "name already exists"
**Cause:** The user already has a repo with the inferred name on GitHub.
**Solution:** Ask the user for an alternative repo name. Confirm desired action — overwrite existing repo (destructive, requires explicit confirmation including the repo URL), choose a new name, or abort.

### `gitleaks detect` returns false positives on test fixtures or documentation
**Cause:** Test files or docs contain fake/example secrets that match patterns.
**Solution:** The skill recognises common fixture paths (`tests/`, `fixtures/`, `examples/`, `docs/`) and allows the user to mark findings in those paths as "fixture, override". Override is logged with reason "intentional fixture". Skill proceeds.

### gh CLI is installed but not authenticated
**Cause:** `gh auth login` has not been run, or token has expired.
**Solution:** Skill detects this in pre-flight, prints the exact command: `gh auth login --git-protocol https --web`. User runs it. Skill resumes from Phase 1.

### Build verification fails because the project requires environment variables
**Cause:** Build runs need a `.env` that does not exist (because secrets were just moved out of source).
**Solution:** Skill copies `.env.example` to `.env` with placeholder values long enough to satisfy length validation, runs build, restores `.env` to its previous state or deletes if it did not exist. If build still fails because the placeholders are invalid (e.g., API call attempted during build), the skill asks the user to manually verify the build outside the skill and to confirm before proceeding.

### History cleaning leaves the repo in a state where push is rejected by GitHub
**Cause:** Branch protection rules or other GitHub-side configuration blocks force push.
**Solution:** Skill names the rejection reason from gh CLI output. If branch protection is the cause, user must disable protection on GitHub UI temporarily, push, re-enable. Skill does not modify branch protection rules automatically.

### User runs the skill in a directory that turns out not to be a project at all
**Cause:** Path passed at intake is not the intended project, or the user invoked in a parent directory.
**Solution:** State detection at Phase 2 catches this — if no recognisable project files exist (no language manifest, no source files), the skill stops and asks for confirmation: "This directory does not appear to contain a project. Path: [X]. Continue anyway (creating an empty/docs-only repo), choose a different path, or abort?"

### Summary file write fails because `~/.github-deploy-summaries/` cannot be created
**Cause:** Permissions, disk full, or unusual home directory configuration.
**Solution:** Skill prints the summary to stdout as a fallback and tells the user to save it manually. Skill notes that future invocations will not have access to invocation-count and verbosity defaults will revert to conservative/verbose.

### Backup branch already exists from a previous failed run
**Cause:** Prior invocation aborted or crashed leaving artefacts behind.
**Solution:** Skill detects existing `github-deploy-backup-*` and `github-deploy-aborted-*` branches at Phase 1. Lists them. Asks user whether to keep them (skill will use a new timestamped name) or to clean up (skill deletes old branches after confirmation).

### Update mode: push rejected because the remote has diverged
**Cause:** The remote branch has commits the local branch does not — someone else pushed, or the local branch was rebased.
**Solution:** Update mode refuses to resolve this automatically (step 5 of `references/update-mode.md`). It does not pull, merge, rebase, or force-push. It tells the user to reconcile manually (`git pull --rebase origin {branch}` or `git pull`), resolve conflicts, then re-run. The skill never force-pushes on the user's behalf.

### Update mode: user expects the whole repo to be re-scanned for secrets
**Cause:** Misunderstanding of update mode's diff-scoped security audit.
**Solution:** Update mode scans the changed files and unpushed commits, not the whole repo. A pre-existing secret in an unchanged file is not caught. This is stated explicitly in the update summary. If the user wants a full re-scan, they run republish mode (state-3 republish path), which re-audits everything.

### User invokes the skill on an already-published repo with no local changes
**Cause:** Nothing to update — working tree clean, local not ahead of remote.
**Solution:** State detection finds state 3 with nothing to push. The skill does not offer update mode (there is nothing to update). It tells the user there are no local changes to push and asks what they intended — republish, or did they expect uncommitted work that is not there.

## Reference files

Read on demand:

- `references/phases.md` — detailed per-phase specification of publish mode
- `references/update-mode.md` — the update-mode flow (push latest changes to a live repo)
- `references/security-categories.md` — nine detection categories with patterns and override rules
- `references/documentation-templates.md` — README, LICENSE, ONBOARDING, .env.example generation logic
- `references/first-run-audit.md` — static-analysis patterns and bounded dry-run logic for the Phase 5.5 first-run experience audit
- `references/summary-template.md` — eight-section summary report structure
- `references/recovery-and-failure.md` — backup, abort, rollback procedures

Scripts in `scripts/`:

- `preflight.sh` — environment dependency checks
- `security-audit.sh` — security detection runner
- `state-detect.sh` — state 1/2/3 and project type detection
- `first-run-audit.sh` — static-analysis first-run pattern checks and bounded dry-run runner
- `gitignore-templates/` — stack-specific gitignore templates

## When to decline running the skill

- User is asking for deployment to a hosting platform (Vercel, Railway, Fly, Cloudflare). Redirect to the appropriate platform-specific workflow.
- User is asking for CI/CD pipeline setup, GitHub Actions configuration, or release automation. Out of scope.
- User is asking for code quality improvements (refactoring, linting, testing) rather than publication. Different skill territory.
- User wants to publish to a non-GitHub git host (GitLab, Bitbucket, Gitea). The skill is GitHub-specific.
- Code Execution tool is not available in the current environment. Skill cannot operate without filesystem and shell access.
