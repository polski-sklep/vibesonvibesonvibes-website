# VibeWire Website Brief

## Project Overview

The website is a static, single-page portfolio built as a fictional peer-to-peer desktop application called **VibeWire PRO 4.20.69**. The site is intentionally framed as a nostalgic Windows 95 / LimeWire-era experience: the visitor first sees a full-screen hero image of a retro computer setup, then scrolls or clicks into a zoom transition that lands inside the computer screen, revealing the usable VibeWire interface.

The project is hosted in `/Users/Jacob/Projects/vibesonvibesonvibes-website` and is currently implemented primarily in a single file:

- `index.html`

Supporting visual assets live in:

- `images/`
- `images/new/`

The design goal is not a conventional portfolio. It is a self-aware, vibecoded, retro internet artifact: part portfolio, part software interface, part visual gag, and part interactive directory of projects.

## Current Experience

The user journey has two major states:

1. **Hero / Intro State**
   - A full-viewport image fills the browser.
   - The image shows a retro Windows 95 computer scene.
   - The Windows screen area is the visual target.
   - The visitor can click twice anywhere or scroll sufficiently to trigger entry.

2. **VibeWire App State**
   - The camera zooms into the Windows 95 screen.
   - The VibeWire interface emerges from inside the screen.
   - The app locks into a full-window interface.
   - The visitor can browse projects and contact links through a LimeWire-inspired UI.

The intended feeling is that the visitor is being pulled from a nostalgic desktop image into a usable, slightly absurd, browser-native fake application.

## Hero

The hero currently uses the PNG asset:

`images/new/vibesvibesvibes-website-click-for-vibes.png`

This image replaced earlier lower-quality hero experiments. It is based on the higher-resolution image in the `images/new` folder and includes a raster edit inside the computer monitor:

- The original Windows text was modified.
- `Microsoft` was changed to `Click for`.
- `Windows` was changed to `Vibes`.
- The `95` remains visible, creating a playful `Click for Vibes95` effect.

The hero is intentionally image-only. All previous DOM overlays over the hero image were removed.

Removed hero experiments include:

- A semi-transparent overlay over the hero image.
- A center-screen `Click for Vibes` text overlay.
- A Microsoft Paint-style animated DOM text graphic.

The current direction is that any "Click for Vibes" messaging lives inside the image itself, not as a separate web overlay.

## Hero Positioning

Several rounds of work focused on centering the Windows 95 screen during the zoom moment.

The current implementation anchors the zoom around the screen area rather than the entire image. The zoom wrapper uses a fixed transform origin and GPU-backed transforms so the camera move feels more intentional:

- Transform origin: `50% 38%`
- Zoom target scale: approximately `3.35`
- The app frame is positioned over the screen area with percentage-based geometry.

The goal is that when the user scrolls into the page, the Windows 95 screen becomes the center of attention rather than drifting low, high, or off-axis.

## Scroll And Entry Behaviour

The scroll interaction was heavily revised because the earlier version required the user to keep manually scrolling through a long transition. That created dead space and increased the risk of drop-off.

The current behaviour is:

- The user can enter by clicking twice anywhere on the hero.
- The user can also enter by scrolling down with sufficient intent.
- Once triggered, the rest of the transition happens automatically.
- The user does not need to keep scrolling until the page appears.

Current entry constants in the JavaScript include:

- `HERO_LOCK_PROGRESS = 0.86`
- `AUTO_ENTER_SCROLL_PROGRESS = 0.02`
- `AUTO_ENTER_WHEEL_INTENT = 120`

The auto-enter animation currently runs for about `1100ms`.

During the transition:

- The camera begins at the current scroll progress.
- It eases toward the app lock point.
- The VibeWire app becomes fixed and fully interactive once the lock point is reached.

This was designed to make the scroll moment feel like a transition, not a chore.

## Returning To The Hero

The site also supports returning from the app to the hero.

The user asked for enough upward scrolling to return to the hero, roughly three to four scroll gestures. The implementation now watches upward wheel intent while the app is locked.

Current return constants include:

- `RETURN_TO_HERO_WHEEL_INTENT = 1100`
- `RETURN_TO_HERO_SCROLLS = 4`

When the user scrolls up enough:

- The app unlocks.
- The app frame reattaches to the zoom wrapper.
- The body background returns to black.
- The app hash is removed if appropriate.
- The hero becomes visible again.

This gives the site a two-way feel: the app is not a hard point of no return.

## Aku Aku Transition

An Aku Aku image was added as a temporary visual during the zoom transition.

Asset:

`images/aku-aku.png`

Behaviour:

- Aku Aku appears around 17% into the zoom process.
- It remains visible through the middle of the transition.
- It disappears before the VibeWire app fully appears.

This is implemented as an absolutely positioned image inside the hero scene with a CSS animation triggered by the `aku-active` class.

The current animation logic:

- Hidden at the beginning.
- Visible after the early zoom phase.
- Floating / pulsing during the transition.
- Fully hidden again once the app has appeared.

This creates a brief surreal transition element without leaving visual clutter on the final app.

## VibeWire App Shell

The app is styled as a retro LimeWire-like desktop window.

Main visible identity:

`vibesonvibesonvibes.com v2.1.337 - Connected to Network`

Browser page title:

`VibeWire PRO 4.20.69 - vibesonvibesonvibes.com`

The shell includes:

- Green title bar.
- Window control buttons.
- Classic menu bar.
- Tab toolbar.
- LimeWire-inspired logo treatment.
- Bottom status bar.
- Download/action bar.
- Table-based browsing experience.

The app deliberately uses compressed UI density, muted beige/green tones, small labels, and Windows-era interface structure.

## Current Top Navigation

The app currently has only two tabs:

- `Search / Share`
- `Connect`

The `About` tab has been removed entirely.

Earlier navigation iterations included:

- `My Profile`
- `About`
- `Network`

These were changed as follows:

- `My Profile` was changed to `About`.
- `Network` was changed to `Connect`.
- The `About` tab and section were later removed completely.

There is currently no visible About page, no About tab, and no About section.

## Search / Share Page

`Search / Share` is the primary page.

It presents Jacob's vibecoded projects as if they are search results or downloadable files on a P2P network.

The page includes:

- Left filter sidebar.
- Search results table.
- Yellow context bar.
- Action buttons.
- Downloads panel.
- Status bar.

### Search Label

The search result label is dynamic:

`Vibecoded Apps (4)`

The number changes based on the active filter.

### Yellow Bar Copy

The original yellow bar copy was:

`Only search results with a ✅ are verified vibecoded builds. More Info...`

This was changed to:

`Things that I have vibecoded that I use on, more or less, a daily basis.`

At one stage, `More Info...` was intended to link to `About`. Once the About section was removed entirely, the visible link was removed from this Search / Share bar.

### Table Copy Changes

The project table headers were updated:

- `Quality` became `Readiness`
- `License` became `Usable`

Current headers:

- `Readiness`
- `#`
- `Usable`
- `Name`
- `Type`
- `Size`
- `Speed`
- `Bitrate`

On smaller/mobile layouts, some columns are hidden to keep the table usable.

### Search / Share Sidebar

The left sidebar uses classic category filters.

Functional category filters:

- `All (4)`
- `Agents`
- `Infrastructure`
- `Apps`

Functional and contextual filter groups:

- `Tech Stack`
- `Builder`

Tech Stack items include:

- `All (4)`
- `Python (4)`
- `Claude API (3)`
- `FastAPI (2)`
- `Telegram API (2)`
- `Postgres / pgvector (2)`
- `HTMX (1)`
- `Tailscale (1)`
- `Telethon (1)`
- `Next.js (1)`

Builder includes:

- `All (1)`
- `Jacob Kowalewski`

There is also a `Back To Search` control for resetting the active filter.

## Project Data

The current project list contains four real rows. The previous placeholder rows, AI job search row, and self-referential website row were removed for launch.

### committee_orchestrator_v2.1_multiagent_crypto.py

Displayed as:

`🤖 committee_orchestrator_v2.1_mu...`

Metadata:

- Category: `Agents`
- Readiness: 4 stars
- Number: `6`
- Usable: `✅`
- Type: `py`
- Size: `1.3 MB`
- Speed: `T3 or Higher`
- Bitrate: `271`

Description:

`A self-hosted AI investment committee that evaluates crypto projects through 15 specialized agents — analyzing tokenomics, on-chain data, technical structure, governance, and risk in parallel, then stress-testing the bull case through adversarial review before issuing a BUY/PASS/WATCH/VETO recommendation. Tracks every recommendation against actual price performance to measure whether its calls are right.`

Tech:

`Python, FastAPI, Next.js, pgvector, Claude API`

URL:

`https://github.com/polski-sklep/aiic`

### ai_curriculum_ingest_v1.4_spaced_rep.py

Displayed as:

`📚 ai_curriculum_ingest_v1.4_spaced_rep.py`

Metadata:

- Category: `Infrastructure`
- Readiness: 4 stars
- Number: `5`
- Usable: `✅`
- Type: `py`
- Size: `212 KB`
- Speed: `T3 or Higher`
- Bitrate: `128`

Description:

`A dynamic, self-building AI curriculum that keeps you current with the fast-moving world of AI: send a Telegram bot any tweet, article, screenshot, or PDF, and it extracts the content, analyses it with Claude, and files it as a structured note in your Obsidian vault. That curriculum then becomes a working reference you can draw on while building and deploying AI apps, turning everyday development into proactive, compounding learning.`

Tech:

`Python, Claude API, Telegram Bot API, systemd`

URL:

`https://github.com/polski-sklep/ai-curriculum-ingest`

### telegram_contact_graph_v1.0.py

Displayed as:

`🛰️ telegram_contact_graph_v1.0.py`

Metadata:

- Category: `Infrastructure`
- Readiness: 3 stars
- Number: `4`
- Usable: `✅`
- Type: `py`
- Size: `184 KB`
- Speed: `T1`
- Bitrate: `128`

Description:

`An LLM pipeline that turns raw Telegram history into a structured, categorised contact CRM in Notion — describing each contact's affiliation, evidence-backed summary, and warmth without fabricating, with user ground truth and human review overriding the model where needed.`

Tech:

`Python, Telethon, Telegram API, JSON`

URL:

`https://github.com/polski-sklep/telegram-contact-graph`

### fitness_tracker_power_score_v1.0.zip

Displayed as:

`🏋️ fitness_tracker_power_score_v1.0.zip`

Metadata:

- Category: `Apps`
- Readiness: 2 stars
- Number: `4`
- Usable: empty
- Type: `zip`
- Size: `776 KB`
- Speed: `Tailscale`
- Bitrate: `128`

Description:

`Telegram bot that ingests your strength and cycling sessions as free-text or screenshots, extracts structured data via Claude, and stores it in a Postgres database. Generates weekly summaries and serves a dashboard with a custom Power Score, PR detection, and muscle-group heatmap, all accessible privately over Tailscale.`

Tech:

`Python, FastAPI, HTMX, Postgres, Claude API, Tailscale`

URL:

`https://github.com/polski-sklep/fitness-tracker`

## Project Linking Behaviour

Projects are intended to link out to GitHub so people can engage with the work.

The current JavaScript includes:

`GITHUB_HOST = "https://github.com/polski-sklep"`

Every current project row has a specific `url`. If a future project row is missing one, the interaction falls back to the `polski-sklep` GitHub profile.

Project browsing behaviours:

- Selecting a row highlights it.
- Hovering a row shows a retro tooltip with description and stack.
- Double-clicking a row opens the project URL or GitHub fallback.
- The `Browse Host` action opens the selected project URL or GitHub fallback.

## Downloads Panel

The Search / Share page includes a fake LimeWire-style downloads panel, now repurposed as a readiness meter for the four visible projects.

Initial rows:

1. `committee_orchestrator_v2.1.py`
   - Size: `1.3 MB`
   - Status: `Readiness 4/5`
   - Progress: `81%`
   - Speed: `T3+`

2. `ai_curriculum_ingest_v1.4.py`
   - Size: `212 KB`
   - Status: `Readiness 4/5`
   - Progress: `78%`
   - Speed: `T3+`

3. `telegram_contact_graph_v1.0.py`
   - Size: `184 KB`
   - Status: `Readiness 3/5`
   - Progress: `62%`
   - Speed: `T1`

4. `fitness_tracker_power_score_v1.0.zip`
   - Size: `776 KB`
   - Status: `Readiness 2/5`
   - Progress: `43%`
   - Speed: `Tailscale`

These progress bars are static, correspond approximately to the project readiness ratings, use less sterile non-round percentages, and use the original LimeWire-style blue progress treatment.

The action buttons include:

- `Download`
- `Browse Host`
- `Stop Search`
- `Junk`

Only relevant actions are functional; disabled actions are visually muted.

## Connect Page

The `Connect` page replaced the earlier `Network` label.

It is a contact/link page styled as peer discovery.

Search label:

`Connect Peers (3)`

Yellow bar copy:

`🌐 Connection quality: Excellent. These verified peers open in a new tab.`

Current peers:

### GitHub

- Peer: `GitHub`
- Address: `github.com/polski-sklep`
- Protocol: `git`
- Status: `Online`
- Speed: `T3`

### X

- Peer: `X`
- Address: `x.com/overtonlimbo`
- Protocol: `social`
- Status: `Online`
- Speed: `T1`

### LinkedIn

- Peer: `LinkedIn`
- Address: `linkedin.com/in/jacobkowalewski`
- Protocol: `profile`
- Status: `Online`
- Speed: `T3`

Connect actions:

- `Browse Host`
- `Ping`
- `Stop Search`
- `Junk`

`Browse Host` opens GitHub. `Ping` opens X. Email has been removed from the site.

## Removed About Page

The About page went through multiple iterations and was ultimately removed.

Change sequence:

1. The original label `My Profile` was changed to `About`.
2. The About page was restyled to be closer to `Search / Share`.
3. A later request asked for the whole page to be redone in a minimal style inspired by a simple personal website reference.
4. That version was rejected.
5. The About tab was removed.
6. The About section was removed entirely.

Current state:

- No `About` tab.
- No `About` route in the visible interface.
- No About page content.
- Unknown `#app/...` hashes fall back to Search / Share.

This leaves the site cleaner and more focused on the two strongest concepts: project search and connection peers.

## Status Bar

The bottom status bar reinforces the fake P2P client aesthetic.

Visible copy and elements include:

- Green connection dot.
- Signal bars.
- `⬆ 1 @ 79 KB/s`
- `⬇ 0 @ 0 KB/s`
- `Support vibecoding and open protocols. Get VibeWire PRO.`
- Media controls: `◀◀ ▶ ▶▶`
- Label: `VibeWire Media Player`

## Routing

The site uses hash routing.

Current route behaviour:

- No hash: hero state.
- `#app`: Search / Share.
- `#app/search`: Search / Share.
- `#app/network`: Connect.
- Any other `#app/...`: Search / Share fallback.

The route still uses `network` internally for the Connect page, even though the visible copy is `Connect`.

## Mobile And Responsive Behaviour

The site has been checked and adjusted for mobile-style viewports.

Key mobile considerations:

- The hero remains image-led.
- The zoom/app transition still works.
- Dense table columns are reduced.
- Less essential columns are hidden on smaller screens.
- The app UI keeps the retro density but avoids forcing every desktop column into the mobile viewport.

The app remains intentionally desktop-like, because the concept is a retro desktop client. The responsive work is primarily to make that concept survivable on smaller screens rather than to convert it into a modern mobile app layout.

## Visual Direction

The visual language combines:

- Windows 95 nostalgia.
- LimeWire / early 2000s P2P interface cues.
- Low-friction personal portfolio content.
- Playful internet artifact energy.
- Self-referential project listing.

Important aesthetic choices:

- Use the real hero image without overlays.
- Keep the app chrome dense and functional.
- Avoid making it feel like LinkedIn.
- Avoid over-explaining the site with modern marketing copy.
- Let the project table and interaction carry the concept.

## Copy Change Log

Major copy changes made during the build:

- `My Profile` changed to `About`.
- `About` was later removed entirely.
- `Network` changed to `Connect`.
- `Quality` changed to `Readiness`.
- `License` changed to `Usable`.
- Search yellow bar changed from:
  - `Only search results with a ✅ are verified vibecoded builds. More Info...`
- To:
  - `Things that I have vibecoded that I use on, more or less, a daily basis.`
- The Search yellow bar `More Info...` link was removed after About was removed.
- Hero overlay text `Click for Vibes` was added experimentally and later removed.
- The final hero image itself now contains the edited text:
  - `Click for`
  - `Vibes`
- `VibeWire` remained the app brand.
- `vibesonvibesonvibes.com v2.1.337 - Connected to Network` remains in the title bar.
- Browser title remains `VibeWire PRO 4.20.69 - vibesonvibesonvibes.com`.

## Interaction Change Log

Major interaction changes made during the build:

- Removed overlay over hero image.
- Replaced lower-quality hero with a PNG from `images/new`.
- Adjusted hero positioning so the Windows 95 screen is the center of the zoom target.
- Reduced low-quality scroll dead space.
- Added auto-enter after sufficient scroll intent.
- Added auto-enter after two clicks anywhere on the hero.
- Added return-to-hero behaviour after sufficient upward scrolling.
- Added Aku Aku during the zoom moment.
- Removed the failed DOM `Click for Vibes` overlay.
- Edited the hero image itself to carry the `Click for Vibes` message.
- Removed About tab and About section entirely.

## Technical Notes

The current site is intentionally simple:

- No build step.
- No framework.
- No external application runtime.
- The page can be opened directly as `index.html`.
- It can also be served from a local static server.

The implementation uses:

- HTML
- CSS
- Vanilla JavaScript
- Static images
- Hash routing
- CSS transforms
- CSS animation

The scroll zoom relies on:

- A sticky hero scene.
- A transform-scaled image wrapper.
- A positioned app frame.
- Lock/unlock logic that swaps the app between screen-bound and full-viewport states.

## Current Local Preview Options

The site can be opened directly:

`file:///Users/Jacob/Projects/vibesonvibesonvibes-website/index.html`

It can also be served locally with a simple static server from the project directory.

Example:

`python3 -m http.server 4180`

Then open:

`http://127.0.0.1:4180/?v=live`

The `?v=` query strings used during development were cache-busting labels, not required app logic.

## Product Positioning

This website should be understood as a portfolio disguised as a nostalgic file-sharing application.

The strongest concept is:

> Jacob's vibecoded projects are files on a weird, living, retro internet network.

The site is at its best when it commits to that fiction:

- Projects behave like downloadable files.
- Contact links behave like peers.
- The hero behaves like a gateway into the computer.
- The app feels functional enough to explore, but strange enough to be memorable.

## Recommended Next Pass

Potential next improvements:

1. Add project-specific GitHub URLs to each real project row.
2. Replace placeholder rows when new projects are ready.
3. Add first commits to the newly public empty project repos so visitors land on useful README/project pages.
4. Continue testing the zoom center across common browser viewport sizes.
5. Consider one small piece of onboarding inside the image only, not as an overlay.
6. Keep the app focused on `Search / Share` and `Connect`; avoid reintroducing a full About page unless it can match the strength of the main concept.
