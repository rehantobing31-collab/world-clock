// ============================================
// WORLD CLOCK — Logic UI
// ============================================

const DEFAULT_PINNED = ['jakarta', 'singapore', 'colombo'];
let pinnedIds = [...DEFAULT_PINNED];
let activeRegion = 'all';
let searchQuery = '';
let editingSlot = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  initFormatToggle();
  initAntiCopy();
  initWidget();
  setupEventListeners();
  renderPinned();
  renderAllCities();
  highlightPinnedActive();
  startClock();
});

// ===== STATE PERSIST =====
function loadState() {
  try {
    const savedPinned = JSON.parse(localStorage.getItem('wc_pinned') || 'null');
    if (Array.isArray(savedPinned) && savedPinned.length === 3) {
      pinnedIds = savedPinned;
    }
  } catch (e) { /* ignore */ }
}

function savePinned() {
  localStorage.setItem('wc_pinned', JSON.stringify(pinnedIds));
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  document.getElementById('applyOverride').addEventListener('click', () => {
    const input = document.getElementById('overrideInput').value;
    const result = applyTimeOverride(input);
    const hint = document.getElementById('overrideHint');
    if (!result.ok) {
      hint.style.color = 'var(--danger)';
      hint.textContent = '❌ Format tidak valid. Contoh: 20:15 WIB, 14:30 UTC, 09:00 Tokyo';
      return;
    }
    hint.style.color = 'var(--success)';
    hint.textContent = `✅ Time travel aktif ke ${result.target.toLocaleString('id-ID')}`;
    showOverrideBadge(input.trim());
    renderPinned();
    renderAllCities();
    renderWidget();
  });

  document.getElementById('overrideInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('applyOverride').click();
  });

  document.getElementById('clearOverride').addEventListener('click', resetOverride);
  document.getElementById('resetOverride').addEventListener('click', resetOverride);

  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderAllCities();
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRegion = tab.dataset.region;
      renderAllCities();
    });
  });

  document.getElementById('closePicker').addEventListener('click', closePicker);
  document.getElementById('pickerModal').addEventListener('click', (e) => {
    if (e.target.id === 'pickerModal') closePicker();
  });
  document.getElementById('pickerSearch').addEventListener('input', (e) => {
    renderPickerList(e.target.value.toLowerCase());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!document.getElementById('pickerModal').hidden) closePicker();
      if (!document.getElementById('widgetPickerModal').hidden) closeWidgetPicker();
    }
  });
}

function resetOverride() {
  clearTimeOverride();
  document.getElementById('overrideInput').value = '';
  const hint = document.getElementById('overrideHint');
  hint.style.color = '';
  hint.innerHTML = 'Format: <code>HH:MM ZONA</code> — zona bisa: WIB, WITA, WIT, UTC, GMT, atau nama kota (Tokyo, London, dll.)';
  document.getElementById('overrideBadge').hidden = true;
  renderPinned();
  renderAllCities();
  renderWidget();
}

function showOverrideBadge(label) {
  const badge = document.getElementById('overrideBadge');
  badge.hidden = false;
  badge.firstChild.textContent = `⏱ ${label} `;
}

// ===== RENDER PINNED =====
function renderPinned() {
  const grid = document.getElementById('pinnedGrid');
  const now = getNow();
  grid.innerHTML = '';

  pinnedIds.forEach((id, index) => {
    const city = CITIES.find(c => c.id === id);
    if (!city) return;
    const date = formatDate(now, city.tz);
    const offset = formatOffsetLabel(now, city.tz);
    const dayState = getDayNightState(city, now);
    const dayIcon = getDayNightIcon(dayState);

    const card = document.createElement('div');
    card.className = 'pinned-card';
    card.dataset.pinnedIndex = index;
    card.dataset.pinnedCity = city.id;
    card.dataset.dayState = dayState;
    card.innerHTML = `
      <div class="pinned-header">
        <div class="pinned-city">
          <span class="pinned-flag">${city.flag}</span>
          <div>
            <div class="pinned-name">${city.city}</div>
            <div class="pinned-country">${city.country}</div>
          </div>
        </div>
        <button class="change-btn" data-slot="${index}">Ganti</button>
      </div>
      <div class="digital-clock" data-pinned-time="${index}">
        ${renderClockHTML(now, city.tz)}
      </div>
      <div class="date-line">
        <span class="day-night-label">
          <span class="dn-icon">${dayIcon}</span>
          <span class="dn-text">${dayState === 'day' ? 'Siang' : dayState === 'night' ? 'Malam' : dayState === 'sunrise' ? 'Subuh' : 'Senja'}</span>
        </span>
        <span class="date-text">${date}</span>
        <span class="tz-badge">${offset}</span>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('change-btn') || e.target.closest('.change-btn')) return;
      setActiveWidgetCity(city.id);
    });

    grid.appendChild(card);
  });

  grid.querySelectorAll('.change-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPicker(parseInt(btn.dataset.slot));
    });
  });
}

// ===== RENDER ALL CITIES =====
function renderAllCities() {
  const grid = document.getElementById('allGrid');
  const now = getNow();
  let list = CITIES;

  if (activeRegion !== 'all') list = list.filter(c => c.region === activeRegion);
  if (searchQuery) {
    list = list.filter(c =>
      c.city.toLowerCase().includes(searchQuery) ||
      c.country.toLowerCase().includes(searchQuery) ||
      c.tz.toLowerCase().includes(searchQuery)
    );
  }

  list = [...list].sort((a, b) =>
    getTimezoneOffsetMinutes(now, a.tz) - getTimezoneOffsetMinutes(now, b.tz)
  );

  grid.innerHTML = '';
  list.forEach(city => {
    const date = formatDate(now, city.tz);
    const dayState = getDayNightState(city, now);
    const dayIcon = getDayNightIcon(dayState);

    const card = document.createElement('div');
    card.className = 'city-card';
    card.dataset.dayState = dayState;
    card.innerHTML = `
      <div class="city-card-header">
        <span class="city-flag">${city.flag}</span>
        <div style="flex:1;margin-left:10px;">
          <div class="city-name">${city.city}</div>
          <div class="city-country">${city.country}</div>
        </div>
        <span class="city-daynight" title="${dayState}">${dayIcon}</span>
      </div>
      <div class="city-clock" data-city-time="${city.id}">
        ${renderClockHTML(now, city.tz)}
      </div>
      <div class="city-date">${date}</div>
    `;
    grid.appendChild(card);
  });
}

// ===== CLOCK TICK =====
function startClock() {
  updateClocks();
  setInterval(updateClocks, 1000);
}

function updateClocks() {
  const now = getNow();

  pinnedIds.forEach((id, index) => {
    const city = CITIES.find(c => c.id === id);
    if (!city) return;
    const date = formatDate(now, city.tz);
    const offset = formatOffsetLabel(now, city.tz);
    const dayState = getDayNightState(city, now);
    const dayIcon = getDayNightIcon(dayState);

    const clockEl = document.querySelector(`[data-pinned-time="${index}"]`);
    if (clockEl) clockEl.innerHTML = renderClockHTML(now, city.tz);

    const card = clockEl?.closest('.pinned-card');
    if (card) {
      card.dataset.dayState = dayState;
      const dnIcon = card.querySelector('.dn-icon');
      const dnText = card.querySelector('.dn-text');
      const dateText = card.querySelector('.date-text');
      const tzBadge = card.querySelector('.tz-badge');
      if (dnIcon) dnIcon.textContent = dayIcon;
      if (dnText) dnText.textContent = dayState === 'day' ? 'Siang' : dayState === 'night' ? 'Malam' : dayState === 'sunrise' ? 'Subuh' : 'Senja';
      if (dateText) dateText.textContent = date;
      if (tzBadge) tzBadge.textContent = offset;
    }
  });

  document.querySelectorAll('[data-city-time]').forEach(clockEl => {
    const id = clockEl.dataset.cityTime;
    const city = CITIES.find(c => c.id === id);
    if (!city) return;
    const date = formatDate(now, city.tz);
    const dayState = getDayNightState(city, now);
    const dayIcon = getDayNightIcon(dayState);

    clockEl.innerHTML = renderClockHTML(now, city.tz);

    const card = clockEl.closest('.city-card');
    if (card) {
      card.dataset.dayState = dayState;
      const dnEl = card.querySelector('.city-daynight');
      if (dnEl) {
        dnEl.textContent = dayIcon;
        dnEl.title = dayState;
      }
      const dateEl = clockEl.nextElementSibling;
      if (dateEl && dateEl.classList.contains('city-date')) {
        dateEl.textContent = date;
      }
    }
  });

  updateWidgetClocks();
}

// ===== PICKER MODAL =====
function openPicker(slotIndex) {
  editingSlot = slotIndex;
  document.getElementById('slotNumber').textContent = slotIndex + 1;
  document.getElementById('pickerSearch').value = '';
  renderPickerList('');
  document.getElementById('pickerModal').hidden = false;
}

function closePicker() {
  document.getElementById('pickerModal').hidden = true;
  editingSlot = null;
}

function renderPickerList(query) {
  const list = document.getElementById('pickerList');
  let filtered = CITIES;
  if (query) {
    filtered = filtered.filter(c =>
      c.city.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query)
    );
  }
  list.innerHTML = '';
  filtered.forEach(city => {
    const item = document.createElement('div');
    item.className = 'picker-item';
    item.innerHTML = `
      <span class="flag">${city.flag}</span>
      <div>
        <div class="name">${city.city}</div>
        <div class="country">${city.country} · ${city.tz}</div>
      </div>
    `;
    item.addEventListener('click', () => {
      if (editingSlot !== null) {
        const oldId = pinnedIds[editingSlot];
        pinnedIds[editingSlot] = city.id;
        savePinned();
        widgetCities = widgetCities.map(c => c === oldId ? city.id : c);
        if (activeWidgetCity === oldId) activeWidgetCity = city.id;
        saveWidgetState();
        renderPinned();
        renderWidget();
        highlightPinnedActive();
        closePicker();
      }
    });
    list.appendChild(item);
  });
}
