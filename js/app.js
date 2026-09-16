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
  setupEventListeners();
  renderPinned();
  renderAllCities();
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
  // Time override — Apply
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
  });

  // Time override — Enter
  document.getElementById('overrideInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('applyOverride').click();
  });

  // Reset buttons
  document.getElementById('clearOverride').addEventListener('click', resetOverride);
  document.getElementById('resetOverride').addEventListener('click', resetOverride);

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderAllCities();
  });

  // Filter tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRegion = tab.dataset.region;
      renderAllCities();
    });
  });

  // Picker modal
  document.getElementById('closePicker').addEventListener('click', closePicker);
  document.getElementById('pickerModal').addEventListener('click', (e) => {
    if (e.target.id === 'pickerModal') closePicker();
  });
  document.getElementById('pickerSearch').addEventListener('input', (e) => {
    renderPickerList(e.target.value.toLowerCase());
  });

  // ESC close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('pickerModal').hidden) {
      closePicker();
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
    const time = formatTime(now, city.tz);
    const date = formatDate(now, city.tz);
    const offset = formatOffsetLabel(now, city.tz);

    const card = document.createElement('div');
    card.className = 'pinned-card';
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
        ${time.hour}:${time.minute}<span class="seconds">:${time.second}</span>
      </div>
      <div class="date-line">
        <span>${date}</span>
        <span class="tz-badge">${offset}</span>
      </div>
    `;
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

  if (activeRegion !== 'all') {
    list = list.filter(c => c.region === activeRegion);
  }
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
    const time = formatTime(now, city.tz);
    const date = formatDate(now, city.tz);

    const card = document.createElement('div');
    card.className = 'city-card';
    card.innerHTML = `
      <div class="city-card-header">
        <span class="city-flag">${city.flag}</span>
        <div style="flex:1;margin-left:10px;">
          <div class="city-name">${city.city}</div>
          <div class="city-country">${city.country}</div>
        </div>
      </div>
      <div class="city-clock" data-city-time="${city.id}">
        ${time.hour}:${time.minute}<span class="seconds">:${time.second}</span>
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
    const time = formatTime(now, city.tz);
    const date = formatDate(now, city.tz);
    const offset = formatOffsetLabel(now, city.tz);

    const clockEl = document.querySelector(`[data-pinned-time="${index}"]`);
    if (clockEl) {
      clockEl.innerHTML = `${time.hour}:${time.minute}<span class="seconds">:${time.second}</span>`;
    }
    const card = clockEl?.closest('.pinned-card');
    if (card) {
      const dateLine = card.querySelector('.date-line');
      if (dateLine) {
        dateLine.innerHTML = `<span>${date}</span><span class="tz-badge">${offset}</span>`;
      }
    }
  });

  document.querySelectorAll('[data-city-time]').forEach(clockEl => {
    const id = clockEl.dataset.cityTime;
    const city = CITIES.find(c => c.id === id);
    if (!city) return;
    const time = formatTime(now, city.tz);
    const date = formatDate(now, city.tz);
    clockEl.innerHTML = `${time.hour}:${time.minute}<span class="seconds">:${time.second}</span>`;
    const dateEl = clockEl.nextElementSibling;
    if (dateEl && dateEl.classList.contains('city-date')) {
      dateEl.textContent = date;
    }
  });
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
        pinnedIds[editingSlot] = city.id;
        savePinned();
        renderPinned();
        closePicker();
      }
    });
    list.appendChild(item);
  });
}
