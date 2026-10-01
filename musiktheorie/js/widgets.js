'use strict';
/* Interaktive Bausteine für Lektionen: Notenbeispiele, Klaviaturen, Abspiel-Knöpfe, Rhythmen. */
const Widgets = (() => {
  const T = Theory;
  const BEATS = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25 };
  const beatsOf = (it) => BEATS[it.dur || 'w'] * (it.dots === 1 ? 1.5 : it.dots === 2 ? 1.75 : 1);

  const parseNotes = (s) => s.trim().split(/\s+/).filter(Boolean).map((ev) => ev.split('+').map(T.parse));

  /** Spielt eine Folge von Ereignissen (jedes Ereignis = Array von Tönen). */
  function playEvents(events, mode = 'melody', gap = 0.55) {
    const midis = events.map((ev) => ev.map(T.midi));
    if (mode === 'chord') return Sound.play(midis.flat(), { mode: 'chord' });
    if (mode === 'arp') return Sound.play(midis.flat(), { mode: 'arp', gap: 0.35 });
    if (midis.every((m) => m.length === 1)) return Sound.play(midis.flat(), { mode: 'melody', gap });
    return Sound.progression(midis, { gap: Math.max(gap, 0.9), dur: 1 });
  }

  function playBtn(label, fn, cls = '') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn play-btn ' + cls;
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  function staffWidget(el) {
    const d = el.dataset;
    const items = Staff.parseSeq(d.n || '', d.dur || 'w');
    if (d.labels && d.labels !== '1') {
      const labels = d.labels.split(',');
      let i = 0;
      items.forEach((it) => { if (it.type === 'note' || it.type === 'rest') it.label = labels[i++] ?? ''; });
    }
    if (d.colors) {
      const cols = d.colors.split(',');
      let i = 0;
      items.forEach((it) => { if (it.type === 'note') { const c = cols[i++]; if (c && c !== '-') it.color = c; } });
    }
    const svg = Staff.render({
      clef: d.clef || 'treble',
      keySig: d.key ? +d.key : 0,
      time: d.time ? d.time.split('/').map((x) => isNaN(+x) ? x : +x) : null,
      items,
      labels: d.labels === '1',
      spacing: d.spacing ? +d.spacing : undefined,
      scale: d.scale ? +d.scale : undefined,
    });
    const box = document.createElement('div');
    box.className = 'example';
    box.innerHTML = svg;
    const mode = d.play || (d.time ? 'rhythm' : 'melody');
    const row = document.createElement('div');
    row.className = 'btn-row';
    if (mode !== 'none') {
      const notesItems = items.filter((it) => it.type === 'note' || it.type === 'rest');
      if (mode === 'rhythm') {
        const bpm = +(d.bpm || 80);
        const evs = notesItems.map((it) => ({ midi: it.type === 'note' ? T.midi(it.notes[0]) : null, beats: beatsOf(it) }));
        const beatsPerBar = d.time ? (+d.time.split('/')[0] * 4 / +d.time.split('/')[1]) : 4;
        row.appendChild(playBtn('▶ Anhören (mit Einzähler)', () => Sound.rhythm(evs, bpm, { countIn: Math.round(beatsPerBar) })));
      } else {
        const events = notesItems.filter((it) => it.type === 'note').map((it) => it.notes);
        row.appendChild(playBtn(mode === 'chord' ? '▶ Zusammenklang' : '▶ Anhören', () => playEvents(events, mode, +(d.gap || 0.55))));
        if (d.also === 'chord') row.appendChild(playBtn('▶ Zusammenklang', () => playEvents(events, 'chord')));
        if (d.also === 'each') row.appendChild(playBtn('▶ Akkorde einzeln', () => playEvents(events, 'melody', 1.1)));
      }
    }
    if (row.children.length) box.appendChild(row);
    if (d.cap) {
      const cap = document.createElement('div');
      cap.className = 'cap';
      cap.innerHTML = d.cap;
      box.appendChild(cap);
    }
    el.replaceWith(box);
  }

  function pianoWidget(el) {
    const d = el.dataset;
    const box = document.createElement('div');
    box.className = 'example';
    const from = T.midi(T.parse(d.from || 'C4'));
    const to = T.midi(T.parse(d.to || 'B5'));
    const p = Piano(box, { from, to, labels: d.labels || 'c', small: d.small === '1' });
    const hl = d.hl ? parseNotes(d.hl).flat() : [];
    p.highlight(hl.map(T.midi), 'hl');
    if (d.hl2) p.highlight(parseNotes(d.hl2).flat().map(T.midi), 'hl2');
    if (hl.length && d.play !== 'none') {
      const row = document.createElement('div');
      row.className = 'btn-row';
      row.appendChild(playBtn('▶ Markierte Töne anhören', () => Sound.play(hl.map(T.midi), { mode: d.play || 'melody', gap: 0.4 })));
      box.appendChild(row);
    }
    if (d.cap) {
      const cap = document.createElement('div');
      cap.className = 'cap';
      cap.innerHTML = d.cap;
      box.appendChild(cap);
    }
    el.replaceWith(box);
  }

  function playButton(el) {
    const d = el.dataset;
    const events = parseNotes(d.n);
    const b = playBtn('▶ ' + el.innerHTML, () => {
      if (d.mode === 'prog') Sound.progression(events.map((ev) => ev.map(T.midi)), { gap: +(d.gap || 1) });
      else playEvents(events, d.mode || 'melody', +(d.gap || 0.55));
    }, 'inline-play');
    el.replaceWith(b);
  }

  /** Ersetzt alle Platzhalter in einem Container. */
  function hydrate(root) {
    root.querySelectorAll('.w-staff').forEach(staffWidget);
    root.querySelectorAll('.w-piano').forEach(pianoWidget);
    root.querySelectorAll('.w-play').forEach(playButton);
    root.querySelectorAll('.w-circle').forEach((el) => Tools.circleInto(el, { compact: true }));
    root.querySelectorAll('.w-table').forEach((el) => { el.outerHTML = `<div class="table-wrap">${el.innerHTML}</div>`; });
  }

  return { hydrate, playEvents, parseNotes, beatsOf, BEATS };
})();
