# vibesonvibesonvibes

My portfolio, presented as a LimeWire-era desktop app called VibeWire PRO 4.20.69. That name is the page title and the share-card title. The canonical URL in the HTML, `robots.txt`, and `sitemap.xml` is [https://vibesonvibesonvibes.com/](https://vibesonvibesonvibes.com/).

The first screen is a fullscreen collage of a Windows 95 machine. One click on the hero, or a downward wheel movement that accumulates past 120, zooms into the CRT over 1100ms and locks the VibeWire window to the browser. Close, Escape, or enough upward wheel movement returns to the collage. With `prefers-reduced-motion`, the zoom is skipped and the canvas holds a still frame: the original poster, the settled side layers, and the screen lockup.

Inside there are two tabs, Search / Share and Connect. Search / Share lists nine rows. Six are projects and open that row's GitHub repository. Three are Claude skills and open the markdown in the page. Connect lists GitHub, X, and LinkedIn. There is no About section and no email address on the page.

## Stack

- HTML, CSS, and JavaScript in `index.html`, plus `js/hero-animation.js` for the hero canvas.
- No framework, package manifest, build step, backend, or analytics script.
- UI font stack: Tahoma, Verdana, Noto Sans, Arial, Helvetica, sans-serif. Noto Sans is loaded from Google Fonts.
- Skill source is Markdown in `skills/`. The same text is embedded in `index.html` so a `file://` preview can still render it.
- Hosting file: `netlify.toml`.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page: styles, catalogue, routing, skill modal, embedded skill JSON. |
| `js/hero-animation.js` | Canvas compositor for the crystals, CRT wave, clouds, straws, and plane. Artwork coordinates are 1672×940. Updates at 12fps. |
| `skills/` | `sharpener.md` (268 lines), `distil.md` (224), `concise.md` (279). |
| `images/new/` | Hero poster as AVIF, WebP, and PNG, plus the source SVG. |
| `images/hero-animation/` | Sprites and SVGs the canvas loads. |
| `images/hero-layers/` | Earlier layer kit, including `geometry.json`. The running canvas loads its files from `images/hero-animation/`. |
| `images/aku-aku.png` | Favicon, Apple touch icon, and the character shown during the zoom. |
| `images/Limewire2008.png`, `images/Homepage.svg` | Reference art kept in the repo. |
| `docs/` | Animation brief, asset notes, and a written log of local browser checks. |
| `netlify.toml` | Publish root, `/apps/` rewrites, response headers. |
| `robots.txt`, `sitemap.xml` | Discovery files for vibesonvibesonvibes.com. |
| `HANDOFF.md` | Implementation checkpoint, updated 2026-09-11 for the landing animation. |
| `vibewire-briefing.md` | Longer design history. It still describes an earlier four-project catalogue. |
| `PORTFOLIO_FACTS.md` | Claims ledger for the projects. The file's last verified date is 2026-08-13, and several fields are still marked unresolved. |
| `publishing-checklist.md` | Launch notes for Netlify. Some of its project links and routes predate the current catalogue. |

## Catalogue

The rows are the `apps` array in `index.html`. Category and tech counts in the sidebar are counted from that array.

| # | Name on the site | Opens |
| --- | --- | --- |
| 1 | `investment_committee_v2.1.py` | https://github.com/polski-sklep/aiic |
| 2 | `nutrai_v1.0.py` | https://github.com/polski-sklep/nutrAI |
| 3 | `ai_curriculum_ingest_v1.4.py` | https://github.com/polski-sklep/ai-curriculum-ingest |
| 4 | `telegram_contact_graph_v1.0.py` | https://github.com/polski-sklep/telegram-contact-graph |
| 5 | `fitness_tracker_v1.0.zip` | https://github.com/polski-sklep/fitness-tracker |
| 6 | `doctor_brainrot_v1.0.py` | https://github.com/polski-sklep/dr-brainrot |
| 7 | `sharpener_v0.3.md` | In-page skill modal |
| 8 | `distil_v0.1.md` | In-page skill modal |
| 9 | `concise_v0.3.md` | In-page skill modal |

Sidebar filters: All, Agents, Infrastructure, Apps, Skills, and a tech list (Python, Claude API, Markdown / Prompting, FastAPI, Telegram API, Postgres / pgvector, HTMX, Tailscale, Telethon). A row tooltip appears for a fine mouse pointer on a hover-capable screen wider than 768px. Touch, coarse pointers, and narrower layouts hide it.

A click on a project row opens its GitHub URL in a new tab. A click on a skill row opens the modal. From the modal, Download .md saves that skill. On the Skills filter, "Download all skills" builds `vibesonvibesonvibes-skills.zip` in the browser. The main Download button opens https://github.com/polski-sklep. Browse Host opens Connect. Stop Search and Junk are disabled.

`distil` and `concise` carry an MIT license and name Jacob Kowalewski in their own frontmatter. This repository has no license file.

## Setup

Nothing to install. A current browser is the prerequisite. The page then loads its images, `js/hero-animation.js`, and the Google Fonts stylesheet.

Open `index.html` directly. On `file:` the page points `<base>` at the file's own directory, so the poster, animation assets, and script still resolve.

To exercise the same root-relative URLs the hosted page uses, serve this directory as the site root. On `http:` and `https:` the page sets `<base href="/">`.

## Configuration

No environment variables. There is no `.env` or `.env.example`, and the page does not read any.

## Running locally

With the folder served as the site root, `/` shows the hero. These hash routes open the app without Netlify:

- `/#connect` opens Connect
- `/#app/search` opens Search / Share
- `/#app/skills` opens Search / Share with the Skills filter
- `#app/network` and `#app/connect` still open Connect

On `http:` and `https:`, entering Search / Share replaces the URL with `/apps/`, and Connect replaces it with `/#connect`. Leaving the app returns the URL to `/`.

`/apps` and `/apps/` are rewritten to `/index.html` by `netlify.toml`. A static server that does not apply that file will not serve those paths.

There is no test suite in the repo. `docs/animation-validation.md` is a written log of local Chromium checks from September and October 2026.

## Deployment

`netlify.toml` is the deploy config in the repo:

- `[build]` sets `publish = "."` and does not set a build command.
- `/apps/` and `/apps/*` rewrite to `/index.html` with status 200.
- Every response sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` that disables camera, microphone, and geolocation.
- `/images/*` is cached with `Cache-Control: public, max-age=604800`.

`publishing-checklist.md` describes launching on Netlify with the custom domain `vibesonvibesonvibes.com`. `robots.txt` allows all crawlers and points at `https://vibesonvibesonvibes.com/sitemap.xml`. The sitemap lists `/` and `/apps/`.

## Status

- The Development Progress panel is a fixed list of four projects, labelled Readiness 4/5, 4/5, 3/5, and 2/5. The search table has six projects. In the table, curriculum is 3 stars and fitness is 3 stars; the panel still says 4/5 and 2/5 for those two. Clear, Resume, Pause, Launch, Explore, and Clear Inactive have no click handlers. File, View, Tools, Help, Minimize, and Maximize are decorative.
- `doctor_brainrot_v1.0.py` has an empty Usable cell. The other eight rows show a check.
- Each catalogue object also stores `speed` and `bitrate`. The page never reads those fields.
- The hero and the result rows open on click. There is no keyboard handler for them. The skill modal closes on Escape, the close button, or a click on the backdrop, and it does not move focus.
- `HANDOFF.md` still lists Safari, physical phones, and a production pass over `/`, `/apps`, `/apps/`, `/#connect`, and the hash routes as unfinished. The hero container is `100vh`. There is no swipe-to-enter handler; a tap still enters.
- If an animation image fails to decode, the canvas keeps the original poster and logs a warning.
- `PORTFOLIO_FACTS.md` says the host is Cloudflare Pages and the page is about 34 KB. The hosting file in this repo is `netlify.toml`, and `index.html` is 166,043 bytes. Several project claims in that facts file are marked unresolved or called out as discrepancies. The copy on the site is the `apps` array.
