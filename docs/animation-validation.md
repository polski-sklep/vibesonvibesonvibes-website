# Landing animation validation

2026-09-11. Tested locally in Chromium against a localhost server implementing the existing `/apps/` rewrites. No production deployment was performed.

Passed:

- Visual phase captures at 0, 1, 2, 3, 4, 12, 24, 38, 48, 71.99 and 72 seconds; inspected composition, wave containment, straw lengths, foreground masks, and the single thin pink trail.
- Pixel comparisons: left crystal returns exactly at 8 seconds; right at 10 seconds; screen wave at 4 seconds. Intermediate frames differ. The original plane timing was also checked; it has since been superseded by the diagonal-flight follow-up below.
- 1440×900, 1280×720, 390×844 and 375×667 layouts retain the common 1672:940 scene coordinates. Mobile preserves the existing cover crop, so outer artwork is intentionally offscreen.
- Five consecutive two-click entry/Escape-return cycles; downward wheel entry; Close return. Hero remains visible after every return.
- Reduced motion retains the original static artwork and enters the app without the camera zoom.
- Direct `/apps/`, `/apps`, `/#connect`, `/#app/search`, and `/#app/skills` routes; no script/image requests served HTML. Static `<base>` also prevents the initial speculative-preload route failure found during testing.
- Skill modal, individual Markdown download, and skills ZIP download.
- Direct `file://` preview loads the animation assets.
- A deliberately failed straw-asset request leaves the complete static poster, with no half-composed animation.
- No uncaught JavaScript errors. Inline scripts and the animation script parse; whitespace checks pass.

Still requires real-device/Safari and production smoke testing after deployment. The existing mobile hero uses two taps; touch-swipe entry and broader keyboard/modal accessibility are separate follow-ups in HANDOFF.md.

Follow-up: straws now have exactly two visible states (91px in / 143px far out), verified by rendered-pixel comparisons across 24 sampled times. The full logo/text graphic is centred on the CRT glass in both animated and reduced-motion views; visually checked at 1672×940.

Follow-up: the plane now climbs diagonally from the right phone/pouch junction toward the marked top-left sky area. Its aircraft is 50% larger, with speed reduced to ~12.4 artwork px/s; flight/idle timing is 84s/24s. Captured phases at 0, 6, 18, 32, 48, 64, 84 and 108 seconds in Chromium. Visually checked the diagonal route, single pink trail, building occlusion and offscreen exit; no uncaught JavaScript errors.

Latest follow-up (supersedes the straw lengths and plane timing above):

- Plane enlarged again using a higher-resolution aircraft crop; starts behind the Walkie Talkie on the same diagonal line and at the same speed. New flight/idle timing is 60s/24s. Checked phases 0, 6, 18, 32 and 60s; sky-region pixel comparisons confirm no plane during 60–84s idle and an identical starting region at 0/84s.
- Straw clocks run 1.3× faster, with 62px in / 143px out lengths. Rendered pixel comparisons across 32 samples still produce exactly two states for each straw.
- Clouds drift independently within the CRT glass at 1.2px/s. Cloud-region samples change across time while the existing wave keeps its 4s period and 5px strength. Text/flag rendering now uses 3× resolution and continuous displacement before a single downsample; visually inspected the cleaner edges.
- Chromium captures include reduced motion. No uncaught JavaScript errors. Mean full-scene rendering time over 48 frames was ~24.7ms on the local test machine, within the existing 83ms frame budget. Script syntax and whitespace checks pass.

Symmetric side-layer follow-up:

- Visually inspected entrance phases at 0, 0.3, 0.6, 1.2 and 2 seconds, including foil/shaft overlaps after correcting the pouch mask.
- Rendered phone and MissingNo sample regions match their opposite reflected regions exactly (maximum channel difference 0). MissingNo samples change during entrance and remain identical at 1.2, 2 and 10 seconds.
- After entrance, 32 sampled frames still produce exactly two states per straw. The broad straw sample regions also contain the sliding background during entrance; they should only be used for state counts after 1.2 seconds.
- Checked entry/Escape return, a mobile viewport, static reduced-motion output, `/apps/` loading and direct `file://` loading with the new self-contained SVG assets. No uncaught JavaScript errors.
- The finished side composite is cached; only the first 1.2 seconds require side-layer recompositing. Script syntax and whitespace checks pass. Physical-device/Safari and production checks remain outstanding.

Static MissingNo follow-up: the entrance animation is removed. Both patterns now retain identical rendered samples at 0, 0.3, 0.6, 1.2, 2 and 10 seconds, with all animation assets loaded and no JavaScript errors. The earlier entrance-specific checks above are historical.
