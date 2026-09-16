// ============================================
// WORLD CLOCK — Logic Timezone & Time Travel
// ============================================

// State override global
let timeOverride = null; // { offsetMs: number, label: string }

/**
 * Mendapatkan "waktu sekarang" — kalau override aktif, pakai waktu virtual.
 */
function getNow() {
  const real = Date.now();
  if (timeOverride) return new Date(real + timeOverride.offsetMs);
  return new Date();
}

/**
 * Format waktu digital HH:MM:SS untuk timezone tertentu.
 * Return: { hour, minute, second }
 */
function formatTime(date, tz) {
  const fmt = (opts) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date);
  const hms = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const [h, m, s] = hms.split(':');
  return { hour: h, minute: m, second: s };
}

/**
 * Format tanggal lengkap (mis: "Sen, 17 Sep 2026")
 */
function formatDate(date, tz) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: tz,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Mendapatkan offset timezone (menit) untuk tanggal tertentu.
 * Positif = di timur UTC.
 */
function getTimezoneOffsetMinutes(date, tz) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const map = {};
  for (const p of parts) map[p.type] = p.value;
  const asUTC = Date.UTC(
    +map.year, +map.month - 1, +map.day,
    +map.hour % 24, +map.minute, +map.second
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

/**
 * Format offset jadi string seperti "UTC+07:00"
 */
function formatOffsetLabel(date, tz) {
  const off = getTimezoneOffsetMinutes(date, tz);
  const sign = off >= 0 ? '+' : '-';
  const abs = Math.abs(off);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

/**
 * Parse input time travel: "20:15 WIB" / "14:30 UTC" / "09:00 Tokyo"
 * Return: Date (virtual target) atau null jika gagal.
 */
function parseTimeTravelInput(input) {
  if (!input || !input.trim()) return null;
  const raw = input.trim();

  // Regex: jam:menit[:detik] [zona]
  const m = raw.match(/^(\d{1,2})[:.](\d{2})(?:[:](\d{2}))?\s*(.*)$/i);
  if (!m) return null;

  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const ss = m[3] ? parseInt(m[3], 10) : 0;
  const zoneRaw = (m[4] || '').trim().toLowerCase();

  if (hh > 23 || mm > 59 || ss > 59) return null;

  // Tentukan target timezone
  let targetTz = null;

  if (!zoneRaw) {
    // Default: pakai timezone browser
    targetTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } else if (TZ_ALIASES[zoneRaw]) {
    targetTz = TZ_ALIASES[zoneRaw];
  } else {
    const key = zoneRaw.replace(/\s+/g, '').toLowerCase();
    if (CITY_NAME_TO_TZ[key]) {
      targetTz = CITY_NAME_TO_TZ[key];
    } else {
      // Coba sebagai IANA timezone langsung (mis: "Asia/Jakarta")
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: zoneRaw });
        targetTz = zoneRaw;
      } catch {
        return null;
      }
    }
  }

  // Hitung "instant" yang merepresentasikan jam:menit di targetTz pada TANGGAL HARI INI
  const now = new Date();
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: targetTz,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now); // "2026-09-17"
  const [y, mo, d] = dateParts.split('-').map(Number);

  // Iterasi 2x untuk akurasi DST transition
  let targetInstant = Date.UTC(y, mo - 1, d, hh, mm, ss);
  for (let i = 0; i < 2; i++) {
    const off = getTimezoneOffsetMinutes(new Date(targetInstant), targetTz);
    targetInstant = Date.UTC(y, mo - 1, d, hh, mm, ss) - off * 60000;
  }

  return new Date(targetInstant);
}

/**
 * Terapkan time override berdasarkan input user.
 * Return: { ok: true, target } atau { ok: false, error }
 */
function applyTimeOverride(input) {
  const virtualTarget = parseTimeTravelInput(input);
  if (!virtualTarget) return { ok: false, error: 'Format tidak valid' };
  const offsetMs = virtualTarget.getTime() - Date.now();
  timeOverride = { offsetMs, label: input.trim() };
  return { ok: true, target: virtualTarget };
}

/**
 * Reset time override → kembali ke waktu normal.
 */
function clearTimeOverride() {
  timeOverride = null;
}

/**
 * Cek apakah time override sedang aktif.
 */
function isTimeOverrideActive() {
  return timeOverride !== null;
}
