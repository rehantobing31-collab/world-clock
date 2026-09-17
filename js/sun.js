// ============================================
// WORLD CLOCK — Deteksi Siang / Malam
// ============================================

/**
 * Estimasi jam matahari terbit & terbenam sederhana berdasarkan latitude.
 * Return: { sunrise: jam_float, sunset: jam_float }
 * Contoh: sunrise 5.5 artinya 05:30
 */
function estimateSunTimes(lat, dayOfYear) {
  // Deklinasi matahari (radian)
  const decl = 23.44 * Math.PI / 180 *
    Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);

  // Hour angle
  const latRad = lat * Math.PI / 180;
  const cosH = -Math.tan(latRad) * Math.tan(decl);

  // Handle polar day/night
  if (cosH < -1) return { sunrise: 0, sunset: 24 };       // matahari nggak terbenam
  if (cosH > 1) return { sunrise: 12, sunset: 12 };       // matahari nggak terbit

  const H = Math.acos(cosH) * 180 / Math.PI;
  const sunrise = 12 - H / 15;
  const sunset = 12 + H / 15;
  return { sunrise, sunset };
}

/**
 * Mendapatkan jam lokal (float 0-24) di timezone tertentu.
 */
function getLocalHourFloat(date, tz) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const map = {};
  for (const p of parts) map[p.type] = p.value;
  const h = parseInt(map.hour, 10) % 24;
  const m = parseInt(map.minute, 10);
  return h + m / 60;
}

/**
 * Mendapatkan day of year (1-365) di timezone tertentu.
 */
function getDayOfYear(date, tz) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const map = {};
  for (const p of parts) map[p.type] = p.value;
  const d = new Date(Date.UTC(+map.year, +map.month - 1, +map.day));
  const start = Date.UTC(+map.year, 0, 1);
  return Math.floor((d.getTime() - start) / 86400000) + 1;
}

/**
 * Dapatkan state siang/malam kota.
 * Return: 'day' | 'night' | 'sunrise' | 'sunset'
 */
function getDayNightState(city, date) {
  if (!city.lat || !city.lon) return 'day'; // fallback

  const dayOfYear = getDayOfYear(date, city.tz);
  const localHour = getLocalHourFloat(date, city.tz);
  const { sunrise, sunset } = estimateSunTimes(city.lat, dayOfYear);

  // Window sunrise/sunset: ±30 menit
  if (Math.abs(localHour - sunrise) < 0.5) return 'sunrise';
  if (Math.abs(localHour - sunset) < 0.5) return 'sunset';

  if (localHour >= sunrise && localHour < sunset) return 'day';
  return 'night';
}

/**
 * Dapatkan emoji berdasarkan state.
 */
function getDayNightIcon(state) {
  switch (state) {
    case 'day': return '☀️';
    case 'night': return '🌙';
    case 'sunrise': return '🌅';
    case 'sunset': return '🌇';
    default: return '☀️';
  }
}
