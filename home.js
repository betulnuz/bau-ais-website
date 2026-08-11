// Neural network canvas
const canvas = document.getElementById('neuralCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, nodes, raf, dpr;
  const cfg = { density: 0.00006, maxDist: 140, speed: 0.22 };
  const COL = '77,255,170';

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(35, Math.floor(w * h * cfg.density));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * cfg.speed,
      vy: (Math.random() - 0.5) * cfg.speed,
      r: Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < cfg.maxDist) {
          ctx.strokeStyle = `rgba(${COL},${(1 - d / cfg.maxDist) * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
      g.addColorStop(0, `rgba(${COL},0.8)`); g.addColorStop(1, `rgba(${COL},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${COL},1)`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize(); draw();
}

// Stat counters
const stats = document.querySelectorAll('.stat-num[data-target]');
const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    // Strip any non-digit chars (e.g. "500+" → 500)
    const target = parseInt(String(el.dataset.target).replace(/\D/g, ''), 10);
    if (!target || isNaN(target)) { countObs.unobserve(el); return; }
    const sup = el.querySelector('sup')?.outerHTML || '';
    const start = performance.now();
    const dur = 1400;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.innerHTML = Math.round(ease(p) * target) + sup;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
stats.forEach(s => countObs.observe(s));
