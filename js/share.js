// ============================================
// WORLD CLOCK — Share / Screenshot
// ============================================

function initShare() {
  const btn = document.getElementById('shareBtn');
  if (!btn) return;

  btn.addEventListener('click', shareScreenshot);
}

async function shareScreenshot() {
  const btn = document.getElementById('shareBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ Loading...';
  btn.disabled = true;

  try {
    // Pakai html2canvas (load dynamic)
    await loadHtml2Canvas();

    const target = document.querySelector('.app');
    const canvas = await html2canvas(target, {
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Coba pakai Web Share API dulu
    canvas.toBlob(async (blob) => {
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'world-clock.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'World Clock',
              text: 'Cek waktu di seluruh dunia!',
            });
            btn.innerHTML = '✅ Shared!';
          } catch (err) {
            if (err.name !== 'AbortError') downloadBlob(blob);
            btn.innerHTML = originalText;
          }
        } else {
          downloadBlob(blob);
          btn.innerHTML = '✅ Downloaded';
        }
      } else {
        downloadBlob(blob);
        btn.innerHTML = '✅ Downloaded';
      }

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    }, 'image/png');
  } catch (err) {
    console.error(err);
    btn.innerHTML = '❌ Gagal';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  }
}

function downloadBlob(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `world-clock-${Date.now()}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

function loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
