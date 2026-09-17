// ============================================
// WORLD CLOCK — Mood Color (auto by time of day)
// ============================================

let moodEnabled = false;

function initMood() {
  const saved = localStorage.getItem('wc_mood');
  moodEnabled = saved === '1';

  const btn = document.getElementById('moodToggle');
  if (btn) {
    updateMoodButton();
    btn.addEventListener('click', () => {
      moodEnabled = !moodEnabled;
      localStorage.setItem('wc_mood', moodEnabled ? '1' : '0');
      updateMoodButton();
      playSound('toggle');
      applyMoodColor();
    });
  }

  // Update tiap 5 menit
  setInterval(applyMoodColor, 5 * 60 * 1000);
  applyMoodColor();
}

function updateMoodButton() {
  const btn = document.getElementById('moodToggle');
  if (!btn) return;
  btn.textContent = moodEnabled ? '🌗' : '🌓';
  btn.title = moodEnabled ? 'Mood color: On' : 'Mood color: Off';
}

function applyMoodColor() {
  const root = document.documentElement;

  if (!moodEnabled) {
    root.style.removeProperty('--mood-overlay');
    root.removeAttribute('data-mood');
    return;
  }

  const hour = new Date().getHours();
  let mood = 'day';

  if (hour >= 5 && hour < 11) mood = 'morning';
  else if (hour >= 11 && hour < 17) mood = 'day';
  else if (hour >= 17 && hour < 20) mood = 'evening';
  else mood = 'night';

  root.setAttribute('data-mood', mood);
}
