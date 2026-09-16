// ============================================
// WORLD CLOCK — Theme Switcher
// ============================================

const THEMES = ['midnight', 'light', 'nord', 'solarized', 'sepia'];
const THEME_ICONS = {
  midnight: '🌙',
  light: '☀️',
  nord: '❄️',
  solarized: '🌅',
  sepia: '📜',
};

function initTheme() {
  // Load dari localStorage
  let saved = localStorage.getItem('wc_theme');
  if (!saved || !THEMES.includes(saved)) saved = 'midnight';
  applyTheme(saved);

  // Setup event listener
  const btn = document.getElementById('themeBtn');
  const menu = document.getElementById('themeMenu');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  });

  // Klik opsi tema
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.dataset.theme;
      applyTheme(theme);
      menu.hidden = true;
    });
  });

  // Klik di luar → tutup menu
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) {
      menu.hidden = true;
    }
  });

  // ESC → tutup menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menu.hidden = true;
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('wc_theme', theme);

  // Update icon
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = THEME_ICONS[theme] || '🌙';

  // Update active state di menu
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
}
