// ============================================
// WORLD CLOCK — Helper Format Waktu
// ============================================

const FORMAT_KEY = 'wc_time_format'; // '24' | '12'

/**
 * Ambil preferensi format dari localStorage.
 * Default: '24'
 */
function getTimeFormat() {
  const saved = localStorage.getItem(FORMAT_KEY);
  return saved === '12' ? '12' : '24';
}

/**
 * Simpan preferensi format.
 */
function setTimeFormat(fmt) {
  localStorage.setItem(FORMAT_KEY, fmt === '12' ? '12' : '24');
}

/**
 * Format waktu untuk ditampilkan.
 * Return: { main: "20:15" atau "08:15", suffix: " PM" atau "", seconds: "32" }
 *   - main: jam:menit
 *   - suffix: " AM" / " PM" (kosong kalau 24 jam)
 *   - seconds: string detik
 */
function formatTimeDisplay(date, tz) {
  const fmt = getTimeFormat();

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const map = {};
  for (const p of parts) map[p.type] = p.value;

  let hh = parseInt(map.hour, 10) % 24;
  const mm = map.minute;
  const ss = map.second;

  if (fmt === '12') {
    const suffix = hh >= 12 ? 'PM' : 'AM';
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    return {
      main: `${String(h12).padStart(2, '0')}:${mm}`,
      suffix: ` ${suffix}`,
      seconds: ss,
      isPM: hh >= 12,
    };
  }

  // 24 jam
  return {
    main: `${String(hh).padStart(2, '0')}:${mm}`,
    suffix: '',
    seconds: ss,
    isPM: hh >= 12,
  };
}

/**
 * Render HTML untuk jam (dengan span styling).
 * output: "20:15<span class=sec>:32</span>"
 * atau:  "08:15<span class=sec>:32</span> <span class=ampm>PM</span>"
 */
function renderClockHTML(date, tz) {
  const t = formatTimeDisplay(date, tz);
  const suffixHTML = t.suffix
    ? `<span class="ampm">${t.suffix.trim()}</span>`
    : '';
  return `<span class="hm">${t.main}</span><span class="seconds">:${t.seconds}</span>${suffixHTML}`;
}

/**
 * Versi plain text (buat title/label).
 */
function formatTimeText(date, tz) {
  const t = formatTimeDisplay(date, tz);
  return `${t.main}:${t.seconds}${t.suffix}`;
}
