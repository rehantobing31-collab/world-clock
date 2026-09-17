// ============================================
// WORLD CLOCK — Elegant Motion Helpers
// ============================================

/**
 * Cek apakah user prefer reduce motion.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Flip animation untuk elemen jam.
 * Elemen harus punya attribute data-flip="<nilai>".
 * Kalau nilai berubah, animasi flip dijalankan.
 */
function animateFlip(element, newValue) {
  if (!element) return;
  const oldValue = element.dataset.flip;

  if (oldValue === newValue) return; // nggak berubah
  element.dataset.flip = newValue;
  element.textContent = newValue;

  if (prefersReducedMotion()) return;

  // Restart animasi
  element.classList.remove('flip-anim');
  void element.offsetWidth; // force reflow
  element.classList.add('flip-anim');
}

/**
 * Ripple effect di tombol/kartu.
 * Panggil di event 'click'.
 */
function attachRipple(element) {
  if (!element || element.dataset.rippleBound) return;
  element.dataset.rippleBound = '1';

  element.addEventListener('click', (e) => {
    if (prefersReducedMotion()) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    // Pastikan parent position relative
    const style = getComputedStyle(element);
    if (style.position === 'static') element.style.position = 'relative';
    if (style.overflow === 'visible') element.style.overflow = 'hidden';

    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
}

/**
 * Stagger fade-in untuk list elemen (kartu).
 * Setiap child dapet delay kecil biar muncul berurutan.
 */
function staggerFadeIn(container, selector = '.pinned-card, .city-card') {
  if (!container) return;
  const items = container.querySelectorAll(selector);

  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.style.transitionDelay = Math.min(i * 30, 400) + 'ms';

    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    // Clear inline style setelah animasi selesai (biar hover normal)
    setTimeout(() => {
      el.style.transition = '';
      el.style.transitionDelay = '';
      el.style.opacity = '';
      el.style.transform = '';
    }, 600 + Math.min(i * 30, 400));
  });
}

/**
 * Bounce animation untuk icon (theme toggle, dll.).
 */
function bounceElement(el) {
  if (!el || prefersReducedMotion()) return;
  el.classList.remove('bounce-anim');
  void el.offsetWidth;
  el.classList.add('bounce-anim');
}

/**
 * Smooth scroll ke elemen.
 */
function smoothScrollTo(el) {
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
}
