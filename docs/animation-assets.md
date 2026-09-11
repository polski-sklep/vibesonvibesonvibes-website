# Animation asset provenance

Generated with the built-in ImageGen tool on 2026-09-11. Final PNGs and optimized WebP copies are in `images/hero-animation/`. WebP conversion preserves alpha. Crystals are closed procedural geometry in `js/hero-animation.js`, not rotating bitmap planes.

The original composition is retained as the static poster. Generated clean-plate pixels are used only for the screen, straw footprints, and feathered crystal reconstruction patches. Generated lockup and straw sprites are cropped and composited in the browser. The plane/trail sprite receives a muted dusty-pink tint; the current user direction is **one thin line**, with a tiny distant aircraft. The older twin-trail and large-aircraft variants are not used.

The earlier SVG source was inspected but its foreground geometry differed from the current hero; it is not used in the final compositor. Discarded logo extraction attempts that contained checkerboard backgrounds are also not used.

## Clean background plate

Use case: precise-object-edit. Asset: clean background plate for a layered animated website.
EDIT TARGET: the supplied 1672x940 hero image. Preserve the exact full composition, crop, framing, camera, dimensions, phone positions, Capri-Sun pouch positions and branding, CRT monitor/bezel/computer, skyline, colors and image grain.
Remove ONLY: (1) both green elongated diamond/plumbob crystals beside the computer; reconstruct the dark London buildings/trees and lower background behind their entire silhouettes including the green reflections/edges, preserving the pouches and computer in front; (2) all Windows flag/logo pixels and all 'Click for Vibes95' lettering inside the CRT display; fill the display with the same continuous blue sky and white clouds, with no writing or symbols; (3) remove the remaining straw pixels and smeared straw remnants near both Capri-Sun insertion points; seamlessly reconstruct the pouch/phone/sky beneath their exposed length, keep tiny dark insertion holes.
IMPORTANT all pixels outside these edits must retain their positions, with no layout changes, no resizing of objects, no new objects. Output one full landscape clean plate at the same 1672:940 aspect ratio. No green crystal remnants, no duplicated letters, no black or transparent holes, no rectangular patches. This will sit beneath independently animated copies.

## Clean plate: remove premature insertion holes

Precise local edit of the supplied clean background plate. Remove only the two tiny dark round puncture holes from the top silver edges of the Capri-Sun pouches: left hole approximately x106 y484 and right hole x1580 y476 in this 1672x940 image. Fill each tiny spot with the immediately surrounding silver/blue pouch surface, seamless continuation of its foil texture. Do not add new holes. Preserve every other pixel, object, cloud, framing, positions and proportions. This is a straw-free background plate; straws and holes will be separate foreground layers. Output same size 1672x940.

## Transparent screen lockup

Create a transparent PNG graphic asset: a classic 1995 waving Windows flag with its little trailing square pixels above the words "Click for Vibes95". Arrange exactly like a Windows 95 startup lockup: big waving flag above, small WHITE italic "Click for" below the flag left aligned, then BLACK very heavy Arial Black "Vibes" on the bottom line and WHITE thin "95" immediately alongside to its right. The 95 characters must be separately readable. Use the classic four red/green/blue/yellow flag panes with a thick black waving border. The flag is about two thirds the full lettering width. Entire lockup approximately 340 units wide and 270 tall, generous 35-unit transparent padding. The only visible pixels are the logo and lettering. Alpha transparent background. Do not add any grey or white backing. This is a 1990s logo sprite, no fabric texture or reflections.

## Photographic straw sprite

Create one transparent PNG sprite of a straight orange-gold plastic drinking straw, photographed like a Capri-Sun straw from an early-2000s collage. The straw stands exactly vertical, top at top, bottom at bottom. It is a very narrow constant-width tube with a tiny rounded open top and straight shaft, pale cream specular stripe down its left edge, amber orange along its right edge. No accordion/bendy segment, no bend, no diagonal slant, no cup or pouch, no decorations. Approximate tube proportions 12 pixels wide to 160 pixels tall when scaled for a website. Photographic shading and mild image grain, not vector artwork. Plain alpha-transparent background with generous transparent padding on all sides. Need ONLY the straw, no shadow on a ground plane. It will be composited over a Capri-Sun pouch and its top/bottom will be cropped for telescoping animation.

## Final plane and single pink trail

Create a transparent PNG asset for a distant airplane flyover. ONE extremely thin SINGLE dusty-pink contrail, horizontal, extending from a barely visible tiny aircraft at the LEFT end toward the RIGHT, softly fading to nothing at the right tip. No splitting, NO twin trails, no parallel lines. The trail is a fine pink line like a distant sunset contrail, not a broad plume or ribbon. Its length is around 100 times its thickness. The plane is only a tiny dark/pale blue-grey photographic speck with barely discernible wings at the left end, flying left. Muted mauve pink, subtle and low contrast, matching pink lights in a blue dusk London skyline. Grainy distant photographic appearance. Only the tiny plane and ONE fine pink trail, with real alpha transparency around them. Wide horizontal image, no background sky, no clouds, no rectangle. Transparent padding.


## Mirrored phone and MissingNo layers (native artwork extraction)

These assets were extracted by editing the existing SVG document, without image generation or redrawing the source imagery:

- `phone-source.svg`: original right-phone group (top-level child 8) and only its referenced definitions, from `images/new/vibesvibesvibes website.svg`. Rendered at 1672×940, translated +267px / −170px to align with the current hero; the left phone is an exact horizontal reflection.
- `missingno-source.svg`: original right MissingNo group (child 6) and referenced definitions. One copy per side, mirrored around the artwork centre. Both slide inward 220px over 1.2s, then remain still.
- `skyline-source.svg`: original skyline group (child 7), used only beneath the old side objects; the centre of the collage retains its existing pixels.
- `pouch-mask-source.svg`: original pouch groups (children 13/14) and their alpha-mask definitions. Right alignment +75/−9px; left −77/−31px. Colour images are replaced by white rectangles under their original masks because only silhouettes are needed. The compositor removes exposed old-straw tips from this mask while keeping the foil under each shaft opaque.

All four SVGs are self-contained and reside in `images/hero-animation/`. The browser decodes them within the existing atomic loading gate. Reduced motion shows the completed symmetric layout immediately; optional-layer failure retains the complete original poster.
