// ============================================
// WORLD CLOCK — Time Lab Section
// ============================================

let labSliderTz = 'Asia/Jakarta'; // Basis WIB default
let labOverrideTime = null;        // null = live, atau { hh, mm }
let labIsDragging = false;

function initTimeLab() {
  const slider = document.getElementById('labSlider');
  const hint = document.getElementById('labTimeLabel');
  const resetBtn = document.getElementById('labResetBtn');
  const tzSelect = document.getElementById('labTzSelect');

  if (!slider) return;

  // Set slider value ke waktu WIB sekarang
  updateLabSliderToNow();

  slider.addEventListener('input', (e) => {
    labIsDragging = true;
    const minutes = parseInt(e.target.value, 10);
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    labOverrideTime = { hh, mm };

    // Update label
    const label = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    const tzLabel = getShortTzLabel(labSliderTz);
    hint.textContent = `${label} ${tzLabel}`;

    // Apply ke override global (biar sinkron dengan fitur time travel)
    const tzStr = getShortTzLabel(labSliderTz);
    applyTimeOverride(`${label} ${tzStr}`);

    // Update semua tampilan
    refreshAllDisplays();
  });

  slider.addEventListener('change', () => {
    labIsDragging = false;
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      labOverrideTime = null;
      clearTimeOverride();
      updateLabSliderToNow();
      refreshAllDisplays();
      playSound('success');
    });
  }

  if (tzSelect) {
    tzSelect.addEventListener('change', (e) => {
      labSliderTz = e.target.value;
      updateLabSliderToNow();
    });
  }

  // Update slider tiap 30 detik (kalau live)
  setInterval(() => {
    if (!labOverrideTime && !labIsDragging) {
      updateLabSliderToNow();
    }
  }, 30000);

  // Initial render
  renderLabInfo();
}

function updateLabSliderToNow() {
  const slider = document.getElementById('labSlider');
  const hint = document.getElementById('labTimeLabel');
  if (!slider) return;

  const now = getNow();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: labSliderTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const map = {};
  for (const p of parts) map[p.type] = p.value;

  const hh = parseInt(map.hour, 10);
  const mm = parseInt(map.minute, 10);
  const total = hh * 60 + mm;

  slider.value = total;

  const label = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  const tzLabel = getShortTzLabel(labSliderTz);
  if (hint) hint.textContent = `${label} ${tzLabel}`;
}

/**
 * Render info panel Time Lab (kota aktif).
 */
function renderLabInfo() {
  const container = document.getElementById('labInfoContent');
  const analogContainer = document.getElementById('labAnalog');
  if (!container) return;

  const now = getNow();
  const activeCityId = activeWidgetCity || pinnedIds[0];
  const city = CITIES.find(c => c.id === activeCityId);
  if (!city) return;

  // Analog besar
  if (analogContainer) {
    renderAnalogLarge(analogContainer, now, city.tz);
  }

  // Info panel
  const time = formatTime(now, city.tz);
  const date = formatDate(now, city.tz);
  const dayState = getDayNightState(city, now);
  const dayIcon = getDayNightIcon(dayState);
  const tzLabel = getShortTzLabel(city.tz);
  const offset = formatOffsetLabel(now, city.tz);
  const landmark = getLandmark(city.id);

  const statusText = {
    day: 'Siang Hari',
    night: 'Malam Hari',
    sunrise: 'Matahari Terbit',
    sunset: 'Matahari Terbenam',
  }[dayState] || 'Siang Hari';

  container.innerHTML = `
    <div class="lab-info-header">
      <span class="lab-info-flag">${city.flag}</span>
      <div>
        <div class="lab-info-city">${city.city}</div>
        <div class="lab-info-tz">${city.tz} · ${tzLabel}</div>
      </div>
    </div>
    <div class="lab-info-clock">${time.hour}:${time.minute}<span class="lab-info-sec">:${time.second}</span></div>
    <div class="lab-info-date">${date}</div>
    <div class="lab-info-pills">
      <span class="lab-pill lab-pill-status">
        <span class="lab-pill-icon">${dayIcon}</span>
        ${statusText}
      </span>
      <span class="lab-pill lab-pill-offset">${offset}</span>
    </div>
    <div class="lab-info-landmark">
      <span class="lab-landmark-label">📍 Kawasan Utama</span>
      <span class="lab-landmark-value">${landmark}</span>
    </div>
  `;

  // Update title kota aktif di Time Lab
  const title = document.getElementById('labActiveCity');
  if (title) title.textContent = city.city;
}

/**
 * Refresh semua display (dipanggil dari time travel / slider / reset).
 */
function refreshAllDisplays() {
  if (typeof updateClocks === 'function') updateClocks();
  renderLabInfo();
}
