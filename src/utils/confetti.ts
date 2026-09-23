// Lightweight, zero-dependency HTML5 Canvas Confetti engine
// Styled with Apple minimal celebratory tones

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  decay: number;
  shape: 'rect' | 'circle';
}

const APPLE_COLORS = [
  '#0071E3', // Apple Blue
  '#2997FF', // Light Blue
  '#34C759', // Green
  '#FFD60A', // Gold
  '#AF52DE', // Purple
  '#FF375F', // Pink
  '#E5E5EA', // Silver
];

export function fireExerciseConfetti() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const particles: Particle[] = [];
  const particleCount = 80;

  // Burst from left and right lower thirds
  const origins = [
    { x: width * 0.25, y: height * 0.75, angleMin: -80, angleMax: -40 },
    { x: width * 0.75, y: height * 0.75, angleMin: -140, angleMax: -100 },
  ];

  origins.forEach(origin => {
    for (let i = 0; i < particleCount / 2; i++) {
      const angle = (origin.angleMin + Math.random() * (origin.angleMax - origin.angleMin)) * (Math.PI / 180);
      const speed = 8 + Math.random() * 12;
      particles.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: APPLE_COLORS[Math.floor(Math.random() * APPLE_COLORS.length)],
        size: 5 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        decay: 0.015 + Math.random() * 0.015,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }
  });

  const gravity = 0.28;
  const drag = 0.98;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0.01) continue;

      activeCount++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (activeCount > 0) {
      requestAnimationFrame(render);
    } else {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  requestAnimationFrame(render);
}

export function fireSessionCompleteConfetti() {
  if (typeof window === 'undefined') return;

  // Grand celebration: multiple staggered bursts
  fireExerciseConfetti();
  setTimeout(() => fireExerciseConfetti(), 400);
}
