// ============================================
// WORLD CLOCK — Sound Effects (Web Audio API)
// ============================================

let soundEnabled = false;
let audioCtx = null;

function initSound() {
  const saved = localStorage.getItem('wc_sound');
  soundEnabled = saved === '1';

  const btn = document.getElementById('soundToggle');
  if (btn) {
    updateSoundButton();
    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('wc_sound', soundEnabled ? '1' : '0');
      updateSoundButton();
      if (soundEnabled) playSound('toggle');
    });
  }
}

function updateSoundButton() {
  const btn = document.getElementById('soundToggle');
  if (!btn) return;
  btn.textContent = soundEnabled ? '🔊' : '🔇';
  btn.title = soundEnabled ? 'Sound: On' : 'Sound: Off';
}

function ensureAudioCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/**
 * Play sound effect.
 * types: 'tick', 'click', 'toggle', 'success', 'error'
 */
function playSound(type = 'click') {
  if (!soundEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  const presets = {
    tick:    { freq: 800,  dur: 0.03, type: 'square' },
    click:   { freq: 600,  dur: 0.05, type: 'sine' },
    toggle:  { freq: 900,  dur: 0.08, type: 'sine' },
    success: { freq: 1200, dur: 0.12, type: 'sine' },
    error:   { freq: 200,  dur: 0.15, type: 'sawtooth' },
  };

  const preset = presets[type] || presets.click;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = preset.type;
  osc.frequency.setValueAtTime(preset.freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.dur);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + preset.dur);
}
