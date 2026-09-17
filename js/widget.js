// ============================================
// WORLD CLOCK — Widget Bar (sticky di atas)
// ============================================

let widgetCities = [];
let widgetHidden = false;
let activeWidgetCity = null;

function initWidget() {
  loadWidgetState();

  document.getElementById('widgetCloseBtn').addEventListener('click', () => {
    widgetHidden = true;
    saveWidgetState();
    renderWidget();
  });

  document.getElementById('widgetShowBtn').addEventListener('click', () => {
    widgetHidden = false;
    saveWidgetState();
    renderWidget();
  });

  document.getElementById('widgetAddBtn').addEventListener('click', openWidgetPicker);

  document.getElementById('closeWidgetPicker').addEventListener('click', closeWidgetPicker);
  document.getElementById('widgetPickerModal').addEventListener('click', (e) => {
    if (e.target.id === 'widgetPickerModal') closeWidgetPicker();
  });
  document.getElementById('widgetPickerSearch').addEventListener('input', (e) => {
    renderWidgetPickerList(e.target.value.toLowerCase());
  });

  renderWidget();
}

function loadWidgetState() {
  try {
    const saved = JSON.parse(localStorage.getItem('wc_widget') || 'null');
    if (saved) {
      widgetCities = Array.isArray(saved.cities) ? saved.cities : [];
      widgetHidden = !!saved.hidden;
      activeWidgetCity = saved.active || null;
    }
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

function renderWidget() {
  const bar = document.getElementById('widgetBar');
  const showBtn = document.getElementById('widgetShowBtn');
  const content = document.getElementById('widgetContent');

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

    const isActive = cityId === activeWidgetCity;
    const dayState = getDayNightState(city, now);
    const dayIcon = getDayNightIcon(dayState);

    const item = document.createElement('div');
    item.className = 'widget-clock-item' + (isActive ? ' is-active' : '');
    item.dataset.widgetCity = cityId;
    item.dataset.dayState = dayState;
    item.innerHTML = `
      <span class="w-icon">${city.flag}</span>
      <span class="w-time" data-widget-time="${cityId}">${renderClockHTML(now, city.tz)}</span>
      <span class="w-daynight" title="${dayState}">${dayIcon}</span>
      <span class="w-tz">${getShortTzLabel(city.tz)}</span>
      <button class="w-remove" data-widget-remove="${cityId}" title="Hapus">✕</button>
    `;

    item.addEventListener('click', (e) => {
      if (e.target.dataset.widgetRemove) return;
      activeWidgetCity = cityId;
      saveWidgetState();
      renderWidget();
      highlightPinnedActive();
    });

    content.appendChild(item);
  });

  content.querySelectorAll('[data-widget-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.widgetRemove;
      widgetCities = widgetCities.filter(c => c !== id);
      if (activeWidgetCity === id) activeWidgetCity = widgetCities[0] || null;
      saveWidgetState();
      renderWidget();
      highlightPinnedActive();
    });
  });
}

function updateWidgetClocks() {
  if (widgetHidden) return;
  const now = getNow();
  document.querySelectorAll('[data-widget-city]').forEach(item => {
    const cityId = item.dataset.widgetCity;
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return;

    const timeEl = item.querySelector(`[data-widget-time="${cityId}"]`);
    if (timeEl) timeEl.innerHTML = renderClockHTML(now, city.tz);

    // Update day/night icon
    const dayState = getDayNightState(city, now);
    const iconEl = item.querySelector('.w-daynight');
    if (iconEl) {
      iconEl.textContent = getDayNightIcon(dayState);
      iconEl.title = dayState;
    }
    item.dataset.dayState = dayState;
  });
}

function getShortTzLabel(tz) {
  const map = {
    'Asia/Jakarta': 'WIB', 'Asia/Makassar': 'WITA', 'Asia/Jayapura': 'WIT',
    'Asia/Singapore': 'SGT', 'Asia/Tokyo': 'JST', 'Asia/Seoul': 'KST',
    'Asia/Shanghai': 'CST', 'Asia/Hong_Kong': 'HKT', 'Asia/Bangkok': 'ICT',
    'Asia/Ho_Chi_Minh': 'ICT', 'Asia/Kuala_Lumpur': 'MYT', 'Asia/Manila': 'PHT',
    'Asia/Kolkata': 'IST', 'Asia/Dhaka': 'BST', 'Asia/Colombo': 'SLST',
    'Asia/Kathmandu': 'NPT', 'Asia/Dubai': 'GST', 'Asia/Riyadh': 'AST',
    'Asia/Tehran': 'IRST', 'Europe/London': 'GMT', 'Europe/Paris': 'CET',
    'Europe/Berlin': 'CET', 'Europe/Madrid': 'CET', 'Europe/Rome': 'CET',
    'Europe/Amsterdam': 'CET', 'Europe/Moscow': 'MSK', 'Europe/Istanbul': 'TRT',
    'Europe/Athens': 'EET', 'Europe/Stockholm': 'CET', 'Europe/Zurich': 'CET',
    'Europe/Lisbon': 'WET', 'America/New_York': 'EST', 'America/Los_Angeles': 'PST',
    'America/Chicago': 'CST', 'America/Denver': 'MST', 'America/Toronto': 'EST',
    'America/Vancouver': 'PST', 'America/Mexico_City': 'CST', 'America/Sao_Paulo': 'BRT',
    'America/Argentina/Buenos_Aires': 'ART', 'America/Lima': 'PET',
    'America/Bogota': 'COT', 'America/Santiago': 'CLT',
    'Australia/Sydney': 'AEST', 'Australia/Melbourne': 'AEST',
    'Australia/Perth': 'AWST', 'Pacific/Auckland': 'NZST', 'Pacific/Fiji': 'FJT',
    'Africa/Cairo': 'EET', 'Africa/Johannesburg': 'SAST', 'Africa/Lagos': 'WAT',
    'Africa/Nairobi': 'EAT', 'Africa/Casablanca': 'WET', 'Africa/Addis_Ababa': 'EAT',
    'UTC': 'UTC',
  };
  return map[tz] || tz.split('/').pop().slice(0, 4).toUpperCase();
}

function highlightPinnedActive() {
  document.querySelectorAll('.pinned-card').forEach(card => {
    const idx = card.dataset.pinnedIndex;
    if (idx === undefined) return;
    const cityId = pinnedIds[parseInt(idx)];
    card.classList.toggle('active', cityId === activeWidgetCity);
  });
}

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
        widgetCities = widgetCities.filter(c => c !== city.id);
        if (activeWidgetCity === city.id) activeWidgetCity = widgetCities[0] || null;
      } else {
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

function setActiveWidgetCity(cityId) {
  if (!widgetCities.includes(cityId)) widgetCities.push(cityId);
  activeWidgetCity = cityId;
  saveWidgetState();
  renderWidget();
  highlightPinnedActive();
}
