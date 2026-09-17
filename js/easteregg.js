// ============================================
// WORLD CLOCK — Konami Code Easter Egg
// ============================================

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

let konamiIndex = 0;

function initKonamiCode() {
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = KONAMI_CODE[konamiIndex];

    if (key === expected) {
      konamiIndex++;
      if (konamiIndex === KONAMI_CODE.length) {
        konamiIndex = 0;
        triggerEasterEgg();
      }
    } else {
      // Reset, tapi cek kalau key = elemen pertama
      konamiIndex = key === KONAMI_CODE[0] ? 1 : 0;
    }
  });
}

function triggerEasterEgg() {
  playSound('success');
  showToast('🎉 Konami Code aktif! Selamat, kamu menemukan easter egg!', 'success');

  // Efek: confetti / particle burst
  confettiBurst();

  // Efek: shake semua kartu
  document.querySelectorAll('.pinned-card, .city-card').forEach((el, i) => {
    setTimeout(() => {
      el.style.animation = 'konamiShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
      setTimeout(() => el.style.animation = '', 500);
    }, i * 30);
  });

  // Efek: ganti tema otomatis (cycle)
  const themes = ['midnight', 'ocean', 'forest', 'nord', 'sepia', 'light'];
  let idx = 0;
  const interval = setInterval(() => {
    if (idx >= themes.length) {
      clearInterval(interval);
      return;
    }
    if (typeof applyTheme === 'function') applyTheme(themes[idx]);
    idx++;
  }, 300);
}

function confettiBurst() {
  const colors = ['#e0a86a', '#7ec8b8', '#c8b878', '#b48ead', '#88c0d0'];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = '50%';
    el.style.top = '40%';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const velocity = 200 + Math.random() * 400;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 200;

    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.style.animationDelay = (Math.random() * 0.2) + 's';

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

/**
 * Toast notification simple.
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--bg-elev);
    color: var(--text);
    padding: 14px 24px;
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    font-size: 0.9rem;
    font-weight: 600;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 90vw;
    text-align: center;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
