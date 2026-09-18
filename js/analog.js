// ============================================
// WORLD CLOCK — Analog Clock (Mini + Presisi)
// ============================================

function getClockAngles(date, tz) {
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

  return {
    hour: (h + m / 60) * 30,
    minute: (m + s / 60) * 6,
    second: s * 6,
  };
}

function createAnalogSVG(size = 40) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', size >= 100 ? 'analog-svg analog-large' : 'analog-svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);

  const isLarge = size >= 100;
  const tickClass = isLarge ? 'analog-tick-large' : 'analog-tick';

  let ticksHTML = '';
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const isMajor = i % 3 === 0;
    const len = isLarge ? (isMajor ? 6 : 3) : (isMajor ? 4 : 2);
    const width = isLarge ? (isMajor ? 2 : 1) : (isMajor ? 1.2 : 0.8);
    const r1 = 42;
    const r2 = 42 - len;

    const rad = (angle - 90) * Math.PI / 180;
    const x1 = 50 + r1 * Math.cos(rad);
    const y1 = 50 + r1 * Math.sin(rad);
    const x2 = 50 + r2 * Math.cos(rad);
    const y2 = 50 + r2 * Math.sin(rad);

    ticksHTML += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" class="${tickClass} ${isMajor ? 'major' : ''}" stroke-width="${width}" />`;
  }

  let numbersHTML = '';
  if (isLarge) {
    const nums = [
      { n: '12', angle: 0 },
      { n: '3', angle: 90 },
      { n: '6', angle: 180 },
      { n: '9', angle: 270 },
    ];
    nums.forEach(({ n, angle }) => {
      const rad = (angle - 90) * Math.PI / 180;
      const r = 33;
      const x = 50 + r * Math.cos(rad);
      const y = 50 + r * Math.sin(rad);
      numbersHTML += `<text x="${x}" y="${y}" class="analog-number" text-anchor="middle" dominant-baseline="central">${n}</text>`;
    });
  }

  // ⚠️ PENTING: jarum dipendekin biar ujungnya di DALAM bulatan
  svg.innerHTML = `
    <circle cx="50" cy="50" r="46" class="analog-face-outer" />
    <circle cx="50" cy="50" r="40" class="analog-face-inner" />
    ${ticksHTML}
    ${numbersHTML}
    <line x1="50" y1="50" x2="50" y2="30" class="analog-hour" stroke-width="${isLarge ? 4 : 2.5}" stroke-linecap="round" />
    <line x1="50" y1="50" x2="50" y2="22" class="analog-minute" stroke-width="${isLarge ? 3 : 1.8}" stroke-linecap="round" />
    <line x1="50" y1="52" x2="50" y2="18" class="analog-second" stroke-width="${isLarge ? 1.5 : 0.8}" stroke-linecap="round" />
    <circle cx="50" cy="50" r="${isLarge ? 3 : 2}" class="analog-center" />
    <circle cx="50" cy="50" r="${isLarge ? 1.5 : 1}" class="analog-center-inner" />
  `;

  return svg;
}

function updateAnalogSVG(svg, date, tz) {
  const { hour, minute, second } = getClockAngles(date, tz);

  const hourHand = svg.querySelector('.analog-hour');
  const minHand = svg.querySelector('.analog-minute');
  const secHand = svg.querySelector('.analog-second');

  if (hourHand) hourHand.setAttribute('transform', `rotate(${hour} 50 50)`);
  if (minHand) minHand.setAttribute('transform', `rotate(${minute} 50 50)`);
  if (secHand) secHand.setAttribute('transform', `rotate(${second} 50 50)`);
}

function renderAnalogClock(container, date, tz) {
  if (!container) return;
  let svg = container.querySelector('svg');
  if (!svg) {
    svg = createAnalogSVG(40);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  updateAnalogSVG(svg, date, tz);
}

function renderAnalogLarge(container, date, tz) {
  if (!container) return;
  let svg = container.querySelector('svg');
  if (!svg) {
    svg = createAnalogSVG(180);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  updateAnalogSVG(svg, date, tz);
}
