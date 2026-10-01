'use strict';
/* Werkzeuge: Klavier, Quintenzirkel, Akkord-Explorer, Tonleiter-Explorer, Metronom. */
const Tools = (() => {
  const T = Theory;
  const ROOTS = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const rootOptions = (sel = 'C') => ROOTS.map((r) => `<option value="${r}"${r === sel ? ' selected' : ''}>${T.name(T.parse(r))}</option>`).join('');
  const SEMI_NAMES = ['Prime', 'kleine Sekunde', 'große Sekunde', 'kleine Terz', 'große Terz', 'Quarte', 'Tritonus', 'Quinte', 'kleine Sexte', 'große Sexte', 'kleine Septime', 'große Septime', 'Oktave'];
  const h = (html) => { const d = document.createElement('div'); d.innerHTML = html; return d; };
  const cleanups = [];
  function cleanup() { while (cleanups.length) cleanups.pop()(); }

  const TOOLS = {
    klavier: { title: 'Klavier', icon: '🎹', desc: 'Spiele frei auf der Klaviatur – auch mit der Computertastatur.' },
    quintenzirkel: { title: 'Quintenzirkel', icon: '⭕', desc: 'Interaktiver Quintenzirkel mit Vorzeichen, Tonleitern und Hauptakkorden.' },
    akkorde: { title: 'Akkord-Explorer', icon: '🎶', desc: 'Akkorde bauen, ansehen, hören – und Stufenakkorde jeder Tonart.' },
    tonleitern: { title: 'Tonleiter-Explorer', icon: '🪜', desc: 'Alle Tonleitern und Modi auf jedem Grundton.' },
    metronom: { title: 'Metronom', icon: '⏱️', desc: 'Takt und Tempo üben.' },
  };

  // ---------------------------------------------------------------- Klavier
  function klavier(main) {
    main.innerHTML = `
      <h1>🎹 Klavier</h1>
      <p class="muted">Klicke auf die Tasten oder benutze die Computertastatur: <kbd>A</kbd> <kbd>W</kbd> <kbd>S</kbd> <kbd>E</kbd> <kbd>D</kbd> <kbd>F</kbd> <kbd>T</kbd> <kbd>G</kbd> <kbd>Z</kbd>/<kbd>Y</kbd> <kbd>H</kbd> <kbd>U</kbd> <kbd>J</kbd> <kbd>K</kbd> … (ab c'). Mit <kbd>←</kbd> <kbd>→</kbd> verschiebst du die Oktave.</p>
      <div class="tool-row">
        <label>Beschriftung <select id="pLabels"><option value="c">nur C</option><option value="white">weiße Tasten</option><option value="all" selected>alle Tasten</option><option value="none">keine</option></select></label>
        <span class="pill" id="pOct">Tastatur-Oktave: c'</span>
      </div>
      <div class="card"><div id="pianoBox"></div>
        <div class="grid grid-2" style="margin-top:12px">
          <div><div class="muted small">Zuletzt gespielt</div><div id="pLast" style="font-size:1.6rem;font-weight:700">–</div><div id="pIv" class="muted"></div></div>
          <div id="pStaff"></div>
        </div>
      </div>`;
    const box = main.querySelector('#pianoBox');
    let piano;
    const last = [];
    const render = (labels) => {
      box.innerHTML = '';
      piano = Piano(box, { from: 48, to: 84, labels, onPress: onPress });
    };
    function onPress(m) {
      last.push(m);
      if (last.length > 2) last.shift();
      const p = T.fromMidi(m);
      const name = T.isWhiteMidi(m) ? T.helmholtz(p) : `${T.helmholtz(p)} / ${T.helmholtz(T.fromMidi(m, true))}`;
      main.querySelector('#pLast').textContent = name;
      if (last.length === 2) {
        const s = Math.abs(last[1] - last[0]);
        main.querySelector('#pIv').innerHTML = s <= 12 ? `Abstand zum vorigen Ton: ${s} Halbtöne = <b>${SEMI_NAMES[s]}</b>` : `Abstand zum vorigen Ton: ${s} Halbtöne`;
      }
      const notes = last.map((x) => T.fromMidi(x));
      const clef = m < 60 ? 'bass' : 'treble';
      main.querySelector('#pStaff').innerHTML = Staff.render({ clef, items: notes.map((n) => ({ type: 'note', notes: [n], dur: 'w' })), labels: true, scale: 1.1 });
    }
    render('all');
    main.querySelector('#pLabels').addEventListener('change', (e) => render(e.target.value));

    const MAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, z: 8, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, 'ö': 16, ';': 16 };
    let base = 60;
    const down = new Set();
    const kd = (e) => {
      if (e.target.closest('input, select, textarea')) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        base = Math.max(48, Math.min(72, base + (e.key === 'ArrowLeft' ? -12 : 12)));
        main.querySelector('#pOct').textContent = 'Tastatur-Oktave: ' + T.helmholtz(T.fromMidi(base));
        e.preventDefault();
        return;
      }
      const k = e.key.toLowerCase();
      if (!(k in MAP) || down.has(k) || e.metaKey || e.ctrlKey || e.altKey) return;
      down.add(k);
      const m = base + MAP[k];
      if (m > 84) return;
      Sound.play(m, { stopPrev: false, dur: 1.2 });
      piano.press(m);
      onPress(m);
    };
    const ku = (e) => down.delete(e.key.toLowerCase());
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    cleanups.push(() => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); });
  }

  // ---------------------------------------------------------------- Quintenzirkel
  const CIRCLE_MAJ = ['C', 'G', 'D', 'A', 'E', 'H', 'Fis/Ges', 'Des', 'As', 'Es', 'B', 'F'];
  const CIRCLE_MIN = ['a', 'e', 'h', 'fis', 'cis', 'gis', 'dis/es', 'b', 'f', 'c', 'g', 'd'];
  const SIG = ['0', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯/6♭', '5♭', '4♭', '3♭', '2♭', '1♭'];

  function circleSvg(sel) {
    const cx = 200, cy = 200;
    const arc = (r1, r2, a0, a1) => {
      const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0);
      return `M${x1},${y1} A${r2},${r2} 0 0 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 0 0 ${x4},${y4} Z`;
    };
    let s = `<svg class="circle-svg" viewBox="0 0 400 400" role="img" aria-label="Quintenzirkel">`;
    for (let i = 0; i < 12; i++) {
      const a0 = (i * 30 - 105) * Math.PI / 180, a1 = (i * 30 - 75) * Math.PI / 180, am = (i * 30 - 90) * Math.PI / 180;
      const selMaj = sel && !sel.minor && sel.i === i, selMin = sel && sel.minor && sel.i === i;
      s += `<path class="seg major${selMaj ? ' sel' : ''}" data-i="${i}" data-m="0" d="${arc(128, 192, a0, a1)}"/>`;
      s += `<path class="seg minor${selMin ? ' sel' : ''}" data-i="${i}" data-m="1" d="${arc(78, 128, a0, a1)}"/>`;
      const tx = (r) => cx + r * Math.cos(am), ty = (r) => cy + r * Math.sin(am);
      const long = CIRCLE_MAJ[i].length > 3;
      s += `<text x="${tx(166)}" y="${ty(166)}" text-anchor="middle" dominant-baseline="central" font-size="${long ? 13 : 18}" font-weight="700"${selMaj ? ' class="sel"' : ''}>${CIRCLE_MAJ[i]}</text>`;
      s += `<text x="${tx(142)}" y="${ty(142)}" text-anchor="middle" dominant-baseline="central" font-size="10" opacity=".7"${selMaj ? ' class="sel"' : ''}>${SIG[i]}</text>`;
      s += `<text x="${tx(103)}" y="${ty(103)}" text-anchor="middle" dominant-baseline="central" font-size="${long ? 11 : 14}"${selMin ? ' class="sel"' : ''}>${CIRCLE_MIN[i]}</text>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="76" style="fill:var(--bg);stroke:var(--line)"/>`;
    s += `<text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="11" opacity=".7">♯ im Uhrzeigersinn</text>`;
    s += `<text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="11" opacity=".7">♭ gegen den Uhrzeigersinn</text>`;
    s += '</svg>';
    return s;
  }

  function keyInfo(k, minor) {
    const tonic = minor ? T.minorTonic(k) : T.majorTonic(k);
    const sc = T.scale(tonic, minor ? 'minor' : 'major');
    const chords = T.diatonicChords(k, { minor });
    const main = minor ? [0, 3, 4] : [0, 3, 4];
    const harmV = minor ? T.chord(chords[4].root, 'maj') : null;
    const name = T.keyName(k, minor);
    const rel = T.keyName(k, !minor);
    const kSub = k - 1, kDom = k + 1;
    const nb = (kk) => (kk >= -7 && kk <= 7) ? T.keyName(kk, minor) : '–';
    let html = `<h2 style="margin-top:0">${name}</h2>
      <p><b>Vorzeichen:</b> ${T.sigText(k)}${k ? ' (' + T.keySigNames(k).join(', ') + ')' : ''}<br>
      <b>Paralleltonart:</b> ${rel}<br>
      <b>Nachbarn:</b> ${nb(kSub)} (Subdominant-Tonart) · ${nb(kDom)} (Dominant-Tonart)</p>
      ${Staff.render({ keySig: k, items: sc.map((n) => ({ type: 'note', notes: [n], dur: 'w', showAcc: false, label: T.name(n) })), spacing: 34, scale: 1 })}
      <div class="btn-row" style="margin:8px 0"></div>
      <p class="small muted">Hauptakkorde: ${main.map((d) => `${chords[d].roman} = <b>${chords[d].symbol}</b>`).join(' · ')}${minor ? ` · V (harmonisch) = <b>${T.chordSymbol(chords[4].root, 'maj')}</b>` : ''}</p>`;
    const el = h(html);
    const row = el.querySelector('.btn-row');
    const b1 = document.createElement('button');
    b1.className = 'btn play-btn'; b1.textContent = '▶ Tonleiter';
    b1.onclick = () => Sound.play(sc.map(T.midi), { gap: 0.3 });
    const b2 = document.createElement('button');
    b2.className = 'btn play-btn'; b2.textContent = minor ? '▶ Kadenz i–iv–V–i' : '▶ Kadenz I–IV–V–I';
    const tm = T.midi(tonic) % 12 + 48;
    b2.onclick = () => Sound.progression(Exercises.voiceProgression(tm, [0, 3, 4, 0], minor));
    row.append(b1, b2);
    return el;
  }

  function circleInto(el, { compact = false } = {}) {
    const wrap = document.createElement('div');
    wrap.className = compact ? 'example circle-wrap' : 'circle-wrap';
    let sel = { i: 0, minor: false, flat6: false };
    const left = document.createElement('div');
    left.style.flex = '1 1 300px';
    left.style.maxWidth = '440px';
    const info = document.createElement('div');
    info.className = 'circle-info';
    wrap.append(left, info);
    const draw = () => {
      left.innerHTML = circleSvg(sel);
      let k = sel.i <= 6 ? sel.i : sel.i - 12;
      if (sel.i === 6 && sel.flat6) k = -6;
      info.innerHTML = '';
      info.appendChild(keyInfo(k, sel.minor));
      if (sel.i === 6) {
        const b = document.createElement('button');
        b.className = 'btn play-btn';
        b.textContent = sel.flat6 ? 'Enharmonisch: ♯-Schreibweise zeigen' : 'Enharmonisch: ♭-Schreibweise zeigen';
        b.onclick = () => { sel.flat6 = !sel.flat6; draw(); };
        info.appendChild(b);
      }
      left.querySelectorAll('.seg').forEach((p) => p.addEventListener('click', () => {
        const i = +p.dataset.i, minor = p.dataset.m === '1';
        if (sel.i === i && sel.minor === minor && i === 6) sel.flat6 = !sel.flat6;
        sel = { i, minor, flat6: sel.flat6 && i === 6 };
        draw();
        const k = i <= 6 ? i : i - 12;
        const t = minor ? T.minorTonic(sel.flat6 ? -6 : k) : T.majorTonic(sel.flat6 ? -6 : k);
        Sound.play(T.chord(t, minor ? 'min' : 'maj').map(T.midi), { mode: 'chord' });
      }));
    };
    draw();
    el.replaceWith(wrap);
  }

  function quintenzirkel(main) {
    main.innerHTML = `<h1>⭕ Quintenzirkel</h1><p class="muted">Außen: Dur-Tonarten, innen: parallele Moll-Tonarten. Klicke auf ein Feld.</p><div id="circ"></div>`;
    circleInto(main.querySelector('#circ'));
  }

  // ---------------------------------------------------------------- Akkord-Explorer
  function akkorde(main) {
    const typeOpts = Object.entries(T.CHORDS).map(([k, c]) => `<option value="${k}">${c.name}${c.sym ? ' (' + c.sym + ')' : ''}</option>`).join('');
    const keyOpts = (() => { let s = ''; for (let k = -7; k <= 7; k++) s += `<option value="${k}"${k === 0 ? ' selected' : ''}>${T.keyName(k)} / ${T.keyName(k, true)}</option>`; return s; })();
    main.innerHTML = `
      <h1>🎶 Akkord-Explorer</h1>
      <div class="card">
        <h2 style="margin-top:0">Akkord bauen</h2>
        <div class="tool-row">
          <label>Grundton <select id="cRoot">${rootOptions('C')}</select></label>
          <label>Art <select id="cType">${typeOpts}</select></label>
          <label>Stellung <select id="cInv"></select></label>
        </div>
        <div id="cOut"></div>
      </div>
      <div class="card" style="margin-top:20px">
        <h2 style="margin-top:0">Stufenakkorde einer Tonart</h2>
        <div class="tool-row">
          <label>Tonart <select id="kKey">${keyOpts}</select></label>
          <label>Geschlecht <select id="kMode"><option value="major">Dur</option><option value="minor">Moll (natürlich)</option><option value="harmonic">Moll (harmonisch)</option></select></label>
          <label><input type="checkbox" id="kSev" /> Septakkorde</label>
        </div>
        <div id="kOut"></div>
      </div>`;
    const $ = (s) => main.querySelector(s);
    const invNames3 = ['Grundstellung', 'Sextakkord (1. Umk.)', 'Quartsextakkord (2. Umk.)'];
    const invNames4 = ['Grundstellung', 'Quintsextakkord (1. Umk.)', 'Terzquartakkord (2. Umk.)', 'Sekundakkord (3. Umk.)'];
    const fillInv = () => {
      const n = T.CHORDS[$('#cType').value].ivs.length;
      const cur = +$('#cInv').value || 0;
      $('#cInv').innerHTML = (n === 4 ? invNames4 : invNames3).map((x, i) => `<option value="${i}"${i === cur && i < n ? ' selected' : ''}>${x}</option>`).join('');
    };
    const draw = () => {
      const root = T.parse($('#cRoot').value + '4');
      if (T.dia(root) > 31) root.octave = 3;
      const type = $('#cType').value;
      const inv = +$('#cInv').value || 0;
      const notes = T.chord(root, type, inv);
      const base = T.chord(root, type);
      const rows = base.map((n, i) => `<tr><td>${['Grundton', 'Terz', 'Quinte', 'Septime'][i] || ''}${type.startsWith('sus') && i === 1 ? (type === 'sus2' ? ' (Sekunde)' : ' (Quarte)') : ''}</td><td><b>${T.name(n)}</b></td><td>${i ? T.ivName(T.between(base[0], n)) : '–'}</td></tr>`).join('');
      const out = $('#cOut');
      out.innerHTML = `<p style="font-size:1.3rem"><b>${T.chordSymbol(root, type)}</b> – ${T.CHORDS[type].name}: ${notes.map(T.name).join(' – ')}</p>
        <div class="grid grid-2"><div>${Staff.render({ items: [{ type: 'note', notes, dur: 'w' }], labels: true, scale: 1.4 })}</div>
        <div class="table-wrap"><table class="lesson-table" style="border-collapse:collapse"><tr><th>Ton</th><th>Name</th><th>Intervall zum Grundton</th></tr>${rows}</table></div></div>
        <div id="cPiano"></div><div class="btn-row"></div>`;
      out.querySelectorAll('th,td').forEach((c) => { c.style.border = '1px solid var(--line)'; c.style.padding = '5px 10px'; });
      const p = Piano(out.querySelector('#cPiano'), { from: 48, to: 84, labels: 'c', small: true });
      p.highlight(notes.map(T.midi));
      const row = out.querySelector('.btn-row');
      [['▶ Akkord', 'chord'], ['▶ Gebrochen', 'arp']].forEach(([t, mode]) => {
        const b = document.createElement('button'); b.className = 'btn play-btn'; b.textContent = t;
        b.onclick = () => Sound.play(notes.map(T.midi), { mode, gap: 0.3 });
        row.appendChild(b);
      });
      Sound.play(notes.map(T.midi), { mode: 'chord' });
    };
    const drawKey = () => {
      const k = +$('#kKey').value;
      const mode = $('#kMode').value;
      const minor = mode !== 'major';
      const sev = $('#kSev').checked;
      const chords = T.diatonicChords(k, { minor, sevenths: sev, scaleType: mode === 'harmonic' ? 'harmonic' : undefined });
      const funcs = minor ? ['t', '–', 'tP', 's', mode === 'harmonic' ? 'D' : 'd', 'sP', mode === 'harmonic' ? 'D̸⁷' : 'dP'] : T.FUNCS_MAJOR;
      const out = $('#kOut');
      out.innerHTML = `<p><b>${T.keyName(k, minor)}</b>${mode === 'harmonic' ? ' (harmonisch)' : ''}</p>` +
        Staff.render({ items: chords.map((c) => ({ type: 'note', notes: c.notes, dur: 'w', label: c.roman })), spacing: 54, scale: 1.15 }) +
        `<div class="table-wrap"><table class="deg-table" style="border-collapse:collapse;margin-top:8px"><tr><th>Stufe</th>${chords.map((c) => `<td>${c.roman}</td>`).join('')}</tr>
         <tr><th>Akkord</th>${chords.map((c) => `<td><b>${c.symbol}</b></td>`).join('')}</tr>
         <tr><th>Funktion</th>${funcs.map((f) => `<td>${f}</td>`).join('')}</tr>
         <tr><th></th>${chords.map((c, i) => `<td><button class="btn play-btn" data-i="${i}">▶</button></td>`).join('')}</tr></table></div>`;
      out.querySelectorAll('th,td').forEach((c) => { c.style.border = '1px solid var(--line)'; c.style.padding = '5px 8px'; c.style.textAlign = 'center'; });
      out.querySelectorAll('button[data-i]').forEach((b) => b.onclick = () => Sound.play(chords[+b.dataset.i].notes.map(T.midi), { mode: 'chord' }));
    };
    $('#cType').addEventListener('change', () => { fillInv(); draw(); });
    $('#cRoot').addEventListener('change', draw);
    $('#cInv').addEventListener('change', draw);
    ['#kKey', '#kMode', '#kSev'].forEach((s) => $(s).addEventListener('change', drawKey));
    fillInv();
    draw();
    drawKey();
    Sound.stop();
  }

  // ---------------------------------------------------------------- Tonleiter-Explorer
  function tonleitern(main) {
    const groups = [
      ['Dur & Moll', ['major', 'minor', 'harmonic', 'melodic']],
      ['Kirchentonarten', ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian']],
      ['Weitere', ['pentaMajor', 'pentaMinor', 'blues', 'whole']],
    ];
    const typeOpts = groups.map(([g, ts]) => `<optgroup label="${g}">${ts.map((t) => `<option value="${t}">${T.SCALES[t].name}</option>`).join('')}</optgroup>`).join('');
    main.innerHTML = `
      <h1>🪜 Tonleiter-Explorer</h1>
      <div class="card">
        <div class="tool-row">
          <label>Grundton <select id="sRoot">${rootOptions('C')}</select></label>
          <label>Tonleiter <select id="sType">${typeOpts}</select></label>
          <label>Tempo <input type="range" id="sSpeed" min="0.15" max="0.7" step="0.05" value="0.35" style="direction:rtl" /></label>
        </div>
        <div id="sOut"></div>
      </div>`;
    const $ = (s) => main.querySelector(s);
    const draw = (play) => {
      const root = T.parse($('#sRoot').value + '4');
      if (T.dia(root) > 32) root.octave = 3;
      const type = $('#sType').value;
      const sc = T.scale(root, type);
      const steps = [];
      for (let i = 1; i < sc.length; i++) { const s = T.midi(sc[i]) - T.midi(sc[i - 1]); steps.push(s === 1 ? 'HT' : s === 2 ? 'GT' : s === 3 ? '1½' : s); }
      const maxAcc = Math.max(...sc.map((n) => Math.abs(n.acc)));
      const out = $('#sOut');
      const k = (type === 'major' || type === 'ionian') ? T.fifthsOf(root) : (type === 'minor' || type === 'aeolian') ? T.fifthsOf(root, true) : null;
      out.innerHTML = `<p style="font-size:1.2rem"><b>${T.name(root)} ${T.SCALES[type].name}</b>: ${sc.map(T.name).join(' – ')}</p>
        <p class="muted">Bauplan: ${steps.join(' – ')} &nbsp;·&nbsp; Formel: ${T.SCALES[type].ivs.map((iv) => { const p = T.ivParse(iv); return (p.q === 'm' || p.q === 'd' ? '♭' : p.q === 'A' ? '♯' : '') + p.num; }).join(' ')}</p>
        ${maxAcc > 1 ? '<div class="warn-box">Diese Tonleiter braucht Doppelvorzeichen – in der Praxis wählt man meist die enharmonisch verwechselte Tonart.</div>' : ''}
        ${k !== null && k !== undefined ? `<p class="small">Generalvorzeichen: ${T.sigText(k)}${k ? ' (' + T.keySigNames(k).join(', ') + ')' : ''}</p>` : ''}
        ${Staff.render({ items: sc.map((n, i) => ({ type: 'note', notes: [n], dur: 'w', label: String(i + 1) })), spacing: 38, scale: 1.25 })}
        <div id="sPiano"></div><div class="btn-row"></div>`;
      const p = Piano(out.querySelector('#sPiano'), { from: 48, to: 84, labels: 'c', small: true });
      p.highlight(sc.map(T.midi));
      const row = out.querySelector('.btn-row');
      const mk = (t, fn) => { const b = document.createElement('button'); b.className = 'btn play-btn'; b.textContent = t; b.onclick = fn; row.appendChild(b); };
      const gap = () => +$('#sSpeed').value;
      mk('▶ Aufwärts', () => Sound.play(sc.map(T.midi), { gap: gap() }));
      mk('▶ Ab- und aufwärts', () => { const m = sc.map(T.midi); Sound.play([...m, ...m.slice(0, -1).reverse()], { gap: gap() }); });
      if (play) Sound.play(sc.map(T.midi), { gap: gap() });
    };
    $('#sRoot').addEventListener('change', () => draw(true));
    $('#sType').addEventListener('change', () => draw(true));
    draw(false);
  }

  // ---------------------------------------------------------------- Metronom
  const TEMPO_TERMS = [[40, 'Grave'], [55, 'Largo'], [70, 'Adagio'], [90, 'Andante'], [112, 'Moderato'], [150, 'Allegro'], [175, 'Vivace'], [999, 'Presto']];
  function metronom(main) {
    main.innerHTML = `
      <h1>⏱️ Metronom</h1>
      <div class="card" style="max-width:520px">
        <div class="metro-big"><span id="mBpm">90</span> <span style="font-size:1rem;font-weight:400" class="muted">BPM</span></div>
        <div style="text-align:center" class="muted" id="mTerm">Andante</div>
        <input type="range" id="mSlider" min="30" max="240" value="90" style="width:100%;margin:14px 0" aria-label="Tempo" />
        <div class="beats" id="mBeats"></div>
        <div class="tool-row" style="justify-content:center">
          <button class="btn" id="mMinus">−5</button>
          <button class="btn primary" id="mStart" style="min-width:120px">▶ Start</button>
          <button class="btn" id="mPlus">+5</button>
        </div>
        <div class="tool-row" style="justify-content:center">
          <label>Taktart <select id="mBeatsSel"><option value="2">2/4</option><option value="3">3/4</option><option value="4" selected>4/4</option><option value="6">6/8</option><option value="1">ohne Betonung</option></select></label>
          <button class="btn" id="mTap">Tap-Tempo</button>
        </div>
      </div>`;
    const $ = (s) => main.querySelector(s);
    let bpm = 90, beats = 4, running = false, timer = null, next = 0, beat = 0;
    const termOf = (b) => TEMPO_TERMS.find(([lim]) => b < lim)[1];
    const setBpm = (b) => { bpm = Math.max(30, Math.min(240, Math.round(b))); $('#mBpm').textContent = bpm; $('#mSlider').value = bpm; $('#mTerm').textContent = termOf(bpm); };
    const drawBeats = () => { $('#mBeats').innerHTML = Array.from({ length: beats }, (_, i) => `<span${i === 0 ? ' class="first-b"' : ''}></span>`).join(''); };
    const visual = (i, when) => {
      const delay = Math.max(0, (when - Sound.ctx.currentTime) * 1000);
      setTimeout(() => {
        const spans = $('#mBeats')?.children;
        if (!spans) return;
        [...spans].forEach((s, j) => { s.classList.toggle('on', j === i); s.classList.toggle('first', j === 0 && beats > 1); });
      }, delay);
    };
    const tick = () => {
      const ctx = Sound.ctx;
      // 6/8: Achtel-Puls, BPM bezieht sich auf punktierte Viertel → 3 Klicks pro Schlag
      const spb = beats === 6 ? 60 / bpm / 3 : 60 / bpm;
      while (next < ctx.currentTime + 0.12) {
        const accent = beats > 1 && (beat === 0 || (beats === 6 && beat === 3));
        Sound.click(accent, next);
        visual(beat, next);
        next += spb;
        beat = (beat + 1) % beats;
      }
    };
    const start = () => { Sound.ensure(); running = true; beat = 0; next = Sound.ctx.currentTime + 0.05; tick(); timer = setInterval(tick, 25); $('#mStart').textContent = '■ Stopp'; };
    const stop = () => { running = false; clearInterval(timer); $('#mStart') && ($('#mStart').textContent = '▶ Start'); };
    $('#mStart').onclick = () => running ? stop() : start();
    $('#mSlider').oninput = (e) => setBpm(+e.target.value);
    $('#mMinus').onclick = () => setBpm(bpm - 5);
    $('#mPlus').onclick = () => setBpm(bpm + 5);
    $('#mBeatsSel').onchange = (e) => { beats = +e.target.value; beat = 0; drawBeats(); };
    let taps = [];
    $('#mTap').onclick = () => {
      const now = performance.now();
      taps = taps.filter((t) => now - t < 2500);
      taps.push(now);
      if (taps.length >= 2) {
        const d = (taps[taps.length - 1] - taps[0]) / (taps.length - 1);
        setBpm(60000 / d);
      }
    };
    drawBeats();
    setBpm(90);
    cleanups.push(stop);
  }

  const RENDER = { klavier, quintenzirkel, akkorde, tonleitern, metronom };
  function render(id, main) {
    cleanup();
    (RENDER[id] || klavier)(main);
  }

  return { TOOLS, render, cleanup, circleInto };
})();
