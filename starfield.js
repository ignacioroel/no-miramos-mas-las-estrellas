// Cielo de estrellas animado (canvas de fondo).
// - Estrellas en 3 capas de profundidad que titilan.
// - Paralaje suave con el mouse y con el scroll.
// - Estrellas fugaces cada tanto.
// - El cielo se va apagando al bajar: "no miramos más las estrellas".
// Respeta "reducir movimiento" del sistema (queda un cielo quieto) y se oculta en tema claro.

const LAYERS = [
  { depth: 0.2, size: [0.4, 0.9], alpha: [0.25, 0.6] },  // lejanas
  { depth: 0.5, size: [0.7, 1.3], alpha: [0.4, 0.8] },
  { depth: 1.0, size: [1.1, 1.9], alpha: [0.6, 1.0] },   // cercanas
];
const STARS_PER_PX = 1 / 4500;   // densidad
const MIN_SKY = 0.12;            // brillo mínimo del cielo al final de la página

const rand = (min, max) => min + Math.random() * (max - min);

// Brillo del cielo según cuánto bajaste (1 arriba, MIN_SKY abajo).
export function skyFade(scrollY, viewportH, min = MIN_SKY) {
  if (viewportH <= 0) return 1;
  const t = Math.min(Math.max(scrollY / (viewportH * 1.1), 0), 1);
  return 1 - t * (1 - min);
}

// Brillo de una estrella que titila (entre 0.35 y 1 de su alpha base).
export function twinkle(time, speed, phase) {
  return 0.675 + 0.325 * Math.sin(time * speed + phase);
}

export function initStarfield(doc = document, win = window) {
  const canvas = doc.createElement('canvas');
  canvas.className = 'starfield';
  canvas.setAttribute('aria-hidden', 'true');
  doc.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1;
  let stars = [];
  let shooting = [];
  let nextShot = performance.now() + rand(2500, 6000);
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function makeStars() {
    const count = Math.round(w * h * STARS_PER_PX);
    stars = Array.from({ length: count }, () => {
      const layer = LAYERS[Math.floor(Math.random() * LAYERS.length)];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(...layer.size),
        a: rand(...layer.alpha),
        depth: layer.depth,
        speed: rand(0.6, 2.2),
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() < 0.18,   // algunas estrellas levemente doradas
      };
    });
  }

  function resize() {
    dpr = Math.min(win.devicePixelRatio || 1, 2);
    w = win.innerWidth;
    h = win.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
  }

  function spawnShootingStar() {
    const angle = rand(Math.PI * 0.12, Math.PI * 0.3);   // en diagonal hacia abajo
    const fromLeft = Math.random() < 0.5;
    shooting.push({
      x: fromLeft ? rand(-0.1 * w, 0.4 * w) : rand(0.6 * w, 1.1 * w),
      y: rand(-0.05 * h, 0.35 * h),
      vx: Math.cos(angle) * (fromLeft ? 1 : -1),
      vy: Math.sin(angle),
      speed: rand(9, 15),
      len: rand(90, 180),
      life: 0,
      maxLife: rand(45, 75),
    });
  }

  function drawStar(s, time, fade, ox, oy) {
    const alpha = s.a * (reduceMotion ? 0.8 : twinkle(time, s.speed, s.phase)) * fade;
    // posición con paralaje, envuelta para que nunca queden huecos
    let x = (s.x + ox * s.depth) % w; if (x < 0) x += w;
    let y = (s.y + oy * s.depth) % h; if (y < 0) y += h;
    ctx.fillStyle = s.warm ? `rgba(226,201,143,${alpha})` : `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
    // halo en las más brillantes
    if (s.r > 1.5) {
      ctx.fillStyle = s.warm ? `rgba(226,201,143,${alpha * 0.12})` : `rgba(200,215,255,${alpha * 0.12})`;
      ctx.beginPath();
      ctx.arc(x, y, s.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawShooting(fade) {
    shooting = shooting.filter((m) => m.life < m.maxLife);
    for (const m of shooting) {
      m.life++;
      m.x += m.vx * m.speed;
      m.y += m.vy * m.speed;
      const p = m.life / m.maxLife;
      const alpha = Math.sin(p * Math.PI) * fade;   // aparece y se desvanece
      const tailX = m.x - m.vx * m.len;
      const tailY = m.y - m.vy * m.len;
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grad.addColorStop(0.3, `rgba(226,201,143,${alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(226,201,143,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }
  }

  function frame(now) {
    const isLight = doc.documentElement.getAttribute('data-theme') === 'light';
    ctx.clearRect(0, 0, w, h);

    if (!isLight) {
      const time = now / 1000;
      const fade = skyFade(win.scrollY, h);
      // el mouse se sigue con suavidad
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const ox = -mouse.x * 25;
      const oy = -mouse.y * 25 - win.scrollY * 0.15;

      for (const s of stars) drawStar(s, time, fade, ox, oy);

      if (!reduceMotion) {
        if (now > nextShot) {
          spawnShootingStar();
          nextShot = now + rand(3500, 9000);
        }
        drawShooting(fade);
      }
    }

    if (!reduceMotion) win.requestAnimationFrame(frame);
  }

  resize();
  win.addEventListener('resize', resize);
  win.addEventListener('mousemove', (e) => {
    mouse.tx = e.clientX / w - 0.5;
    mouse.ty = e.clientY / h - 0.5;
  });

  if (reduceMotion) {
    // cielo quieto: se redibuja solo cuando cambia algo
    const redraw = () => frame(0);
    win.addEventListener('scroll', redraw, { passive: true });
    win.addEventListener('resize', redraw);
    doc.getElementById('theme-toggle')?.addEventListener('click', () => setTimeout(redraw));
    redraw();
  } else {
    win.requestAnimationFrame(frame);
  }
}
