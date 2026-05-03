const video        = document.getElementById('video');
const player       = document.getElementById('player');
const playBtn      = document.getElementById('playBtn');
const playBig      = document.getElementById('playBig');
const muteBtn      = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar  = document.getElementById('progressBar');
const progressFilled  = document.getElementById('progressFilled');
const progressBuffered = document.getElementById('progressBuffered');
const progressThumb = document.getElementById('progressThumb');
const timeDisplay  = document.getElementById('time');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const pipBtn       = document.getElementById('pipBtn');

const iconPlay   = document.getElementById('iconPlay');
const iconPause  = document.getElementById('iconPause');
const iconVol    = document.getElementById('iconVol');
const iconMute   = document.getElementById('iconMute');
const iconExpand = document.getElementById('iconExpand');
const iconShrink = document.getElementById('iconShrink');

// ── Helpers ──────────────────────────────────────────────
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function setPlayState(playing) {
  iconPlay.classList.toggle('hidden', playing);
  iconPause.classList.toggle('hidden', !playing);
  playBig.classList.toggle('hidden', playing);
  player.classList.toggle('paused', !playing);
}

// ── Play / Pause ─────────────────────────────────────────
function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener('play',  () => setPlayState(true));
video.addEventListener('pause', () => setPlayState(false));
video.addEventListener('ended', () => setPlayState(false));

playBtn.addEventListener('click', togglePlay);
playBig.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

// Show paused state initially
setPlayState(false);

// ── Progress ─────────────────────────────────────────────
video.addEventListener('timeupdate', () => {
  if (!video.duration) return;
  const pct = (video.currentTime / video.duration) * 100;
  progressFilled.style.width = pct + '%';
  progressThumb.style.left   = pct + '%';
  timeDisplay.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
});

video.addEventListener('progress', () => {
  if (!video.duration || video.buffered.length === 0) return;
  const pct = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
  progressBuffered.style.width = pct + '%';
});

video.addEventListener('loadedmetadata', () => {
  timeDisplay.textContent = `0:00 / ${fmt(video.duration)}`;
});

// Seek on click/drag
let seeking = false;

function seek(e) {
  const rect = progressBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  video.currentTime = pct * video.duration;
}

progressBar.addEventListener('mousedown', e => { seeking = true; seek(e); });
document.addEventListener('mousemove',    e => { if (seeking) seek(e); });
document.addEventListener('mouseup',      ()  => { seeking = false; });

// Touch support for progress bar
progressBar.addEventListener('touchstart', e => { seeking = true; seek(e.touches[0]); }, { passive: true });
document.addEventListener('touchmove',    e => { if (seeking) seek(e.touches[0]); }, { passive: true });
document.addEventListener('touchend',     ()  => { seeking = false; });

// ── Volume ───────────────────────────────────────────────
function updateVolumeUI() {
  const muted = video.muted || video.volume === 0;
  iconVol.classList.toggle('hidden', muted);
  iconMute.classList.toggle('hidden', !muted);
  volumeSlider.value = muted ? 0 : video.volume;
}

muteBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  updateVolumeUI();
});

volumeSlider.addEventListener('input', () => {
  video.volume = parseFloat(volumeSlider.value);
  video.muted  = video.volume === 0;
  updateVolumeUI();
});

updateVolumeUI();

// ── Fullscreen ───────────────────────────────────────────
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    player.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

document.addEventListener('fullscreenchange', () => {
  const fs = !!document.fullscreenElement;
  iconExpand.classList.toggle('hidden', fs);
  iconShrink.classList.toggle('hidden', !fs);
});

// ── Picture in Picture ───────────────────────────────────
if (!('pictureInPictureEnabled' in document)) {
  pipBtn.style.display = 'none';
}

pipBtn.addEventListener('click', async () => {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  } catch (err) {
    console.warn('PiP nicht verfügbar:', err);
  }
});

// ── Keyboard shortcuts ───────────────────────────────────
document.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
      break;
    case 'ArrowLeft':
      video.currentTime = Math.max(0, video.currentTime - 5);
      break;
    case 'ArrowUp':
      video.volume = Math.min(1, video.volume + 0.1);
      updateVolumeUI();
      break;
    case 'ArrowDown':
      video.volume = Math.max(0, video.volume - 0.1);
      updateVolumeUI();
      break;
    case 'm':
      video.muted = !video.muted;
      updateVolumeUI();
      break;
    case 'f':
      fullscreenBtn.click();
      break;
  }
});
