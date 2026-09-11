# Development Brief: Landing Page Animation Pass

## Objective

Add a series of deliberately janky, late-1990s/early-2000s-style animations to the existing landing page without changing its overall visual composition.

The animations should feel native to the current aesthetic rather than polished, modern, or physically perfect. Favor crude looping behavior, low-frame-rate movement, stepped animation, simple transforms, GIF-like timing, and intentionally dated visual treatment.

Preserve the existing layout, proportions, positioning, imagery, and foreground/background relationships unless an animation specifically requires reconstruction of hidden image areas.

Where elements currently exist only as part of flattened imagery, isolate or recreate them as independent layers before animating them. Do not allow animation to reveal black space, transparent gaps, duplicated pixels, rectangular cutouts, or remnants of the original static element.

---

## 1. Green Crystals: Continuous 3D Rotation

Animate the two green crystals as continuously rotating 3D objects while keeping their current positions and approximate dimensions fixed within the composition.

The rotation should occur around each crystal's own central vertical axis. The crystals themselves should not orbit, drift laterally, bounce, or move away from their existing anchor positions.

Because the current crystals appear to exist as flattened 2D artwork, treat them as objects that need sufficient additional geometry to support a full rotation. Reconstruct, model, generate, or otherwise approximate the unseen sides and rear surfaces so they can rotate convincingly through 360 degrees without exposing a paper-thin image plane.

Isolate each crystal from the existing artwork and reconstruct the area underneath it. When the crystal rotates away from pixels occupied in the original flattened image, the viewer should see the appropriate underlying background rather than black space, transparency, duplicated crystal pixels, or holes in the composition.

Composite the animated crystals back into the scene as independent transparent layers. Preserve their existing depth relationships with nearby objects.

The animation should:

- Rotate continuously through 360 degrees.
- Loop indefinitely.
- Keep each crystal's centre fixed.
- Avoid unnecessary scaling or positional movement.
- Use deliberately simple motion rather than photorealistic rendering.
- Potentially use a slightly reduced frame rate if that better matches the retro aesthetic.
- Return exactly to its initial state at the end of each rotation so the loop contains no visible jump.

The overall result should resemble a strange early-internet 3D object embedded into a mostly static webpage rather than a contemporary high-end 3D animation.

---

## 2. "Click for Vibes 95" and Windows Logo: Travelling Wave Animation

Animate the entire "Click for Vibes 95" graphic and associated Windows logo using the characteristic oscillating wave treatment associated with late-1990s and early-2000s Microsoft-style digital graphics.

Do not simply move the entire lockup as one rigid object.

Instead, apply a travelling sine-wave-style deformation across the artwork. Different horizontal sections of the image should be displaced sequentially so that the graphic appears to flex or ripple like a soft sheet or flag.

The wave should preferably travel from left to right across the graphic.

Treat the Windows logo and the "Click for Vibes 95" typography as a coordinated animated composition. Slightly different deformation strengths may be used if needed to preserve text readability.

The Windows logo can tolerate more pronounced distortion. The text must remain recognisable throughout the animation.

The composition should remain centred within the CRT screen. The animation should distort the graphic in place rather than causing the entire lockup to drift around the display.

Because the existing artwork is flattened against the blue-sky CRT background:

- Separate the logo and typography from the sky.
- Reconstruct the unobstructed sky behind them.
- Place the animated graphic on a transparent foreground layer.
- Provide enough transparent padding around the isolated asset that maximum wave displacement does not cause clipping.
- Prevent rectangular image boundaries, original static pixels, transparency gaps, or duplicated artwork from becoming visible.

Keep the entire deformation contained inside the visible CRT display. Nothing should cross onto the physical monitor bezel.

The animation should feel intentionally dated rather than like a modern liquid, cloth, or shader effect.

Prefer:

- A simple repeating waveform.
- Moderate amplitude.
- Slightly coarse interpolation.
- Potentially reduced frame rate.
- GIF-like movement.
- Linear or mechanical timing.

Avoid:

- Elastic easing.
- Motion blur.
- Fluid simulation.
- Glossy 3D treatment.
- Modern spring animation.
- Excessively smooth procedural movement.

The animation must loop seamlessly. The waveform should complete an exact number of cycles before returning to its starting state so no visible reset occurs.

---

## 3. Skyline Aeroplane: Slow Right-to-Left Flyover

Add a small aeroplane travelling slowly across the upper section of the London skyline.

The aircraft should begin entering from the right side of the skyline, approximately around the visual meeting point between the right-hand mobile phone and the right-hand Capri-Sun pouch.

From there, it should travel generally from right to left across the upper-middle portion of the skyline before eventually leaving the visible scene completely.

The plane should be small and visually subordinate to the rest of the composition. It should read as a distant aircraft rather than a foreground object.

Its visual treatment must match the existing London skyline as closely as possible.

Match:

- Resolution.
- Grain.
- Compression.
- Lighting.
- Contrast.
- Colour balance.
- Slightly dated photographic quality.

Do not use a clean modern vector aeroplane, icon, emoji-like object, or conspicuously sharp 3D model.

A deliberately small, mildly compressed, or slightly low-resolution aircraft asset is preferable if this helps it integrate naturally into the skyline.

The aircraft should face left, matching its direction of travel.

Use a mostly horizontal flight path. A very slight vertical change is acceptable if it makes the movement feel more natural, but avoid pronounced arcs or dramatic changes in altitude.

Its apparent size should remain almost constant throughout the journey. Do not create obvious perspective scaling unless extremely subtle.

Avoid:

- Banking.
- Rotation.
- Dramatic pitch changes.
- Large vertical movement.
- Speed changes.
- Modern easing curves.

Use linear or nearly linear movement.

The aircraft should move relatively slowly compared with the other page animations.

A slightly reduced update rate is acceptable if it contributes to the dated digital aesthetic, but movement should still read as continuous flight rather than obvious teleportation between coordinates.

Treat the aircraft as an independent transparent layer positioned within the skyline depth.

It must remain behind the foreground elements, including:

- Mobile phones.
- Capri-Sun pouches.
- CRT monitor.
- Any other foreground artwork crossing its route.

Use masks or clipping where necessary so that the aircraft naturally disappears behind foreground objects rather than incorrectly rendering over them.

The underlying skyline does not need reconstruction because the aeroplane is being added over previously existing sky.

Entry and exit should not look like the plane suddenly materialises or vanishes in open sky.

Where possible, begin and end the animation:

- Outside the visible skyline bounds, or
- Behind existing foreground artwork.

After the plane has completely exited the scene, leave a meaningful idle period before repeating the sequence.

Do not immediately restart the plane after it leaves. It should feel like an occasional environmental event rather than a permanently circulating UI element.

---

## 4. Capri-Sun Straws: Janky Telescoping Animation

Animate both Capri-Sun straws so that they repeatedly become longer and shorter.

The effect should resemble crude stop-motion or an early animated GIF rather than smooth movement.

The straws must remain visible throughout the complete animation.

Do not make either straw disappear.

The lower insertion point of each straw should remain permanently fixed where the straw enters the Capri-Sun pouch.

Only the exposed portion of the straw should change length.

The effect should therefore look like the straw is telescoping in and out of the pouch rather than the entire straw physically moving vertically.

Preserve the existing angle and orientation of each straw.

Do not:

- Rotate the straw.
- Bend it.
- Sway it.
- Change its thickness.
- Detach it from the pouch.
- Create a visible gap at the insertion point.

Use discrete animation states instead of smooth interpolation.

For example:

1. Short.
2. Medium.
3. Long.
4. Medium.
5. Short.

Each state should remain visible briefly before snapping directly to the next state.

Do not use easing between states.

The visible stepping is intentional.

The result should look like a low-frame-rate sprite animation, stop-motion sequence, or manually edited GIF.

Because the existing straws are integrated into flattened pouch artwork:

- Isolate each straw as an independent transparent asset.
- Reconstruct the pouch and any background currently hidden beneath the original straw.
- Prevent exposed empty pixels when the straw becomes shorter.
- Prevent duplicated sections of the original straw remaining visible.
- Prevent obvious stretching artefacts.

The straw itself should preserve the visual characteristics of the existing image throughout:

- Width.
- Lighting.
- Colour.
- Outline.
- Compression.
- Image quality.

The left and right straws should not necessarily move in perfect synchronisation.

Use slightly different:

- Start offsets.
- Hold durations.
- Animation phases.

This should make the page feel more chaotically hand-animated.

Keep each animation loop relatively short and repetitive, with deliberately abrupt changes between the predefined straw lengths.

---

## Shared Implementation Requirements

Treat every animated element as an isolated compositing layer where necessary.

Do not destructively animate the complete flattened landing-page image.

Preserve the existing responsive positioning of all elements. Animated overlays must stay aligned with the underlying composition as browser dimensions change.

Use appropriate wrappers, masks, clipping regions, transform origins, and stacking contexts so animations remain spatially attached to the correct part of the page.

Where animation reveals pixels that were previously hidden by a static object, reconstruct those hidden background areas before implementing the animation.

Avoid visual artefacts including:

- Black gaps.
- Transparent holes.
- Rectangular asset boundaries.
- Clipped rotations.
- Duplicated static elements underneath animated copies.
- Misaligned masks.
- Edge halos.
- Unexpected z-index overlap.
- Animated elements drifting relative to the source artwork.

Prioritise inexpensive browser-native animation techniques where practical. CSS transforms, stepped keyframes, transparent image assets, masks, sprite-like state changes, SVG distortion, or lightweight canvas effects are preferable to unnecessarily heavy rendering systems.

The objective is not maximum animation smoothness.

The objective is a coherent collection of deliberately crude, playful, period-appropriate animations that feel like they belong on the same eccentric late-1990s/early-2000s landing page.