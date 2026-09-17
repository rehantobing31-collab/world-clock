// ============================================
// WORLD CLOCK — Aurora Background + Starfield
// ============================================

let starfieldCanvas = null;
let starfieldCtx = null;
let stars = [];
let starAnimFrame = null;

function initAurora() {
  // Aurora hanya muncul di dark themes (via CSS)
  // Starfield pakai canvas
  createStarfield();
  window.addEventListener('resize', debounce(resizeStarfield, 200));
}

function createStarfield() {
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.7;
  `;
  document.body.appendChild(canvas);

  starfieldCanvas = canvas;
  starfieldCtx = canvas.getContext('2d');

  resizeStarfield();
  generateStars();
  animateStars();
}

function resizeStarfield() {
  if (!starfieldCanvas) return;
  starfieldCanvas.width = window.innerWidth;
  starfieldCanvas.height = window.innerHeight;
  generateStars();
}

function generateStars() {
  const w = starfieldCanvas.width;
  const h = starfieldCanvas.height;
  const count = Math.floor((w * h) / 8000); // density

  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function animateStars() {
  if (!starfieldCtx) return;

  const w = starfieldCanvas.width;
  const h = starfieldCanvas.height;

  starfieldCtx.clearRect(0, 0, w, h);

  const theme = document.documentElement.getAttribute('data-theme');
  const isDark = ['midnight', 'ocean', 'forest', 'nord'].includes(theme);

  if (isDark) {
    stars.forEach(star => {
      star.phase += star.twinkleSpeed;
      const twinkle = 0.5 + Math.sin(star.phase) * 0.5;
      const alpha = star.alpha * twinkle;

      // Warna star: tergantung theme
      let color = '255, 255, 255';
      if (theme === 'ocean') color = '180, 230, 255';
      else if (theme === 'forest') color = '220, 240, 200';
      else if (theme === 'nord') color = '220, 230, 245';

      starfieldCtx.beginPath();
      starfieldCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starfieldCtx.fillStyle = `rgba(${color}, ${alpha})`;
      starfieldCtx.fill();
    });
  }

  starAnimFrame = requestAnimationFrame(animateStars);
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
