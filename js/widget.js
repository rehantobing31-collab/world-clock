// ============================================
// WORLD CLOCK — Widget Bar (sticky di atas)
// ============================================

// State widget
let widgetCities = [];        // array of city id yang tampil di widget
let widgetHidden = false;     // true = widget disembunyikan
let activeWidgetCity = null;  // city id yang jadi "aktif" (di-klik dari kartu pinned)

// ===== INIT =====
function initWidget() {
  loadWidgetState();

  // Event: tombol close
  document.getElementById('widgetCloseBtn').addEventListener('click', () => {
    widgetHidden = true;
    saveWidgetState();
    renderWidget();
  });

  // Event: tombol show (yang nempel di kanan atas)
  document.getElementById('widgetShowBtn').addEventListener('click', () => {
    widgetHidden = false;
    saveWidgetState();
    renderWidget();
  });

  // Event: tombol tambah kota
  document.getElementById('widgetAddBtn').addEventListener('click', openWidgetPicker);

  // Modal widget picker
  document.getElementById('closeWidgetPicker').addEventListener('click', closeWidgetPicker);
  document.getElementById('widgetPickerModal').addEventListener('click', (e) => {
    if (e.target.id === 'widgetPickerModal') closeWidgetPicker();
  });
  document.getElementById('widgetPickerSearch').addEventListener('input', (e) => {
    renderWidgetPickerList(e.target.value.toLowerCase());
  });

  renderWidget();
}

// ===== PERSIST =====
function loadWidgetState() {
  try {
    const saved = JSON.parse(localStorage.getItem('wc_widget') || 'null');
    if (saved) {
      widgetCities = Array.isArray(saved.cities) ? saved.cities : [];
      widgetHidden = !!saved.hidden;
      activeWidgetCity = saved.active || null;
    }
    // Default: kalau kosong, ikutin pinned
    if (widgetCities.length === 0) {
      widgetCities = [...pinnedIds];
      activeWidgetCity = pinnedIds[0] || null;
    }
  } catch (e) {
    widgetCities = [...pinnedIds];
    activeWidgetCity = pinnedIds[0] || null;
  }
}

function saveWidgetState() {
  localStorage.setItem('wc_widget', JSON.stringify({
    cities: widgetCities,
    hidden: widgetHidden,
    active: activeWidgetCity,
  }));
}

// ===== RENDER =====
function renderWidget() {
  const bar = document.getElementById('widgetBar');
  const showBtn = document.getElementById('widgetShowBtn');
  const content = document.getElementById('widgetContent');

  // Kalau widget disembunyikan
  if (widgetHidden) {
    bar.hidden = true;
    showBtn.hidden = false;
    return;
  }

  bar.hidden = false;
  showBtn.hidden = true;

  if (widgetCities.length === 0) {
    content.innerHTML = `<span style="color:var(--text-dim);font-size:0.85rem;padding:6px 0;">Belum ada kota. Klik + untuk tambah.</span>`;
    return;
  }

  const now = getNow();
  content.innerHTML = '';

  widgetCities.forEach(cityId => {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return;

    const time = formatTime(now, city.tz);
    const isActive = cityId === activeWidgetCity;

    const item = document.createElement('div');
    item.className = 'widget-clock-item' + (isActive ? ' is-active' : '');
    item.dataset.widgetCity = cityId;
    item.innerHTML = `
      <span class="w-icon">${city.flag}</span>
      <span class="w-time" data-widget-time="${cityId}">
        ${time.hour}:${time.minute}<span class="w-sec">:${time.second}</span>
      </span>
      <span class="w-tz">${getShortTzLabel(city.tz)}</span>
      <button class="w-remove" data-widget-remove="${cityId}" title="Hapus">✕</button>
    `;

    // Klik item → set aktif
    item.addEventListener('click', (e) => {
      if (e.target.dataset.widgetRemove) return;
      activeWidgetCity = cityId;
      saveWidgetState();
      renderWidget();
      highlightPinnedActive();
    });

    content.appendChild(item);
  });

  // Bind remove buttons
  content.querySelectorAll('[data-widget-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.widgetRemove;
      widgetCities = widgetCities.filter(c => c !== id);
      if (activeWidgetCity === id) {
        activeWidgetCity = widgetCities[0] || null;
      }
      saveWidgetState();
      renderWidget();
      highlightPinnedActive();
    });
  });
}

// ===== UPDATE PER DETIK =====
function updateWidgetClocks() {
  if (widgetHidden) return;
  const now = getNow();
  document.querySelectorAll('[data-widget-time]').forEach(el => {
    const cityId = el.dataset.widgetTime;
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return;
    const time = formatTime(now, city.tz);
    el.innerHTML = `${time.hour}:${time.minute}<span class="w-sec">:${time.second}</span>`;
  });
}

// ===== SHORT TZ LABEL =====
function getShortTzLabel(tz) {
  const map = {
    'Asia/Jakarta': 'WIB',
    'Asia/Makassar': 'WITA',
    'Asia/Jayapura': 'WIT',
    'Asia/Singapore': 'SGT',
    'Asia/Tokyo': 'JST',
    'Asia/Seoul': 'KST',
    'Asia/Shanghai': 'CST',
    'Asia/Hong_Kong': 'HKT',
    'Asia/Bangkok': 'ICT',
    'Asia/Ho_Chi_Minh': 'ICT',
    'Asia/Kuala_Lumpur': 'MYT',
    'Asia/Manila': 'PHT',
    'Asia/Kolkata': 'IST',
    'Asia/Dhaka': 'BST',
    'Asia/Colombo': 'IST',
    'Asia/Kathmandu': 'NPT',
    'Asia/Dubai': 'GST',
    'Asia/Riyadh': 'AST',
    'Asia/Tehran': 'IRST',
    'Europe/London': 'GMT',
    'Europe/Paris': 'CET',
    'Europe/Berlin': 'CET',
    'Europe/Madrid': 'CET',
    'Europe/Rome': 'CET',
    'Europe/Amsterdam': 'CET',
    'Europe/Moscow': 'MSK',
    'Europe/Istanbul': 'TRT',
    'Europe/Athens': 'EET',
    'Europe/Stockholm': 'CET',
    'Europe/Zurich': 'CET',
    'Europe/Lisbon': 'WET',
    'America/New_York': 'EST',
    'America/Los_Angeles': 'PST',
    'America/Chicago': 'CST',
    'America/Denver': 'MST',
    'America/Toronto': 'EST',
    'America/Vancouver': 'PST',
    'America/Mexico_City': 'CST',
    'America/Sao_Paulo': 'BRT',
    'America/Argentina/Buenos_Aires': 'ART',
    'America/Lima': 'PET',
    'America/Bogota': 'COT',
    'America/Santiago': 'CLT',
    'Australia/Sydney': 'AEST',
    'Australia/Melbourne': 'AEST',
    'Australia/Perth': 'AWST',
    'Pacific/Auckland': 'NZST',
    'Pacific/Fiji': 'FJT',
    'Africa/Cairo': 'EET',
    'Africa/Johannesburg': 'SAST',
    'Africa/Lagos': 'WAT',
    'Africa/Nairobi': 'EAT',
    'Africa/Casablanca': 'WET',
    'Africa/Addis_Ababa': 'EAT',
    'UTC': 'UTC',
  };
  return map[tz] || tz.split('/').pop().slice(0, 4).toUpperCase();
}

// ===== HIGHLIGHT PINNED YANG AKTIF =====
function highlightPinnedActive() {
  document.querySelectorAll('.pinned-card').forEach(card => {
    const idx = card.dataset.pinnedIndex;
    if (idx === undefined) return;
    const cityId = pinnedIds[parseInt(idx)];
    card.classList.toggle('active', cityId === activeWidgetCity);
  });
}

// ===== WIDGET PICKER (tambah kota) =====
function openWidgetPicker() {
  document.getElementById('widgetPickerSearch').value = '';
  renderWidgetPickerList('');
  document.getElementById('widgetPickerModal').hidden = false;
}

function closeWidgetPicker() {
  document.getElementById('widgetPickerModal').hidden = true;
}

function renderWidgetPickerList(query) {
  const list = document.getElementById('widgetPickerList');
  let filtered = CITIES;
  if (query) {
    filtered = filtered.filter(c =>
      c.city.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query)
    );
  }

  // Sort: yang belum ada di widget dulu
  filtered = [...filtered].sort((a, b) => {
    const aIn = widgetCities.includes(a.id) ? 1 : 0;
    const bIn = widgetCities.includes(b.id) ? 1 : 0;
    return aIn - bIn;
  });

  list.innerHTML = '';
  filtered.forEach(city => {
    const isIn = widgetCities.includes(city.id);
    const item = document.createElement('div');
    item.className = 'picker-item';
    item.style.opacity = isIn ? '0.5' : '1';
    item.innerHTML = `
      <span class="flag">${city.flag}</span>
      <div style="flex:1;">
        <div class="name">${city.city} ${isIn ? '✓' : ''}</div>
        <div class="country">${city.country} · ${getShortTzLabel(city.tz)}</div>
      </div>
    `;
    item.addEventListener('click', () => {
      if (isIn) {
        // Toggle off
        widgetCities = widgetCities.filter(c => c !== city.id);
        if (activeWidgetCity === city.id) {
          activeWidgetCity = widgetCities[0] || null;
        }
      } else {
        // Toggle on
        widgetCities.push(city.id);
        if (!activeWidgetCity) activeWidgetCity = city.id;
      }
      saveWidgetState();
      renderWidget();
      renderWidgetPickerList(query);
      highlightPinnedActive();
    });
    list.appendChild(item);
  });
}

// ===== SET ACTIVE DARI LUAR =====
function setActiveWidgetCity(cityId) {
  if (!widgetCities.includes(cityId)) {
    widgetCities.push(cityId);
  }
  activeWidgetCity = cityId;
  saveWidgetState();
  renderWidget();
  highlightPinnedActive();
}
