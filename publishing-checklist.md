# Publishing Checklist

## Hosting Decision

Use **Netlify** for launch.

Why:

- This is a static site with no build step.
- Netlify gives HTTPS automatically.
- Namescheap domains are easy to point at Netlify.
- No analytics are enabled by default.
- Hash routes like `#app/search` and `#app/network` work without server routing.

## Domain

Canonical domain:

`https://vibesonvibesonvibes.com/`

The HTML already includes canonical, Open Graph, Twitter card, robots, and sitemap metadata for this domain.

## Deploy Files Added

- `netlify.toml`
- `robots.txt`
- `sitemap.xml`

## Suggested Netlify Setup

1. Create a new Netlify site.
2. Deploy from the project folder or from a GitHub repo.
3. Use this project root as the publish directory:

   `.`

4. No build command is required.
5. Add custom domain:

   `vibesonvibesonvibes.com`

6. In Namescheap DNS, point the domain to Netlify using Netlify's provided DNS instructions.
7. Wait for Netlify to issue HTTPS.

## GitHub Project Link Requirement

Every visible project row now points to an individual `polski-sklep` GitHub repo URL.

Current target URLs:

- `https://github.com/polski-sklep/aiic`
- `https://github.com/polski-sklep/ai-job-search`
- `https://github.com/polski-sklep/ai-curriculum-ingest`
- `https://github.com/polski-sklep/telegram-contact-graph`
- `https://github.com/polski-sklep/fitness-tracker`
- `https://github.com/polski-sklep/vibesonvibesonvibes-website`

The four newly created project repos and `ai-job-search` were verified as publicly reachable on June 10, 2026. The self-referential website repo URL still needs to be created or changed before final launch. The newly created repos are currently empty, so the remaining project-link task is to push first commits with useful READMEs before launch.

## Routes To Test

- `https://vibesonvibesonvibes.com/`
- `https://vibesonvibesonvibes.com/#app/search`
- `https://vibesonvibesonvibes.com/#app/network`

## Launch Positioning

SEO/share title:

`VibeWire PRO 4.20.69`

SEO/share description:

`A chaotic retro internet portfolio disguised as a LimeWire-era app for vibecoded projects, agents, and useful personal systems.`

## Current Launch Choices

- No tracking.
- No email address.
- No About section.
- No placeholder project rows.
- Weird retro visual references stay.
- Hero image text stays as `Click for Vibes95`.
- Mobile should remain usable while preserving the desktop-client feel.
