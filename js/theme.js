// ============================================
// WORLD CLOCK — Theme Switcher + Format Toggle + Anti-Copy
// ============================================

const THEMES = ['midnight', 'light', 'ocean', 'forest', 'nord', 'sepia'];
const THEME_ICONS = {
  midnight: '🌙', light: '☀️', ocean: '🌊',
  forest: '🌲', nord: '❄️', sepia: '📜',
};

function initTheme() {
  let saved = localStorage.getItem('wc_theme');
  if (!saved || !THEMES.includes(saved)) saved = 'midnight';
  applyTheme(saved);

  const btn = document.getElementById('themeBtn');
  const menu = document.getElementById('themeMenu');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  });

  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      applyTheme(opt.dataset.theme);
      menu.hidden = true;
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) {
      menu.hidden = true;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menu.hidden = true;
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('wc_theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = THEME_ICONS[theme] || '🌙';
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
}

// ============================================
// FORMAT TOGGLE (12 / 24 jam)
// ============================================
function initFormatToggle() {
  const btn = document.getElementById('formatToggle');
  if (!btn) return;

  updateFormatButton();

  btn.addEventListener('click', () => {
    const curr = getTimeFormat();
    setTimeFormat(curr === '24' ? '12' : '24');
    updateFormatButton();

    // Refresh semua tampilan jam
    if (typeof updateClocks === 'function') updateClocks();
  });
}

function updateFormatButton() {
  const btn = document.getElementById('formatToggle');
  if (!btn) return;
  const fmt = getTimeFormat();
  btn.textContent = fmt === '12' ? '12h' : '24h';
  btn.title = `Format: ${fmt === '12' ? '12 jam (AM/PM)' : '24 jam'} — klik untuk ganti`;
}

// ============================================
// ANTI-COPY
// ============================================
function initAntiCopy() {
  document.body.classList.add('no-select');

  document.addEventListener('contextmenu', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault(); return false;
    }
    if (e.ctrlKey && e.key.toUpperCase() === 'U') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.key.toUpperCase() === 'S') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.key.toUpperCase() === 'A') {
      const tag = document.activeElement.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); return false; }
    }
    if (e.ctrlKey && ['C', 'X'].includes(e.key.toUpperCase())) {
      const tag = document.activeElement.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); return false; }
    }
  });

  document.addEventListener('dragstart', (e) => {
    const tag = document.activeElement.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();
  });

  document.addEventListener('copy', (e) => {
    const tag = document.activeElement.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      e.clipboardData.setData('text/plain', '© World Clock');
    }
  });
}
