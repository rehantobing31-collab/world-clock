// ============================================
// WORLD CLOCK — Analog Mini Clock
// ============================================

/**
 * Bikin SVG analog clock kecil untuk kota tertentu.
 */
function renderAnalogClock(container, date, tz) {
  if (!container) return;

  // Ambil komponen waktu di timezone tsb
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const map = {};
  for (const p of parts) map[p.type] = p.value;

  const h = parseInt(map.hour, 10) % 12;
  const m = parseInt(map.minute, 10);
  const s = parseInt(map.second, 10);

  // Sudut
  const hourAngle = (h + m / 60) * 30;
  const minuteAngle = (m + s / 60) * 6;
  const secondAngle = s * 6;

  // Kalau SVG belum ada, bikin dulu
  let svg = container.querySelector('svg');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('class', 'analog-svg');
    svg.innerHTML = `
      <circle cx="20" cy="20" r="18" class="analog-face" />
      <line x1="20" y1="20" x2="20" y2="10" class="analog-hour" />
      <line x1="20" y1="20" x2="20" y2="7" class="analog-minute" />
      <line x1="20" y1="20" x2="20" y2="5" class="analog-second" />
      <circle cx="20" cy="20" r="1.5" class="analog-center" />
    `;
    container.appendChild(svg);
  }

  // Update jarum
  const hourHand = svg.querySelector('.analog-hour');
  const minHand = svg.querySelector('.analog-minute');
  const secHand = svg.querySelector('.analog-second');

  if (hourHand) hourHand.setAttribute('transform', `rotate(${hourAngle} 20 20)`);
  if (minHand) minHand.setAttribute('transform', `rotate(${minuteAngle} 20 20)`);
  if (secHand) secHand.setAttribute('transform', `rotate(${secondAngle} 20 20)`);
}

/**
 * Init analog clock di kartu pinned (kalau ada elemen .analog-slot).
 */
function initAnalogClocks() {
  // Kosong — nanti dipanggil dari app.js updateClocks
}
