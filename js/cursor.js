// ============================================
// WORLD CLOCK — Cursor Trail
// ============================================

let cursorTrailEnabled = false;
let lastTrailTime = 0;

function initCursorTrail() {
  const saved = localStorage.getItem('wc_cursor_trail');
  cursorTrailEnabled = saved === '1';

  const btn = document.getElementById('cursorToggle');
  if (btn) {
    updateCursorButton();
    btn.addEventListener('click', () => {
      cursorTrailEnabled = !cursorTrailEnabled;
      localStorage.setItem('wc_cursor_trail', cursorTrailEnabled ? '1' : '0');
      updateCursorButton();
      playSound('toggle');
    });
  }

  document.addEventListener('mousemove', onMouseMove);
}

function updateCursorButton() {
  const btn = document.getElementById('cursorToggle');
  if (!btn) return;
  btn.textContent = cursorTrailEnabled ? '✨' : '💫';
  btn.title = cursorTrailEnabled ? 'Cursor trail: On' : 'Cursor trail: Off';
}

function onMouseMove(e) {
  if (!cursorTrailEnabled) return;
  if (prefersReducedMotion && prefersReducedMotion()) return;

  const now = performance.now();
  if (now - lastTrailTime < 40) return; // throttle
  lastTrailTime = now;

  const dot = document.createElement('div');
  dot.className = 'cursor-trail-dot';
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';

  // Warna random dari aksen
  const hue = Math.random() * 60 + 20; // 20-80 (warm range)
  dot.style.background = `hsl(${hue}, 70%, 60%)`;

  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 800);
}
