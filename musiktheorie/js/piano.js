'use strict';
/* Interaktive Klaviatur. */
function Piano(container, opts = {}) {
  const T = Theory;
  const from = opts.from ?? 48, to = opts.to ?? 72;
  const labels = opts.labels || 'c'; // 'none' | 'c' | 'white' | 'all'
  const el = document.createElement('div');
  el.className = 'piano' + (opts.small ? ' small' : '');
  const whites = [];
  for (let m = from; m <= to; m++) if (T.isWhiteMidi(m)) whites.push(m);
  const W = 100 / whites.length;
  const keys = new Map();

  for (let m = from; m <= to; m++) {
    const k = document.createElement('button');
    k.type = 'button';
    k.dataset.midi = m;
    const white = T.isWhiteMidi(m);
    k.className = 'key ' + (white ? 'white' : 'black');
    const name = white ? T.name(T.fromMidi(m)) : T.PC_NAMES[T.mod(m, 12)];
    k.setAttribute('aria-label', white ? T.helmholtz(T.fromMidi(m)) : name);
    if (white) {
      const i = whites.indexOf(m);
      k.style.left = i * W + '%';
      k.style.width = W + '%';
    } else {
      const i = whites.filter((w) => w < m).length;
      k.style.left = (i * W - W * 0.32) + '%';
      k.style.width = W * 0.64 + '%';
    }
    const showLabel = labels === 'all' || (labels === 'white' && white) || (labels === 'c' && T.mod(m, 12) === 0);
    if (showLabel) {
      const span = document.createElement('span');
      span.className = 'klabel';
      span.innerHTML = white ? (labels === 'c' ? T.helmholtz(T.fromMidi(m)) : name) : name.replace('/', '<br>');
      k.appendChild(span);
    }
    k.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (opts.disabled) return;
      if (opts.sound !== false) Sound.play(m, { mode: 'melody', dur: 1.2, stopPrev: false });
      k.classList.add('down');
      setTimeout(() => k.classList.remove('down'), 180);
      if (opts.onPress) opts.onPress(m, k);
    });
    keys.set(m, k);
    el.appendChild(k);
  }
  container.appendChild(el);

  return {
    el,
    keys,
    highlight(midis, cls = 'hl') {
      (Array.isArray(midis) ? midis : [midis]).forEach((m) => keys.get(m)?.classList.add(cls));
    },
    clear(cls) {
      const classes = cls ? [cls] : ['hl', 'hl2', 'good', 'bad'];
      keys.forEach((k) => k.classList.remove(...classes));
    },
    setDisabled(v) { opts.disabled = v; el.classList.toggle('disabled', v); },
    press(m) { const k = keys.get(m); if (k) { k.classList.add('down'); setTimeout(() => k.classList.remove('down'), 250); } },
  };
}
