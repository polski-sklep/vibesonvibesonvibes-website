/* All coordinates belong to the original 1672 × 940 artwork. The canvas scales
   with #hero-stage, so sprites and their masks share exactly the same geometry. */
(() => {
  "use strict";
  const W = 1672, H = 940, TAU = Math.PI * 2;
  const baseURL = new URL("../", document.currentScript.src);
  const canvas = document.getElementById("hero-animation");
  const stage = document.getElementById("hero-stage");
  const ctx = canvas.getContext("2d");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const images = {};
  let ready = false, active = true, frame = 0, last = 0, elapsed = 0;

  const files = {
    original: "images/new/vibesvibesvibes-website-click-for-vibes.webp",
    clean: "images/hero-animation/clean-plate.webp",
    lockup: "images/hero-animation/screen-lockup.webp",
    straw: "images/hero-animation/straw.webp",
    plane: "images/hero-animation/plane-trail.webp",
    phone: "images/hero-animation/phone-source.svg",
    missingno: "images/hero-animation/missingno-source.svg",
    skyline: "images/hero-animation/skyline-source.svg",
    pouchMask: "images/hero-animation/pouch-mask-source.svg"
  };

  function makeCanvas(width, height) {
    const result = document.createElement("canvas");
    result.width = width; result.height = height;
    return result;
  }
  function polygon(context, points) {
    context.beginPath();
    points.forEach(([x, y], i) => i ? context.lineTo(x, y) : context.moveTo(x, y));
    context.closePath();
  }

  // The inset follows the actual glass edge, never the beige monitor bezel.
  const screen = [[607, 188], [1064, 188], [1051, 515], [619, 515]];
  // Traced against the CURRENT hero, whose foreground differs from the older
  // SVG. The pouch edge and computer/keyboard edge bound each crystal.
  const leftCrystalWindow = [[374,590],[553,590],[553,700],[519,724],
    [519,897],[497,897],[497,940],[418,940],[479,899],[374,598]];
  const crystalWindows = [leftCrystalWindow, leftCrystalWindow.map(([x,y]) => [W-x,y])];
  const strawRegions = [
    [[46, 401], [70, 389], [131, 535], [107, 545]],
    [[1608, 377], [1630, 386], [1564, 526], [1540, 515]]
  ];
  const backdrop = makeCanvas(W, H);
  // Work near the source resolution, then downsample the complete wave once.
  // This avoids jagged 2px steps and fractional seams around the lettering.
  const detail = 3, lockupWidth = 360, lockupHeight = 300;
  const lockup = makeCanvas(lockupWidth * detail, lockupHeight * detail);
  const wavingLockup = makeCanvas(lockup.width, lockup.height);
  const cloudStrip = makeCanvas(914, 327);
  const planeSprite = makeCanvas(250, 8);
  const aircraft = makeCanvas(48, 36);
  // The pouches keep their original positions. These windows expose only the
  // side background, with both phones and MissingNo drawn as mirrored pairs.
  const sideWindows = [
    [[0,0],[310,0],[310,560],[0,560]],
    [[1360,0],[1672,0],[1672,560],[1360,560]]
  ];
  const sideBackground = makeCanvas(W, H);
  const phones = makeCanvas(W, H);
  const pouchMask = makeCanvas(W, H);
  const sideComposite = makeCanvas(W, H);
  let lastSideSlide = null;
  // Centre the visible artwork, excluding its transparent wave padding.
  const lockupOrigin = {
    x: screen.reduce((sum, point) => sum + point[0], 0) / screen.length - (16 + 328 / 2),
    y: screen.reduce((sum, point) => sum + point[1], 0) / screen.length - (14 + 267 / 2)
  };

  function prepareLayers() {
    const pouch = pouchMask.getContext("2d");
    pouch.drawImage(images.pouchMask, 0, 0, W, H);
    // The source pouch contains its old straw. That straw is already replaced
    // by our independently animated shaft, so it must not cut holes in phones.
    pouch.globalCompositeOperation = "destination-out";
    for (const region of strawRegions) {
      polygon(pouch, region); pouch.fill();
    }
    // Keep the pouch beneath each shaft opaque; only the exposed old tip is
    // removed from the mask. These inset polygons stay inside the foil edges.
    pouch.globalCompositeOperation = "source-over";
    for (const region of [
      [[0,480],[232,356],[310,510],[310,940],[0,940]],
      [[1407,355],[1672,476],[1672,940],[1360,940],[1360,456]]
    ]) { polygon(pouch, region); pouch.fill(); }
    const sides = sideBackground.getContext("2d");
    const phoneContext = phones.getContext("2d");
    for (const region of sideWindows) {
      sides.save(); polygon(sides, region); sides.clip();
      sides.fillStyle = "#16699d"; sides.fillRect(0, 0, W, H);
      sides.drawImage(images.skyline, 0, 0, W, H); sides.restore();
      phoneContext.save(); polygon(phoneContext, region); phoneContext.clip();
      phoneContext.drawImage(images.phone, 267, -170, W, H);
      phoneContext.translate(W, 0); phoneContext.scale(-1, 1);
      phoneContext.drawImage(images.phone, 267, -170, W, H);
      phoneContext.restore();
    }
    const b = backdrop.getContext("2d");
    b.drawImage(images.original, 0, 0, W, H);
    // Reconstructed plates include every refracted fringe of the old crystals.
    // Feather only their outer background edges so there is no rectangular
    // boundary; the animated geometry uses the foreground masks below.
    for (const [left,top,width,height] of [[370,589,185,351],[1114,589,195,351]]) {
      const patch=makeCanvas(width,height), p=patch.getContext("2d");
      p.drawImage(images.clean,left,top,width,height,0,0,width,height);
      p.globalCompositeOperation="destination-in";
      const horizontal=p.createLinearGradient(0,0,width,0);
      horizontal.addColorStop(0,"transparent"); horizontal.addColorStop(.06,"black");
      horizontal.addColorStop(.94,"black"); horizontal.addColorStop(1,"transparent");
      p.fillStyle=horizontal; p.fillRect(0,0,width,height);
      const vertical=p.createLinearGradient(0,0,0,height);
      vertical.addColorStop(0,"transparent"); vertical.addColorStop(.035,"black");
      vertical.addColorStop(1,"black");
      p.fillStyle=vertical; p.fillRect(0,0,width,height);
      b.drawImage(patch,left,top);
    }
    b.save(); polygon(b, screen); b.clip();
    b.drawImage(images.clean, 0, 0, W, H); b.restore();
    for (const region of strawRegions) {
      b.save(); polygon(b, region); b.clip();
      b.drawImage(images.clean, 0, 0, W, H); b.restore();
    }
    // The generated transparent lockup has padding. Crop that padding, then
    // restore the original logo/text footprint with generous wave margins.
    const logo = lockup.getContext("2d");
    logo.imageSmoothingQuality = "high";
    logo.drawImage(images.lockup, 190, 128, 1030, 875,
      16 * detail, 14 * detail, 328 * detail, 267 * detail);
    // Use only cloud/sky pixels inside the glass, excluding its sloping bezel.
    // A mirrored repeat joins continuously, without a crossfade or hard reset.
    const clouds = cloudStrip.getContext("2d");
    clouds.drawImage(images.clean, 620, 189, 430, 325, 0, 0, 457, 327);
    clouds.save(); clouds.translate(914, 0); clouds.scale(-1, 1);
    clouds.drawImage(cloudStrip, 0, 0, 457, 327, 0, 0, 457, 327);
    clouds.restore();
    const a = aircraft.getContext("2d");
    a.imageSmoothingQuality = "high";
    a.drawImage(images.plane, 140, 340, 62.08, 46.56, 0, 0, 48, 36);
    a.globalCompositeOperation = "source-atop";
    a.fillStyle = "#bdd0df"; a.fillRect(0, 0, 48, 36);
    const p = planeSprite.getContext("2d");
    p.drawImage(images.plane, 140, 340, 1940, 35, 0, 0, 250, 4.51);
    p.globalCompositeOperation = "source-atop";
    const pink = p.createLinearGradient(0,0,250,0);
    pink.addColorStop(0,"#bdd0df"); pink.addColorStop(.025,"#d8a0bd");
    pink.addColorStop(1,"#c995b5");
    p.fillStyle=pink; p.fillRect(0,0,250,8);
  }

  function drawSides(seconds) {
    // One entrance per page load: 1.2s ease-out, with no bounce or replay when
    // returning from the app. Reduced motion uses the final position directly.
    const progress = Math.min(1, seconds / 1.2);
    const slide = 220 * Math.pow(1 - progress, 3);
    if (lastSideSlide === slide) { ctx.drawImage(sideComposite, 0, 0); return; }
    lastSideSlide = slide;
    const sides = sideComposite.getContext("2d");
    sides.clearRect(0, 0, W, H);
    sides.drawImage(sideBackground, 0, 0);
    for (const region of sideWindows) {
      sides.save(); polygon(sides, region); sides.clip();
      sides.drawImage(images.missingno, slide, 0, W, H);
      sides.translate(W, 0); sides.scale(-1, 1);
      sides.drawImage(images.missingno, slide, 0, W, H);
      sides.restore();
    }
    sides.drawImage(phones, 0, 0);
    sides.save(); sides.globalCompositeOperation = "destination-out";
    sides.drawImage(pouchMask, 0, 0); sides.restore();
    ctx.drawImage(sideComposite, 0, 0);
  }

  function drawClouds(seconds) {
    const offset = (seconds * 1.2) % cloudStrip.width;
    ctx.save(); polygon(ctx, screen); ctx.clip();
    ctx.drawImage(cloudStrip, 607 + offset, 188);
    ctx.drawImage(cloudStrip, 607 + offset - cloudStrip.width, 188);
    ctx.restore();
  }

  function drawWave(seconds) {
    ctx.save(); polygon(ctx, screen); ctx.clip();
    // Column strips carry a travelling wave, rather than moving the lockup as
    // a rigid plate. A 5px displacement keeps type readable. 48 exact loop frames.
    const phase = (Math.floor(seconds * 12) % 48) / 48 * TAU;
    const waveContext = wavingLockup.getContext("2d");
    waveContext.clearRect(0, 0, wavingLockup.width, wavingLockup.height);
    for (let x = 0; x < lockup.width; x++) {
      const wave = Math.sin(x / lockup.width * TAU * 1.25 - phase);
      waveContext.drawImage(lockup, x, 0, 1, lockup.height,
        x, wave * 5 * detail, 1, lockup.height);
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(wavingLockup, lockupOrigin.x, lockupOrigin.y, lockupWidth, lockupHeight);
    ctx.restore();
  }

  function drawCrystal(x, y, radius, height, phase) {
    // A closed eight-sided double pyramid, with an equatorial bevel and
    // internal facets. All vertices rotate around the same vertical axis.
    const sides = 8, vertices = [[0, -height / 2, 0]], faces = [];
    const rings = [[-15, radius * .92], [0, radius], [20, radius * .86]];
    for (const [ry, rr] of rings) {
      for (let i = 0; i < sides; i++) {
        const a = i / sides * TAU + phase;
        vertices.push([Math.cos(a) * rr, ry, Math.sin(a) * rr]);
      }
    }
    const bottom = vertices.push([0, height / 2, 0]) - 1;
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      faces.push([0, 1 + i, 1 + next]);
      for (let ring = 0; ring < 2; ring++) {
        const a = 1 + ring * sides, b = a + sides;
        faces.push([a + i, b + i, b + next, a + next]);
      }
      faces.push([17 + i, bottom, 17 + next]);
    }
    const project = v => [x + v[0], y + v[1]];
    const polygons = faces.map((indices, index) => {
      const points = indices.map(i => vertices[i]);
      const a = points[0], b = points[1], c = points[2];
      const u = b.map((v, i) => v - a[i]), v = c.map((v, i) => v - a[i]);
      let normal = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
      const norm = Math.hypot(...normal);
      normal = normal.map(n => n / norm);
      const light = Math.max(0, normal[0] * -.55 + normal[1] * -.45 + normal[2] * .7);
      return { points, index, light, z: points.reduce((sum, p) => sum + p[2], 0) / points.length };
    }).sort((a, b) => a.z - b.z);

    ctx.save();
    for (const { points, light, index } of polygons) {
      polygon(ctx, points.map(project));
      const upper = points.some(p => p[1] < -height * .3);
      // Unequal facet tint makes the complete rotation readable, instead of
      // an indistinguishable octagon repeating every eighth of a turn.
      const facetTint = Math.sin(index * 1.71) * 9;
      const hue = 151 - light * 78 + facetTint;
      const gradient = ctx.createLinearGradient(x-radius, y-height/2, x+radius, y+height/2);
      gradient.addColorStop(0, `hsl(${hue} 91% ${25 + light * 41}%)`);
      gradient.addColorStop(.43, `hsl(${hue + 8} 96% ${16 + light * 32}%)`);
      gradient.addColorStop(.53, `hsl(${hue - 12} 96% ${27 + light * 32}%)`);
      gradient.addColorStop(.59, `hsl(${hue + 8} 96% ${19 + light * 34}%)`);
      gradient.addColorStop(1, `hsl(${hue - 5} 92% ${24 + light * 36}%)`);
      ctx.fillStyle = gradient; ctx.fill();
      ctx.strokeStyle = `rgba(185, 242, 68, ${.12 + light * .3})`;
      ctx.lineWidth = .65; ctx.stroke();
      if (points.length === 3) {
        const p = points.map(project);
        const centre = [x, y + (upper ? -8 : 15)];
        polygon(ctx, p.map((point, i) => i ? [point[0]*.73+centre[0]*.27, point[1]*.73+centre[1]*.27] : point));
        ctx.fillStyle = index % 2 ? "rgba(214,255,48,.22)" : "rgba(0,64,54,.28)";
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function strawLength(seconds, right) {
    const holds = right ? [1020, 1180] : [940, 1140];
    const lengths = [62, 143];
    let ms = (seconds * 1300 + (right ? 730 : 0)) % holds.reduce((a, b) => a + b, 0);
    for (let i = 0; i < holds.length; i++) {
      if (ms < holds[i]) return lengths[i];
      ms -= holds[i];
    }
    return lengths[0];
  }
  function drawStraw(x, y, angle, length) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    // Constant 13px width and fixed source scale. Crop shaft length; never
    // stretch the full sprite. The tip snaps, while the insertion stays put.
    const scale = 13 / 59, cap = 7;
    ctx.drawImage(images.straw, 514, 38, 59, cap / scale, -6.5, -length, 13, cap);
    ctx.drawImage(images.straw, 514, 90, 59, (length - cap) / scale,
      -6.5, -length + cap, 13, length - cap + 2);
    ctx.restore();
    ctx.save(); ctx.translate(x, y + 1); ctx.rotate(angle);
    ctx.beginPath(); ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI);
    ctx.strokeStyle = "rgba(7,40,57,.8)"; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.restore();
  }

  function drawPlane(seconds) {
    // Same diagonal line, now beginning behind the Walkie Talkie's roof.
    // Continue beyond the top until the entire trail exits, then idle 24s.
    // 12.4 artwork px/s, with an ~12px aircraft and the same
    // restrained single pink trail. Direction and size stay constant in flight.
    const position = seconds % 84;
    if (position >= 60) return;
    const angle = Math.atan2(400, 565);
    const travel = position * 1040 / 84;
    const distance = 300 + travel;
    const x = 1536 - Math.cos(angle) * distance;
    const y = 400 - Math.sin(angle) * distance;
    ctx.save();
    // Follow the right phone and pouch edges, then the Walkie Talkie's roof
    // and the monitor. Both aircraft and trail pass behind this foreground.
    polygon(ctx, [[552,0],[1408,0],[1412,90],[1423,160],[1445,235],
      [1480,312],[1538,398],[1395,346],[1360,455],[1307,455],
      [1329,317],[1333,230],[1292,214],[1237,190],[1178,183],
      [1129,196],[1116,253],[1116,134],[552,134]]);
    ctx.clip(); ctx.globalAlpha = .72;
    ctx.translate(x, y); ctx.rotate(angle);
    // Enlarge only the aircraft, not the trail. Align their centre lines.
    // Leave a trail only along the new flight, never back at the old junction.
    const trailLength = Math.min(242, Math.max(0, travel - 8));
    if (trailLength) ctx.drawImage(planeSprite, 8, 0, trailLength, 8,
      8, -2.2, trailLength, 8);
    ctx.drawImage(aircraft, -5, -4.4, 18, 13.5);
    ctx.restore();
  }

  function render(seconds = elapsed) {
    if (!ready) return;
    ctx.clearRect(0, 0, W, H);
    if (motion.matches) {
      ctx.drawImage(images.original, 0, 0, W, H);
      drawSides(1.2);
      ctx.save(); polygon(ctx, screen); ctx.clip();
      ctx.drawImage(images.clean, 0, 0, W, H);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(lockup, lockupOrigin.x, lockupOrigin.y, lockupWidth, lockupHeight);
      ctx.restore();
      return;
    }
    ctx.drawImage(backdrop, 0, 0);
    drawSides(seconds);
    drawPlane(seconds);
    // Reduced frame rate, fixed centres, exact integer frame counts per loop.
    ctx.save(); polygon(ctx, crystalWindows[0]); ctx.clip();
    drawCrystal(462, 794, 79, 372, (Math.floor(seconds * 12) % 96) / 96 * TAU);
    ctx.restore();
    ctx.save(); polygon(ctx, crystalWindows[1]); ctx.clip();
    drawCrystal(1212, 794, 78, 372, ((Math.floor(seconds * 12) + 24) % 120) / 120 * TAU);
    ctx.restore();
    drawClouds(seconds);
    drawWave(seconds);
    drawStraw(114, 527, -24 * Math.PI / 180, strawLength(seconds, false));
    drawStraw(1550, 513, 27 * Math.PI / 180, strawLength(seconds, true));
  }

  function tick(now) {
    if (!active || document.hidden || motion.matches || !ready) { frame = 0; return; }
    if (!last) last = now;
    if (now - last >= 1000 / 12) {
      elapsed += (now - last) / 1000;
      last = now;
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
    if (ready && active && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
  }
  const loading = Promise.all(Object.entries(files).map(async ([name, path]) => {
    const image = new Image(); image.decoding = "async";
    image.src = new URL(path, baseURL).href;
    await image.decode(); images[name] = image;
  })).then(() => {
    if (!ctx) return;
    prepareLayers(); ready = true; render(0);
    stage.classList.add("hero-animated"); schedule();
  }).catch(error => {
    // Atomic fallback: preserve the complete original composition if any
    // optional animation asset fails, rather than revealing half a scene.
    console.warn("Hero animation unavailable; retaining static artwork.", error);
  });

  window.heroAnimation = {
    ready: loading,
    setActive(value) { active = value; schedule(); },
    // Deterministic visual inspection without a second timer or test assets.
    renderAt(seconds) { active = false; schedule(); render(Math.max(0, seconds)); }
  };
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("change", () => { render(); schedule(); });
})();
