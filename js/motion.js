// ============================================
// WORLD CLOCK — Elegant Motion Helpers v2 (Maximal)
// ============================================

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function animateFlip(element, newValue) {
  if (!element) return;
  const oldValue = element.dataset.flip;

  if (oldValue === newValue) return;
  element.dataset.flip = newValue;
  element.textContent = newValue;

  if (prefersReducedMotion()) return;

  element.classList.remove('flip-anim');
  void element.offsetWidth;
  element.classList.add('flip-anim');
}

function attachRipple(element) {
  if (!element || element.dataset.rippleBound) return;
  element.dataset.rippleBound = '1';

  element.addEventListener('click', (e) => {
    if (prefersReducedMotion()) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    const style = getComputedStyle(element);
    if (style.position === 'static') element.style.position = 'relative';
    if (style.overflow === 'visible') element.style.overflow = 'hidden';

    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 800);
  });
}

function staggerFadeIn(container, selector = '.pinned-card, .city-card') {
  if (!container) return;
  if (prefersReducedMotion()) return;

  const items = container.querySelectorAll(selector);

  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px) scale(0.98)';
    el.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transitionDelay = Math.min(i * 50, 600) + 'ms';

    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    });

    setTimeout(() => {
      el.style.transition = '';
      el.style.transitionDelay = '';
      el.style.opacity = '';
      el.style.transform = '';
    }, 800 + Math.min(i * 50, 600));
  });
}

function bounceElement(el) {
  if (!el || prefersReducedMotion()) return;
  el.classList.remove('bounce-anim');
  void el.offsetWidth;
  el.classList.add('bounce-anim');
}

function smoothScrollTo(el) {
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
}

/**
 * Pulse glow di elemen (buat jam utama).
 */
function pulseGlow(el) {
  if (!el || prefersReducedMotion()) return;
  el.classList.add('glow-pulse');
}
