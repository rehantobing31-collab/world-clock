// ============================================
// WORLD CLOCK — Logic Timezone & Time Travel
// ============================================

let timeOverride = null;

function getNow() {
  const real = Date.now();
  if (timeOverride) return new Date(real + timeOverride.offsetMs);
  return new Date();
}

function formatTime(date, tz) {
  const fmt = (opts) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date);
  const hms = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const [h, m, s] = hms.split(':');
  return { hour: h, minute: m, second: s };
}

function formatDate(date, tz) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: tz,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

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

function formatOffsetLabel(date, tz) {
  const off = getTimezoneOffsetMinutes(date, tz);
  const sign = off >= 0 ? '+' : '-';
  const abs = Math.abs(off);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

function parseTimeTravelInput(input) {
  if (!input || !input.trim()) return null;
  const raw = input.trim();

  const m = raw.match(/^(\d{1,2})[:.](\d{2})(?:[:](\d{2}))?\s*(.*)$/i);
  if (!m) return null;

  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const ss = m[3] ? parseInt(m[3], 10) : 0;
  const zoneRaw = (m[4] || '').trim().toLowerCase();

  if (hh > 23 || mm > 59 || ss > 59) return null;

  let targetTz = null;

  if (!zoneRaw) {
    targetTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } else if (TZ_ALIASES[zoneRaw]) {
    targetTz = TZ_ALIASES[zoneRaw];
  } else {
    const key = zoneRaw.replace(/\s+/g, '').toLowerCase();
    if (CITY_NAME_TO_TZ[key]) {
      targetTz = CITY_NAME_TO_TZ[key];
    } else {
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: zoneRaw });
        targetTz = zoneRaw;
      } catch {
        return null;
      }
    }
  }

  const now = new Date();
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: targetTz,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const [y, mo, d] = dateParts.split('-').map(Number);

  let targetInstant = Date.UTC(y, mo - 1, d, hh, mm, ss);
  for (let i = 0; i < 2; i++) {
    const off = getTimezoneOffsetMinutes(new Date(targetInstant), targetTz);
    targetInstant = Date.UTC(y, mo - 1, d, hh, mm, ss) - off * 60000;
  }

  return new Date(targetInstant);
}

function applyTimeOverride(input) {
  const virtualTarget = parseTimeTravelInput(input);
  if (!virtualTarget) return { ok: false, error: 'Format tidak valid' };
  const offsetMs = virtualTarget.getTime() - Date.now();
  timeOverride = { offsetMs, label: input.trim() };
  return { ok: true, target: virtualTarget };
}

function clearTimeOverride() { timeOverride = null; }
function isTimeOverrideActive() { return timeOverride !== null; }
