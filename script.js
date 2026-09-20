/* =====================================================================
   Galaxia de girasoles  ·  Escena 3D en canvas 2D (sin librerías)
   El contenido (planetas, textos, fotos) se edita en config.js
   ===================================================================== */
(() => {
  'use strict';

  const CFG = window.CONFIG || {};
  const TAU = Math.PI * 2;
  const FONT_SCRIPT = '"Dancing Script","Segoe Script","Brush Script MT",cursive';
  const FONT_TEXT = '"Quicksand",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';

  const canvas = document.getElementById('escena');
  const ctx = canvas.getContext('2d');
  const reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- utilidades ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = rng(20260921);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  function hexToRgb(h) {
    h = String(h).replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(h, a) { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; }
  function mix(h, t) { // t > 0 aclara, t < 0 oscurece
    const [r, g, b] = hexToRgb(h);
    const to = t > 0 ? 255 : 0, k = Math.abs(t);
    const f = v => Math.round(v + (to - v) * k);
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }

  /* =====================================================================
     SPRITES (todo se dibuja por código, no hay imágenes que descargar)
     ===================================================================== */
  function drawSunflower(g, cx, cy, r, rot) {
    const n = 14;
    for (let ring = 0; ring < 2; ring++) {
      const off = ring ? Math.PI / n : 0;
      const len = r * (ring ? 0.84 : 1);
      for (let i = 0; i < n; i++) {
        g.save();
        g.translate(cx, cy);
        g.rotate(rot + off + i * TAU / n);
        const gr = g.createLinearGradient(0, 0, len, 0);
        gr.addColorStop(0, ring ? '#f39a00' : '#ffab00');
        gr.addColorStop(1, ring ? '#ffd93a' : '#ffe766');
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(r * 0.22, 0);
        g.quadraticCurveTo(len * 0.62, -r * 0.34, len, 0);
        g.quadraticCurveTo(len * 0.62, r * 0.34, r * 0.22, 0);
        g.fill();
        g.restore();
      }
    }
    const cg = g.createRadialGradient(cx, cy, 0, cx, cy, r * 0.38);
    cg.addColorStop(0, '#7a4514');
    cg.addColorStop(0.7, '#3f2209');
    cg.addColorStop(1, '#2a1505');
    g.fillStyle = cg;
    g.beginPath(); g.arc(cx, cy, r * 0.38, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,205,100,.55)';
    const golden = 2.399963;
    for (let i = 1; i < 46; i++) {
      const rr = r * 0.36 * Math.sqrt(i / 46), a = i * golden;
      g.beginPath();
      g.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, Math.max(0.6, r * 0.017), 0, TAU);
      g.fill();
    }
  }

  function makeSunflowerSprite(size, rot) {
    const c = mk(size, size), g = c.getContext('2d');
    drawSunflower(g, size / 2, size / 2, size * 0.48, rot);
    return c;
  }

  function makeBouquet(variant) {
    const w = 220, h = 260, c = mk(w, h), g = c.getContext('2d');
    const wraps = [['#f6e6b8', '#cfa25a'], ['#ff9dbb', '#e0457b'], ['#eef3d4', '#9fbf6a']];
    const [w1, w2] = wraps[variant % 3];
    const heads = [
      [[110, 78, 44], [58, 100, 36], [162, 100, 36], [84, 138, 34], [136, 138, 34], [110, 112, 34]],
      [[110, 70, 40], [64, 92, 34], [156, 92, 34], [80, 130, 32], [140, 130, 32], [110, 108, 36], [110, 150, 26]],
      [[110, 82, 46], [60, 112, 38], [160, 112, 38], [110, 132, 32]],
    ][variant % 3];
    g.fillStyle = '#3f9a3a';
    [[52, 132, -1.1], [168, 132, 1.1], [80, 150, -0.6], [140, 150, 0.6], [110, 40, 0]].forEach(([x, y, a]) => {
      g.save(); g.translate(x, y); g.rotate(a);
      g.beginPath(); g.ellipse(0, -14, 12, 32, 0, 0, TAU); g.fill();
      g.restore();
    });
    g.strokeStyle = '#2f7d2a'; g.lineWidth = 5; g.lineCap = 'round';
    heads.forEach(([x, y]) => {
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + 110) / 2, (y + 190) / 2, 110, 196); g.stroke();
    });
    const cg = g.createLinearGradient(60, 160, 160, 255);
    cg.addColorStop(0, w1); cg.addColorStop(1, w2);
    g.fillStyle = cg;
    g.beginPath(); g.moveTo(58, 158); g.lineTo(162, 158); g.lineTo(122, 256); g.lineTo(98, 256); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(84, 162); g.lineTo(104, 252); g.moveTo(136, 162); g.lineTo(118, 252); g.stroke();
    g.fillStyle = '#ffd21f';
    [-1, 1].forEach(sg => {
      g.save(); g.translate(110, 204); g.scale(sg, 1); g.rotate(-0.35);
      g.beginPath(); g.ellipse(18, 0, 20, 10, 0, 0, TAU); g.fill();
      g.restore();
    });
    g.beginPath(); g.arc(110, 204, 8, 0, TAU); g.fill();
    heads.forEach(([x, y, r], i) => drawSunflower(g, x, y, r, i * 0.5 + variant));
    return c;
  }

  function makeTinyFlower(color) {
    const c = mk(64, 64), g = c.getContext('2d');
    g.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const a = i * TAU / 5 - Math.PI / 2;
      g.beginPath(); g.arc(32 + Math.cos(a) * 15, 32 + Math.sin(a) * 15, 13, 0, TAU); g.fill();
    }
    g.fillStyle = '#ff9d00';
    g.beginPath(); g.arc(32, 32, 9, 0, TAU); g.fill();
    return c;
  }

  function makeRing() {
    const c = mk(64, 64), g = c.getContext('2d');
    g.strokeStyle = '#ffd21f'; g.lineWidth = 7;
    g.beginPath(); g.arc(32, 32, 24, 0, TAU); g.stroke();
    return c;
  }

  function makeHalo() {
    const c = mk(128, 128), g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,225,90,.9)');
    gr.addColorStop(0.35, 'rgba(255,190,30,.35)');
    gr.addColorStop(1, 'rgba(255,170,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return c;
  }

  /* ----- Planetas ----- */
  const PR = 0.27; // radio del planeta respecto al ancho del sprite

  function heartPath(g, cx, cy, s) {
    g.beginPath();
    for (let i = 0; i <= 64; i++) {
      const t = i / 64 * TAU;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const px = cx + x * s / 17, py = cy + y * s / 17;
      if (i) g.lineTo(px, py); else g.moveTo(px, py);
    }
    g.closePath();
  }

  function ringArc(g, cx, cy, R, color, front) {
    g.save();
    g.translate(cx, cy); g.rotate(-0.32);
    for (let i = 0; i < 3; i++) {
      const rx = R * (1.5 + i * 0.14), ry = rx * 0.26;
      g.beginPath();
      g.ellipse(0, 0, rx, ry, 0, front ? 0 : Math.PI, front ? Math.PI : TAU);
      g.lineWidth = R * (0.13 - i * 0.03);
      g.strokeStyle = rgba(color, 0.8 - i * 0.18);
      g.stroke();
    }
    g.restore();
  }

  function makePlanetSprite(p, idx) {
    const S = 320, c = mk(S, S), g = c.getContext('2d');
    const cx = S / 2, cy = S / 2, R = S * PR;
    const base = p.color || '#ffc400';
    const st = p.estilo || 'bandas';
    const r = rng(1000 + idx * 77);

    const hg = g.createRadialGradient(cx, cy, R * 0.7, cx, cy, S * 0.5);
    hg.addColorStop(0, rgba(base, 0.38)); hg.addColorStop(1, rgba(base, 0));
    g.fillStyle = hg; g.fillRect(0, 0, S, S);

    if (st === 'girasol') {
      drawSunflower(g, cx, cy, R * 1.35, 0.2);
      return c;
    }

    if (st === 'estrella') {
      const rg = g.createRadialGradient(cx, cy, 0, cx, cy, R * 1.8);
      rg.addColorStop(0, 'rgba(255,255,255,1)');
      rg.addColorStop(0.25, rgba(base, 0.9));
      rg.addColorStop(1, rgba(base, 0));
      g.fillStyle = rg; g.beginPath(); g.arc(cx, cy, R * 1.8, 0, TAU); g.fill();
      g.fillStyle = '#fff';
      g.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8 - Math.PI / 2;
        const len = i % 2 ? R * 0.22 : (i % 4 === 0 ? R * 1.75 : R * 0.85);
        const x = cx + Math.cos(a) * len, y = cy + Math.sin(a) * len;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.closePath(); g.fill();
      g.beginPath(); g.arc(cx, cy, R * 0.3, 0, TAU); g.fill();
      return c;
    }

    if (st === 'anillos') ringArc(g, cx, cy, R, base, false);

    // esfera
    g.save();
    g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip();
    const sg = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R * 1.05);
    sg.addColorStop(0, mix(base, 0.55)); sg.addColorStop(0.55, base); sg.addColorStop(1, mix(base, -0.55));
    g.fillStyle = sg; g.fillRect(cx - R, cy - R, R * 2, R * 2);

    if (st === 'bandas' || st === 'anillos' || st === 'lunas') {
      g.save(); g.translate(cx, cy); g.rotate(-0.18);
      for (let i = 0; i < 10; i++) {
        g.fillStyle = i % 2 ? 'rgba(255,255,255,.16)' : 'rgba(90,42,0,.16)';
        g.fillRect(-R * 1.3, -R * 1.2 + i * R * 0.26, R * 2.6, R * 0.13 + (i % 3) * R * 0.03);
      }
      g.restore();
    } else if (st === 'crateres') {
      for (let i = 0; i < 8; i++) {
        const a = r() * TAU, d = Math.sqrt(r()) * R * 0.8;
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, rr = R * (0.08 + r() * 0.16);
        g.fillStyle = 'rgba(74,44,0,.28)';
        g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = R * 0.02;
        g.beginPath(); g.arc(x - rr * 0.1, y - rr * 0.1, rr, Math.PI * 0.9, Math.PI * 1.9); g.stroke();
      }
    } else if (st === 'corazon') {
      heartPath(g, cx, cy + R * 0.04, R * 1.05);
      g.fillStyle = 'rgba(255,255,255,.38)'; g.fill();
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = R * 0.03; g.stroke();
    } else if (st === 'nebulosa') {
      const c2 = p.color2 || '#b56cff';
      g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 16; i++) {
        const a = r() * TAU, d = r() * R * 0.8, rr = R * (0.3 + r() * 0.4);
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        const col = i % 2 ? c2 : base;
        const bg = g.createRadialGradient(x, y, 0, x, y, rr);
        bg.addColorStop(0, rgba(col, 0.4)); bg.addColorStop(1, rgba(col, 0));
        g.fillStyle = bg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }
      g.globalCompositeOperation = 'source-over';
    } else if (st === 'tierra') {
      const land = p.color2 || '#4cc76a';
      g.fillStyle = land;
      for (let k = 0; k < 6; k++) {
        const a = r() * TAU, d = r() * R * 0.75;
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        for (let j = 0; j < 4; j++) {
          g.beginPath();
          g.arc(x + (r() - 0.5) * R * 0.4, y + (r() - 0.5) * R * 0.3, R * (0.1 + r() * 0.16), 0, TAU);
          g.fill();
        }
      }
      g.fillStyle = 'rgba(255,255,255,.35)';
      for (let k = 0; k < 5; k++) {
        g.beginPath();
        g.ellipse(cx + (r() - 0.5) * R * 1.4, cy + (r() - 0.5) * R * 1.4, R * 0.35, R * 0.06, r() * 0.6, 0, TAU);
        g.fill();
      }
    }

    // sombra y brillo
    const sh = g.createRadialGradient(cx - R * 0.45, cy - R * 0.5, R * 0.2, cx - R * 0.2, cy - R * 0.2, R * 1.35);
    sh.addColorStop(0, 'rgba(255,255,255,.35)');
    sh.addColorStop(0.35, 'rgba(255,255,255,0)');
    sh.addColorStop(0.75, 'rgba(0,0,0,.25)');
    sh.addColorStop(1, 'rgba(0,0,0,.7)');
    g.fillStyle = sh; g.fillRect(cx - R, cy - R, R * 2, R * 2);
    g.restore();

    g.strokeStyle = rgba(base, 0.55); g.lineWidth = R * 0.03;
    g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();

    if (st === 'anillos') ringArc(g, cx, cy, R, base, true);
    if (st === 'lunas') {
      const moon = (x, y, rr) => {
        const mg = g.createRadialGradient(x - rr * 0.3, y - rr * 0.3, rr * 0.1, x, y, rr);
        mg.addColorStop(0, '#fffbe0'); mg.addColorStop(1, '#a88a3a');
        g.fillStyle = mg; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
      };
      moon(cx + R * 1.42, cy - R * 0.72, R * 0.22);
      moon(cx - R * 1.45, cy + R * 0.62, R * 0.14);
    }
    return c;
  }

  /* ----- Tarjeta: franja de flores y foto de reemplazo ----- */
  function makeStrip() {
    const c = mk(780, 200), g = c.getContext('2d'), r = rng(77);
    g.fillStyle = '#ffcf1a'; g.fillRect(0, 0, 780, 200);
    for (let i = 0; i < 26; i++) {
      drawSunflower(g, r() * 780, r() * 200, 34 + r() * 30, r() * TAU);
    }
    return c;
  }

  const placeholders = [];
  function placeholderPhoto(seed) {
    const i = seed % 3;
    if (placeholders[i]) return placeholders[i];
    const c = mk(300, 300), g = c.getContext('2d');
    const bg = g.createLinearGradient(0, 0, 300, 300);
    bg.addColorStop(0, ['#fff2b0', '#ffe0a0', '#fff7c8'][i]); bg.addColorStop(1, '#ffc93c');
    g.fillStyle = bg; g.fillRect(0, 0, 300, 300);
    drawSunflower(g, 150, 150, 112, i * 0.4);
    placeholders[i] = c.toDataURL('image/jpeg', 0.85);
    return placeholders[i];
  }

  /* =====================================================================
     DATOS DE LA ESCENA
     ===================================================================== */
  const cam = { yaw: 0.4, pitch: 0.3, dist: 2200, targetDist: 2200, yawV: 0, pitchV: 0 };
  const DIST_MIN = 1000, DIST_MAX = 4200;
  const AUTO_SPEED = 0.05;
  let W = 0, H = 0, DPR = 1, FOV = 800, bgGrad = null;
  let T = 0, frameNo = 0, gRot = 0;
  let reveal = 0, revealing = false, ease = 0, itemA = 0, dEff = cam.dist;

  /* Galaxia espiral */
  const GR = 700, ARMS = 3, TURNS = 1.2;
  const GCOL = ['#fffbe6', '#fff2a8', '#ffe066', '#ffd11a', '#f5b400', '#d18a00'];
  const gal = (() => {
    const tmp = [];
    const N = window.innerWidth < 700 ? 9000 : 17000;
    for (let i = 0; i < N; i++) {
      const rad = Math.pow(rand(), 1.45) * GR + 6;
      const f = rad / GR;
      const spread = (rand() + rand() + rand() - 1.5) * (0.75 - 0.4 * f);
      const ang = (i % ARMS) * TAU / ARMS + f * TURNS * TAU + spread;
      let b = f < 0.06 ? 0 : f < 0.18 ? 1 : f < 0.4 ? 2 : f < 0.62 ? 3 : f < 0.82 ? 4 : 5;
      if (rand() < 0.15) b = Math.max(0, b - 1);
      tmp.push({
        x: Math.cos(ang) * rad, z: Math.sin(ang) * rad,
        y: (rand() + rand() - 1) * 40 * (1 - f * 0.75),
        s: 0.55 + rand() * 0.9 + (f < 0.2 ? 0.3 : 0), b,
      });
    }
    for (let i = 0; i < 1800; i++) { // bulbo brillante del centro
      const rad = Math.pow(rand(), 2.2) * 150, a = rand() * TAU;
      tmp.push({
        x: Math.cos(a) * rad, z: Math.sin(a) * rad, y: (rand() + rand() - 1) * 48,
        s: 0.6 + rand() * 1.0, b: rand() < 0.5 ? 0 : 1,
      });
    }
    for (let i = 0; i < 900; i++) { // remolino apretado del núcleo
      const t = rand(), a = t * 2.6 * TAU + (i % 2) * Math.PI + (rand() - 0.5) * 0.35;
      const rad = 14 + t * 120;
      tmp.push({ x: Math.cos(a) * rad, z: Math.sin(a) * rad, y: (rand() - 0.5) * 10, s: 0.8 + rand() * 1.0, b: 0 });
    }
    tmp.sort((a, b) => a.b - b.b);
    const n = tmp.length;
    const o = { n, x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n), s: new Float32Array(n), start: [0, 0, 0, 0, 0, 0, n] };
    let cur = -1;
    tmp.forEach((p, i) => {
      o.x[i] = p.x; o.y[i] = p.y; o.z[i] = p.z; o.s[i] = p.s;
      while (cur < p.b) { cur++; o.start[cur] = i; }
    });
    for (let b = cur + 1; b < 6; b++) o.start[b] = n;
    return o;
  })();

  /* Estrellas de fondo (cielo) */
  const SKY_N = 3800;
  const sky = (() => {
    const o = { x: new Float32Array(SKY_N), y: new Float32Array(SKY_N), z: new Float32Array(SKY_N), s: new Float32Array(SKY_N), g: new Uint8Array(SKY_N) };
    for (let i = 0; i < SKY_N; i++) {
      const z = rand() * 2 - 1, a = rand() * TAU, q = Math.sqrt(1 - z * z);
      o.x[i] = q * Math.cos(a); o.y[i] = z; o.z[i] = q * Math.sin(a);
      o.s[i] = 0.8 + rand() * rand() * 2.2; o.g[i] = i % 4;
    }
    return o;
  })();
  const SKY_COL = ['#ffffff', '#fff3b0', '#ffd95a', '#ffe9c2'];

  /* Corazón de polvo de estrellas */
  const HEART_Y = 250, HEART_S = 135;
  const heart = (() => {
    const a = [];
    for (let i = 0; i < 1100; i++) {
      const t = rand() * TAU;
      const x = 16 * Math.pow(Math.sin(t), 3) / 17;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17 + 0.15;
      const inner = rand() < 0.12 ? rand() * 0.8 : 1;
      a.push({
        x: x * inner + (rand() + rand() - 1) * 0.05,
        y: y * inner + (rand() + rand() - 1) * 0.05,
        s: 0.7 + rand() * 1.4, ph: rand() * TAU, sp: 0.6 + rand() * 1.6,
      });
    }
    return a;
  })();

  /* Sprites y entidades flotantes */
  const halo = makeHalo();
  const flowerSprites = [0, 1, 2, 3].map(i => makeSunflowerSprite(128, i * 0.35));
  const bouquetSprites = [0, 1, 2].map(makeBouquet);
  const tinySprites = [makeTinyFlower('#ffd83a'), makeTinyFlower('#fff09a')];
  const ringSprite = makeRing();

  const flowers = [];
  for (let i = 0; i < 18; i++) {
    flowers.push({
      a: rand() * TAU, r: 350 + rand() * 750, y: -150 + rand() * 500,
      sp: (rand() < 0.5 ? -1 : 1) * (0.012 + rand() * 0.02),
      size: 8 + rand() * 7, spin: (rand() - 0.5) * 0.8,
      amp: 8 + rand() * 12, ph: rand() * TAU, spr: Math.floor(rand() * 4),
    });
  }
  const bouquets = [];
  for (let i = 0; i < 9; i++) {
    bouquets.push({
      a: i * TAU / 9 + rand() * 0.6, r: 380 + rand() * 650, y: -120 + rand() * 480,
      sp: (i % 2 ? -1 : 1) * (0.012 + rand() * 0.016),
      size: 19 + rand() * 15, amp: 10 + rand() * 10, ph: rand() * TAU, spr: i % 3,
    });
  }
  bouquets.push({ a: 0, r: 0, y: HEART_Y - 95, sp: 0, size: 38, amp: 8, ph: 0, spr: 0 }); // ramo dentro del corazón
  const words = (CFG.palabras || []).map((text, i) => ({
    text, a: i * 2.399, r: 320 + (i * 97) % 620, y: -180 + ((i * 61) % 10) * 52,
    sp: (i % 2 ? -1 : 1) * 0.012, size: 12 + ((i * 7) % 5) * 2.4, ph: i,
  }));
  const chispas = [];
  for (let i = 0; i < 170; i++) {
    chispas.push({
      tipo: i % 3, a: rand() * TAU, r: 150 + Math.sqrt(rand()) * 1150, y: -500 + rand() * 1100,
      sp: (rand() < 0.5 ? -1 : 1) * (0.008 + rand() * 0.02), size: 4 + rand() * 7,
      spin: (rand() - 0.5) * 1.6, ph: rand() * TAU, tw: 0.8 + rand() * 1.5, spr: i % 2, amp: 10 + rand() * 20,
    });
  }

  const ORBITS = [330, 430, 530, 630, 730, 830, 480, 680];
  const HIT_MUL = { girasol: 1.35, anillos: 1.55, estrella: 1.5, lunas: 1.5 };
  const planets = (CFG.planetas || []).map((p, i, arr) => ({
    cfg: p,
    sprite: makePlanetSprite(p, i),
    a: i * TAU / arr.length + rand() * 0.4,
    r: ORBITS[i % ORBITS.length],
    y: -60 + rand() * 260,
    sp: (i % 2 ? -1 : 1) * (0.03 + rand() * 0.035),
    tam: (p.tam || 55) * 0.78,
    hitMul: HIT_MUL[p.estilo] || 1.15,
    ph: rand() * TAU,
    visto: false,
    scr: { x: 0, y: 0, r: 0, z: 0, f: -1 },
  }));

  const shoots = [];
  let nextShoot = 2;
  const bursts = [];

  /* =====================================================================
     PROYECCIÓN 3D
     ===================================================================== */
  let cY = 1, sY = 0, cP = 1, sP = 0;
  const P = { x: 0, y: 0, k: 0, z: 0 };

  function setTrig() {
    cY = Math.cos(cam.yaw); sY = Math.sin(cam.yaw);
    cP = Math.cos(cam.pitch); sP = Math.sin(cam.pitch);
    dEff = cam.dist * (1 + (1 - ease) * 0.7);
  }
  function proj(x, y, z) {
    const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
    const y2 = y * cP + z1 * sP, z2 = -y * sP + z1 * cP;
    const zc = z2 + dEff;
    if (zc < 30) return false;
    const k = FOV / zc;
    P.x = W / 2 + x1 * k; P.y = H / 2 - y2 * k; P.k = k; P.z = zc;
    return true;
  }
  const fadeOf = z => clamp(1 - (z - dEff + 400) / 2600, 0.3, 1);

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    FOV = Math.min(W, H) * 2.42;
    bgGrad = ctx.createRadialGradient(W / 2, H * 0.52, 0, W / 2, H * 0.52, Math.max(W, H) * 0.75);
    bgGrad.addColorStop(0, '#1d1603'); bgGrad.addColorStop(0.45, '#0b0802'); bgGrad.addColorStop(1, '#030200');
  }

  /* =====================================================================
     ACTUALIZAR
     ===================================================================== */
  let dragging = false;
  let hoverIdx = -1;

  function update(dt) {
    if (revealing && reveal < 1) reveal = Math.min(1, reveal + dt / 4.5);
    ease = 1 - Math.pow(1 - reveal, 3);
    itemA = clamp(ease * 1.5 - 0.3, 0, 1);
    if (!dragging) {
      cam.yaw += cam.yawV + (reduceMotion ? 0 : AUTO_SPEED * dt);
      cam.pitch += cam.pitchV;
      cam.yawV *= 0.94; cam.pitchV *= 0.94;
      if (Math.abs(cam.yawV) < 1e-5) cam.yawV = 0;
      if (Math.abs(cam.pitchV) < 1e-5) cam.pitchV = 0;
    }
    cam.pitch = clamp(cam.pitch, -0.45, 1.4);
    cam.dist += (cam.targetDist - cam.dist) * Math.min(1, dt * 8);
    gRot += dt * 0.06;

    flowers.forEach(e => { e.a += e.sp * dt; });
    bouquets.forEach(e => { e.a += e.sp * dt; });
    words.forEach(e => { e.a += e.sp * dt; });
    chispas.forEach(e => { e.a += e.sp * dt; });
    planets.forEach((e, i) => { if (i !== hoverIdx) e.a += e.sp * dt; });

    nextShoot -= dt;
    if (nextShoot <= 0 && !reduceMotion) {
      shoots.push({ x: Math.random() * W * 0.9 + W * 0.1, y: Math.random() * H * 0.4, vx: -(400 + Math.random() * 300), vy: 160 + Math.random() * 160, t: 0, max: 0.9 });
      nextShoot = 3 + Math.random() * 5;
    }
    for (let i = shoots.length - 1; i >= 0; i--) {
      const s = shoots[i]; s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.t > s.max) shoots.splice(i, 1);
    }
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i]; b.t += dt;
      b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= 0.97; b.vy = b.vy * 0.97 + 40 * dt; b.rot += b.vr * dt;
      if (b.t > b.max) bursts.splice(i, 1);
    }
  }

  /* =====================================================================
     DIBUJAR
     ===================================================================== */
  const items = [];
  function pushItem(kind, x, y, z, d) {
    if (!proj(x, y, z)) return;
    items.push({ kind, sx: P.x, sy: P.y, k: P.k, z: P.z, d });
  }

  function drawSky() {
    const zoom = FOV * 0.9;
    ctx.globalCompositeOperation = 'lighter';
    for (let g = 0; g < 4; g++) {
      ctx.globalAlpha = 0.5 + 0.4 * Math.sin(T * (0.7 + g * 0.35) + g * 1.7);
      ctx.fillStyle = SKY_COL[g];
      for (let i = g; i < SKY_N; i += 4) {
        const x = sky.x[i], y = sky.y[i], z = sky.z[i];
        const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
        const y2 = y * cP + z1 * sP, z2 = -y * sP + z1 * cP;
        if (z2 < 0.08) continue;
        const sx = W / 2 + x1 / z2 * zoom, sy = H / 2 - y2 / z2 * zoom;
        if (sx < 0 || sx > W || sy < 0 || sy > H) continue;
        const s = sky.s[i];
        ctx.fillRect(sx, sy, s, s);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawShoots() {
    shoots.forEach(s => {
      const a = 1 - s.t / s.max;
      const tx = s.x - s.vx * 0.12, ty = s.y - s.vy * 0.12;
      const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
      g.addColorStop(0, `rgba(255,240,180,${a})`); g.addColorStop(1, 'rgba(255,200,60,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty); ctx.stroke();
    });
  }

  function drawGalaxy() {
    const a = cam.yaw + gRot;
    const cYg = Math.cos(a), sYg = Math.sin(a);
    const dist = dEff;
    if (ease <= 0.001) return;

    if (proj(0, 0, 0)) {
      const k = P.k, sq = Math.max(0.2, Math.abs(sP));
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = ease;
      ctx.save();
      ctx.translate(P.x, P.y); ctx.scale(1, sq);
      const disc = ctx.createRadialGradient(0, 0, 0, 0, 0, GR * k * 1.1);
      disc.addColorStop(0, 'rgba(255,200,60,.09)'); disc.addColorStop(1, 'rgba(255,170,0,0)');
      ctx.fillStyle = disc; ctx.beginPath(); ctx.arc(0, 0, GR * k * 1.1, 0, TAU); ctx.fill();
      ctx.restore();
      const cr = 190 * k;
      const core = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, cr);
      core.addColorStop(0, 'rgba(255,245,190,.9)'); core.addColorStop(0.35, 'rgba(255,205,70,.34)'); core.addColorStop(1, 'rgba(255,170,0,0)');
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(P.x, P.y, cr, 0, TAU); ctx.fill();
    }

    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.85 * ease;
    for (let b = 0; b < 6; b++) {
      ctx.fillStyle = GCOL[b];
      for (let i = gal.start[b], end = gal.start[b + 1]; i < end; i++) {
        const x = gal.x[i], y = gal.y[i], z = gal.z[i];
        const x1 = x * cYg + z * sYg, z1 = -x * sYg + z * cYg;
        const y2 = y * cP + z1 * sP, z2 = -y * sP + z1 * cP;
        const zc = z2 + dist;
        if (zc < 30) continue;
        const k = FOV / zc;
        const sx = W / 2 + x1 * k, sy = H / 2 - y2 * k;
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;
        let s = gal.s[i] * k; if (s < 0.9) s = 0.9;
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawHeart(it) {
    const k = it.k, cx = it.sx, cy = it.sy, fade = fadeOf(it.z) * itemA;
    if (fade <= 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    if (proj(0, 0, 0)) { // rayo de luz del núcleo al corazón
      const bx = P.x, by = P.y, top = cy + HEART_S * 0.85 * k;
      const lg = ctx.createLinearGradient(0, by, 0, top);
      lg.addColorStop(0, `rgba(255,240,160,${0.55 * fade})`); lg.addColorStop(1, 'rgba(255,220,90,0)');
      ctx.fillStyle = lg;
      const bw = 9 * k;
      ctx.fillRect(cx - bw / 2, top, bw, by - top);
    }
    const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, HEART_S * 1.3 * k);
    gr.addColorStop(0, 'rgba(255,200,60,.16)'); gr.addColorStop(1, 'rgba(255,170,0,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, HEART_S * 1.3 * k, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ffe25a';
    for (let i = 0; i < heart.length; i++) {
      const h = heart[i];
      const tw = 0.55 + 0.45 * Math.sin(T * h.sp + h.ph);
      ctx.globalAlpha = (0.4 + 0.6 * tw) * fade;
      const px = cx + (h.x * HEART_S + Math.sin(T * 0.7 + h.ph) * 2.2) * k;
      const py = cy - (h.y * HEART_S + Math.cos(T * 0.6 + h.ph) * 2.2) * k;
      const s = Math.max(1, h.s * k * 1.1);
      ctx.fillRect(px - s / 2, py - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    const fs = 30 * k;
    if (fs > 8 && CFG.corazon) {
      ctx.font = `700 ${fs}px ${FONT_SCRIPT}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255,200,40,.95)'; ctx.shadowBlur = 14;
      ctx.fillStyle = `rgba(255,255,255,${0.95 * fade})`;
      ctx.fillText(CFG.corazon, cx, cy - HEART_S * 0.06 * k);
      ctx.shadowBlur = 0;
    }
  }

  function drawItem(it) {
    const e = it.d, k = it.k;
    const near = clamp((it.z - 80) / 500, 0, 1);
    const fade = it.kind === 'chispa' ? near : fadeOf(it.z) * itemA * near;
    if (fade <= 0.01) return;
    switch (it.kind) {
      case 'flor': {
        const w = e.size * k / 0.48;
        if (w < 3) return;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.3 * fade;
        ctx.drawImage(halo, it.sx - w * 0.95, it.sy - w * 0.95, w * 1.9, w * 1.9);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = fade;
        ctx.save();
        ctx.translate(it.sx, it.sy); ctx.rotate(T * e.spin);
        ctx.drawImage(flowerSprites[e.spr], -w / 2, -w / 2, w, w);
        ctx.restore();
        ctx.globalAlpha = 1;
        break;
      }
      case 'ramo': {
        const w = e.size * 2 * k, h = w * 260 / 220;
        if (w < 5) return;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.22 * fade;
        ctx.drawImage(halo, it.sx - w, it.sy - w * 0.9, w * 2, w * 2);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = fade;
        ctx.save();
        ctx.translate(it.sx, it.sy); ctx.rotate(Math.sin(T * 0.7 + e.ph) * 0.14);
        ctx.drawImage(bouquetSprites[e.spr], -w / 2, -h / 2, w, h);
        ctx.restore();
        ctx.globalAlpha = 1;
        break;
      }
      case 'palabra': {
        const fs = e.size * k;
        if (fs < 7) return;
        ctx.font = `700 ${fs}px ${FONT_TEXT}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255,190,20,.65)'; ctx.shadowBlur = 6;
        ctx.fillStyle = `rgba(255,252,238,${0.95 * fade})`;
        ctx.fillText(e.text, it.sx, it.sy);
        ctx.shadowBlur = 0;
        break;
      }
      case 'chispa': {
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(T * e.tw + e.ph));
        const w = e.size * 2 * k;
        if (w < 2) return;
        ctx.globalAlpha = tw * fade;
        if (e.tipo === 2) {
          ctx.fillStyle = '#fff';
          const q = Math.max(1.5, w * 0.4);
          ctx.fillRect(it.sx - q / 2, it.sy - q / 2, q, q);
        } else if (e.tipo === 1) {
          ctx.drawImage(ringSprite, it.sx - w / 2, it.sy - w / 2, w * 0.8, w * 0.8);
        } else {
          ctx.save();
          ctx.translate(it.sx, it.sy); ctx.rotate(T * e.spin);
          ctx.drawImage(tinySprites[e.spr], -w / 2, -w / 2, w, w);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        break;
      }
      case 'corazon':
        drawHeart(it);
        break;
      case 'planeta': {
        const w = e.tam * k / PR;
        const hit = Math.max(e.tam * k * e.hitMul, 24);
        e.scr.x = it.sx; e.scr.y = it.sy; e.scr.r = hit; e.scr.z = it.z; e.scr.f = frameNo;
        ctx.globalAlpha = fade;
        ctx.drawImage(e.sprite, it.sx - w / 2, it.sy - w / 2, w, w);
        if (!e.visto) {
          const pulse = 0.5 + 0.5 * Math.sin(T * 2.2 + e.ph);
          ctx.strokeStyle = rgba(e.cfg.color || '#ffc400', (0.25 + 0.45 * pulse) * fade);
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(it.sx, it.sy, hit * (1 + 0.07 * pulse), 0, TAU); ctx.stroke();
        }
        if (hit >= 16) {
          const on = e.hov;
          ctx.font = `700 ${on ? 15 : 13}px ${FONT_TEXT}`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillStyle = `rgba(255,246,214,${(on ? 1 : 0.7) * fade})`;
          ctx.fillText(e.cfg.nombre || '', it.sx, it.sy + hit + 6);
        }
        ctx.globalAlpha = 1;
        break;
      }
    }
  }

  function drawBursts() {
    bursts.forEach(b => {
      const a = 1 - b.t / b.max;
      ctx.globalAlpha = a;
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.rot);
      ctx.drawImage(flowerSprites[b.spr], -b.s / 2, -b.s / 2, b.s, b.s);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  function drawHaze() {
    const a = 0.11 * (0.35 + 0.65 * ease);
    const blobs = [[0.1, 0.15, 0.5], [0.92, 0.08, 0.45]];
    ctx.globalCompositeOperation = 'lighter';
    blobs.forEach(([bx, by, br], i) => {
      const x = W * bx + Math.sin(cam.yaw * 0.6 + i * 2) * W * 0.12;
      const y = H * by + Math.cos(cam.yaw * 0.4 + i) * H * 0.05;
      const r = Math.max(W, H) * br;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(190,178,10,${a})`); g.addColorStop(1, 'rgba(190,178,10,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  function render() {
    frameNo++;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    setTrig();
    drawHaze();
    drawSky();
    drawShoots();

    items.length = 0;
    const bob = (e, amp) => e.y + Math.sin(T * 0.8 + e.ph) * amp;
    flowers.forEach(e => pushItem('flor', Math.cos(e.a) * e.r, bob(e, e.amp), Math.sin(e.a) * e.r, e));
    bouquets.forEach(e => pushItem('ramo', Math.cos(e.a) * e.r, bob(e, e.amp), Math.sin(e.a) * e.r, e));
    chispas.forEach(e => pushItem('chispa', Math.cos(e.a) * e.r, e.y + Math.sin(T * 0.5 + e.ph) * e.amp, Math.sin(e.a) * e.r, e));
    words.forEach(e => pushItem('palabra', Math.cos(e.a) * e.r, e.y + Math.sin(T * 0.6 + e.ph) * 6, Math.sin(e.a) * e.r, e));
    planets.forEach((e, i) => { e.hov = i === hoverIdx; pushItem('planeta', Math.cos(e.a) * e.r, bob(e, 10), Math.sin(e.a) * e.r, e); });
    pushItem('corazon', 0, HEART_Y + Math.sin(T * 0.9) * 6, 0, null);

    items.sort((a, b) => b.z - a.z);
    let i = 0;
    for (; i < items.length && items[i].z >= dEff; i++) drawItem(items[i]);
    drawGalaxy();
    for (; i < items.length; i++) drawItem(items[i]);
    drawBursts();
  }

  /* =====================================================================
     INTERACCIÓN
     ===================================================================== */
  const ptrs = new Map();
  let down = null, pinch = null;
  const pista = document.getElementById('pista');

  function ocultarPista() { pista.classList.add('oculta'); }

  function pick(x, y) {
    let best = -1, bz = Infinity;
    planets.forEach((e, i) => {
      if (e.scr.f !== frameNo) return;
      const dx = x - e.scr.x, dy = y - e.scr.y;
      if (dx * dx + dy * dy <= e.scr.r * e.scr.r && e.scr.z < bz) { best = i; bz = e.scr.z; }
    });
    return best;
  }

  function burst(x, y) {
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * TAU, v = 60 + Math.random() * 180;
      bursts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, t: 0, max: 0.9 + Math.random() * 0.7,
        s: 14 + Math.random() * 16, rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 6,
        spr: Math.floor(Math.random() * 4),
      });
    }
  }

  canvas.addEventListener('pointerdown', e => {
    if (modalAbierto) return;
    canvas.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragging = true;
    canvas.classList.add('arrastrando');
    cam.yawV = 0; cam.pitchV = 0;
    if (ptrs.size === 1) {
      down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    } else if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      pinch = { start: Math.hypot(a.x - b.x, a.y - b.y) || 1, d0: cam.targetDist };
      down = null;
    }
    ocultarPista();
  });

  canvas.addEventListener('pointermove', e => {
    const p = ptrs.get(e.pointerId);
    if (!p) {
      if (e.pointerType === 'mouse' && !modalAbierto) {
        hoverIdx = pick(e.clientX, e.clientY);
        canvas.classList.toggle('sobre-planeta', hoverIdx >= 0);
      }
      return;
    }
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2 && pinch) {
      const [a, b] = [...ptrs.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      cam.targetDist = clamp(pinch.d0 * pinch.start / d, DIST_MIN, DIST_MAX);
      return;
    }
    if (down) down.moved += Math.abs(dx) + Math.abs(dy);
    cam.yaw -= dx * 0.006; cam.pitch += dy * 0.005;
    cam.yawV = -dx * 0.006; cam.pitchV = dy * 0.005;
  });

  function soltar(e, esToque) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (ptrs.size === 0) {
      dragging = false;
      canvas.classList.remove('arrastrando');
      pinch = null;
      if (esToque && down && down.moved < 10 && performance.now() - down.t < 600) tocar(e.clientX, e.clientY);
      down = null;
    } else if (ptrs.size === 1) {
      pinch = null;
    }
  }
  canvas.addEventListener('pointerup', e => soltar(e, true));
  canvas.addEventListener('pointercancel', e => soltar(e, false));
  canvas.addEventListener('pointerleave', e => {
    if (e.pointerType === 'mouse' && !ptrs.size) { hoverIdx = -1; canvas.classList.remove('sobre-planeta'); }
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    cam.targetDist = clamp(cam.targetDist * Math.exp(e.deltaY * 0.001), DIST_MIN, DIST_MAX);
    ocultarPista();
  }, { passive: false });

  function tocar(x, y) {
    const i = pick(x, y);
    if (i >= 0) abrirPlaneta(i); else burst(x, y);
  }

  /* =====================================================================
     TARJETA DEL PLANETA
     ===================================================================== */
  const $ = id => document.getElementById(id);
  const modal = $('modal'), mTitulo = $('m-titulo'), mMensaje = $('m-mensaje'),
        mDest = $('m-destacado'), mFotos = $('m-fotos'), mCerrar = $('m-cerrar');
  let modalAbierto = false;
  const ROTS = ['-6deg', '4deg', '-3deg'];

  function abrirPlaneta(i) {
    const e = planets[i], p = e.cfg;
    e.visto = true;
    mTitulo.textContent = p.nombre || '';
    mMensaje.textContent = p.mensaje || '';
    mDest.textContent = p.destacado || '';
    mFotos.innerHTML = '';
    const fotos = (p.fotos || []).slice(0, 3);
    mFotos.hidden = fotos.length === 0;
    mFotos.classList.toggle('una', fotos.length === 1);
    fotos.forEach((f, j) => {
      const fig = document.createElement('figure');
      fig.className = 'polaroid';
      fig.style.setProperty('--rot', ROTS[j % 3]);
      const img = new Image();
      img.alt = f.pie || p.nombre || 'Foto';
      img.decoding = 'async';
      img.onerror = () => { img.onerror = null; img.src = placeholderPhoto(i + j); };
      img.src = f.src || placeholderPhoto(i + j);
      fig.appendChild(img);
      if (f.pie) {
        const cap = document.createElement('figcaption');
        cap.textContent = f.pie;
        fig.appendChild(cap);
      }
      mFotos.appendChild(fig);
    });
    modal.hidden = false;
    modalAbierto = true;
    hoverIdx = -1;
    canvas.classList.remove('sobre-planeta');
    modal.querySelector('.tarjeta').scrollTop = 0;
    mCerrar.focus({ preventScroll: true });
  }

  function cerrarModal() {
    if (!modalAbierto) return;
    modal.hidden = true;
    modalAbierto = false;
  }
  mCerrar.addEventListener('click', cerrarModal);
  $('modal-fondo').addEventListener('click', cerrarModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

  /* =====================================================================
     ENTRADA, MÚSICA E INICIO
     ===================================================================== */
  function iniciarUI() {
    const intro = CFG.intro || {};
    $('intro-titulo').textContent = intro.titulo || '';
    $('intro-sub').textContent = intro.subtitulo || '';
    $('intro-boton').textContent = intro.boton || 'Entrar';
    $('cabecera').textContent = CFG.titulo || '';

    const franja = makeStrip().toDataURL('image/png');
    document.querySelectorAll('.flores').forEach(el => { el.style.backgroundImage = `url(${franja})`; });

    let audio = null;
    const btnSonido = $('sonido');
    if (CFG.musica) {
      audio = new Audio(CFG.musica);
      audio.loop = true; audio.volume = 0.6;
      btnSonido.hidden = false;
      btnSonido.addEventListener('click', () => {
        if (audio.paused) { audio.play().catch(() => {}); btnSonido.classList.remove('apagado'); }
        else { audio.pause(); btnSonido.classList.add('apagado'); }
      });
    }

    const introEl = $('intro');
    $('intro-boton').addEventListener('click', () => {
      introEl.classList.add('saliendo');
      document.body.classList.add('dentro');
      revealing = true;
      setTimeout(() => introEl.remove(), 1100);
      if (audio) audio.play().catch(() => btnSonido.classList.add('apagado'));
      setTimeout(ocultarPista, 9000);
    });
  }

  /* ---------- arranque ---------- */
  window.addEventListener('resize', resize);
  resize();
  if (W < 700) { cam.dist = cam.targetDist = 2100; cam.pitch = 0.7; } // en celular se ve toda la galaxia
  iniciarUI();

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now; T += dt;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
