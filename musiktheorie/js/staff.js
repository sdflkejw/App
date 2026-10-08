'use strict';
/*
 * Notensatz als SVG.
 * Staff.render({ clef, keySig, time, items, labels, spacing })
 *   items: { type:'note', notes:[ton…], dur:'w'|'h'|'q'|'8'|'16', dots, label, color }
 *          { type:'rest', dur, dots } | { type:'bar' } | { type:'end' } | { type:'q' } (Fragezeichen)
 * Staff.parseSeq('C4 E4:q G4:h. | C4+E4+G4:w ||') erzeugt items.
 */
const Staff = (() => {
  const T = Theory;
  const SP = 10;                 // Linienabstand
  const TOP = 50;                // y der obersten Linie
  const BOTTOM = TOP + 4 * SP;   // y der untersten Linie
  const MID = TOP + 2 * SP;
  const REF = { treble: 30, bass: 18, alto: 24 };   // diatonische Position der untersten Linie (E4, G2, F3)
  const SIG_SHIFT = { treble: 0, bass: -14, alto: -7 };
  const SHARP_POS = [38, 35, 39, 36, 33, 37, 34];
  const FLAT_POS = [34, 37, 33, 36, 32, 35, 31];
  const MUSIC_FONT = "'Noto Music', 'Bravura Text', 'Segoe UI Symbol', serif";

  const yOf = (d, clef) => BOTTOM - (d - REF[clef]) * SP / 2;
  const onLine = (d, clef) => T.mod(d - REF[clef], 2) === 0;

  function clefSvg(clef, x) {
    if (clef === 'treble') return `<text x="${x}" y="${TOP + 3 * SP}" font-size="${4 * SP}" font-family="${MUSIC_FONT}" class="glyph">𝄞</text>`;
    if (clef === 'bass') return `<text x="${x}" y="${TOP + SP}" font-size="${4 * SP}" font-family="${MUSIC_FONT}" class="glyph">𝄢</text>`;
    return `<text x="${x}" y="${MID}" font-size="${4 * SP}" font-family="${MUSIC_FONT}" class="glyph">𝄡</text>`;
  }

  function flatPath(x, y) {
    return `<line x1="${x - 3}" y1="${y - 14}" x2="${x - 3}" y2="${y + 5}" stroke="currentColor" stroke-width="1.3" />` +
      `<path d="M${x - 3.6},${y + 5.2} c4,-2.2 7.6,-4.6 7,-7.6 c-0.5,-2.6 -4,-2.6 -7,0.2 l0,1.8 c2.4,-2 4.6,-2.2 4.9,-0.6 c0.4,2 -2.4,4.4 -4.9,5.8 z" />`;
  }

  function accSvg(acc, x, y) {
    const th = 'stroke="currentColor" fill="none"';
    switch (acc) {
      case 1: return `<g ${th}><line x1="${x - 2.2}" y1="${y - 8.5}" x2="${x - 2.2}" y2="${y + 10}" stroke-width="1.1" />` +
        `<line x1="${x + 2.2}" y1="${y - 10}" x2="${x + 2.2}" y2="${y + 8.5}" stroke-width="1.1" />` +
        `<line x1="${x - 4.8}" y1="${y - 1.4}" x2="${x + 4.8}" y2="${y - 4.4}" stroke-width="2.4" />` +
        `<line x1="${x - 4.8}" y1="${y + 4.4}" x2="${x + 4.8}" y2="${y + 1.4}" stroke-width="2.4" /></g>`;
      case -1: return flatPath(x + 1, y);
      case -2: return flatPath(x - 2.5, y) + flatPath(x + 4, y);
      case 0: return `<g ${th}><line x1="${x - 2.6}" y1="${y - 10}" x2="${x - 2.6}" y2="${y + 4.5}" stroke-width="1.1" />` +
        `<line x1="${x + 2.6}" y1="${y - 4.5}" x2="${x + 2.6}" y2="${y + 10}" stroke-width="1.1" />` +
        `<line x1="${x - 2.6}" y1="${y - 1.2}" x2="${x + 2.6}" y2="${y - 3.4}" stroke-width="2.2" />` +
        `<line x1="${x - 2.6}" y1="${y + 3.4}" x2="${x + 2.6}" y2="${y + 1.2}" stroke-width="2.2" /></g>`;
      case 2: return `<g ${th} stroke-width="1.6" stroke-linecap="round"><line x1="${x - 3.2}" y1="${y - 3.2}" x2="${x + 3.2}" y2="${y + 3.2}" />` +
        `<line x1="${x - 3.2}" y1="${y + 3.2}" x2="${x + 3.2}" y2="${y - 3.2}" /></g>` +
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => `<rect x="${x + a * 3.4 - 1.6}" y="${y + b * 3.4 - 1.6}" width="3.2" height="3.2" />`).join('');
      default: return '';
    }
  }

  function timeSvg([a, b], x) {
    const st = `font-size="${2.5 * SP}" font-weight="700" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle" dominant-baseline="central"`;
    if (a === 'C') return `<text x="${x}" y="${MID}" ${st}>𝄴</text>`;
    return `<text x="${x}" y="${TOP + SP + 1}" ${st}>${a}</text><text x="${x}" y="${TOP + 3 * SP + 1}" ${st}>${b}</text>`;
  }

  function headSvg(cx, cy, dur) {
    if (dur === 'w') {
      return `<ellipse cx="${cx}" cy="${cy}" rx="7.6" ry="5" />` +
        `<ellipse cx="${cx}" cy="${cy}" rx="2.6" ry="4.1" transform="rotate(-55 ${cx} ${cy})" style="fill:var(--staff-bg)" />`;
    }
    const outer = `<ellipse cx="${cx}" cy="${cy}" rx="6.6" ry="4.6" transform="rotate(-22 ${cx} ${cy})" />`;
    if (dur === 'h') return outer + `<ellipse cx="${cx}" cy="${cy}" rx="5" ry="2.1" transform="rotate(-28 ${cx} ${cy})" style="fill:var(--staff-bg)" />`;
    return outer;
  }

  function flagSvg(x, y, up, count) {
    let s = '';
    for (let i = 0; i < count; i++) {
      const yy = up ? y + i * 8 : y - i * 8;
      s += up
        ? `<path d="M${x},${yy} c 0.5,7 9,10 8,21 c 0,-7 -4,-11 -8,-13 z" />`
        : `<path d="M${x},${yy} c 0.5,-7 9,-10 8,-21 c 0,7 -4,11 -8,13 z" />`;
    }
    return s;
  }

  function restSvg(dur, cx) {
    switch (dur) {
      case 'w': return `<rect x="${cx - 6}" y="${TOP + SP}" width="12" height="5" />`;
      case 'h': return `<rect x="${cx - 6}" y="${MID - 5}" width="12" height="5" />`;
      case 'q': return `<path d="M${cx - 3},${TOP + 2} l7,9 c-3,3 -4,6 -1,10 l4,6 c-4,-2 -8,-1 -6,4 c1,2 2,3 3,4 c-6,-2 -8,-8 -3,-10 l-6,-7 c3,-3 4,-6 1,-9 z" />`;
      case '8': return `<circle cx="${cx - 3}" cy="${MID - 6}" r="2.8" /><path d="M${cx - 3},${MID - 5} q5,2 8,-3 l-6,${SP * 2 + 2}" stroke="currentColor" stroke-width="1.6" fill="none" />`;
      case '16': return `<circle cx="${cx - 3}" cy="${MID - 6}" r="2.6" /><circle cx="${cx - 5}" cy="${MID + 4}" r="2.6" />` +
        `<path d="M${cx - 3},${MID - 5} q5,2 8,-3 M${cx - 5},${MID + 5} q5,2 8,-3 M${cx + 5},${MID - 8} l-7,${SP * 3}" stroke="currentColor" stroke-width="1.6" fill="none" />`;
      default: return '';
    }
  }

  /** Berechnet Layout eines Noten-Items (Akkord). */
  function layoutNote(it, clef) {
    const ps = [...it.notes].sort((a, b) => T.dia(a) - T.dia(b));
    const ds = ps.map((p) => T.dia(p));
    const ys = ds.map((d) => yOf(d, clef));
    const dur = it.dur || 'w';
    const avg = ys.reduce((a, b) => a + b, 0) / ys.length;
    const far = ys.reduce((a, y) => Math.abs(y - MID) > Math.abs(a - MID) ? y : a, ys[0]);
    const stemUp = it.stem ? it.stem === 'up' : (ps.length > 1 ? far > MID : avg > MID);
    const headW = dur === 'w' ? 15 : 13;
    const offs = ps.map(() => 0);
    if (stemUp || dur === 'w') {
      for (let i = 1; i < ps.length; i++) if (ds[i] - ds[i - 1] === 1 && offs[i - 1] === 0) offs[i] = 1;
    } else {
      for (let i = ps.length - 2; i >= 0; i--) if (ds[i + 1] - ds[i] === 1 && offs[i + 1] === 0) offs[i] = -1;
    }
    // Vorzeichen-Spalten (von oben nach unten)
    const accCols = ps.map(() => -1);
    const placed = [];
    for (let i = ps.length - 1; i >= 0; i--) {
      const show = it.showAcc === false ? false : (ps[i].acc !== 0 || ps[i].natural);
      if (!show) continue;
      let col = 0;
      while (placed.some((pp) => pp.col === col && Math.abs(pp.d - ds[i]) < 6)) col++;
      placed.push({ col, d: ds[i] });
      accCols[i] = col;
    }
    const nCols = placed.length ? Math.max(...placed.map((p) => p.col)) + 1 : 0;
    const leftShift = offs.some((o) => o < 0) ? headW : 0;
    return { ps, ds, ys, dur, stemUp, headW, offs, accCols, nCols, leftShift };
  }

  function render(o = {}) {
    const clef = o.clef || 'treble';
    const items = o.items || [];
    const spacing = o.spacing || 46;
    const parts = [];
    const labels = [];
    let minY = TOP, maxY = BOTTOM;
    let x = 6;

    if (clef !== 'none') {
      parts.push(clefSvg(clef === 'none' ? 'treble' : clef, x));
      x += 36;
    }
    const k = o.keySig || 0;
    if (k) {
      const pos = k > 0 ? SHARP_POS : FLAT_POS;
      for (let i = 0; i < Math.abs(k); i++) {
        parts.push(accSvg(k > 0 ? 1 : -1, x + 5, yOf(pos[i] + SIG_SHIFT[clef], clef)));
        x += 10;
      }
      x += 6;
    }
    if (o.time) { parts.push(timeSvg(o.time, x + 10)); x += 26; }
    x += 12;

    items.forEach((it) => {
      if (it.type === 'bar') {
        parts.push(`<line x1="${x}" y1="${TOP}" x2="${x}" y2="${BOTTOM}" stroke="currentColor" stroke-width="1.2" />`);
        x += 16;
        return;
      }
      if (it.type === 'end') {
        parts.push(`<line x1="${x}" y1="${TOP}" x2="${x}" y2="${BOTTOM}" stroke="currentColor" stroke-width="1.2" />` +
          `<rect x="${x + 4}" y="${TOP}" width="4" height="${4 * SP}" />`);
        x += 12;
        return;
      }
      if (it.type === 'q') {
        parts.push(`<text x="${x + 8}" y="${MID}" font-size="28" font-weight="700" text-anchor="middle" dominant-baseline="central" class="qmark">?</text>`);
        x += spacing;
        return;
      }
      if (it.type === 'rest') {
        const cx = x + 8;
        parts.push(`<g style="color:${it.color || 'currentColor'}" fill="currentColor">${restSvg(it.dur || 'q', cx)}` +
          (it.dots ? `<circle cx="${cx + 11}" cy="${MID - 5}" r="1.9" />` : '') + '</g>');
        if (it.label) labels.push({ x: cx, text: it.label, color: it.color });
        x += it.w || spacing;
        return;
      }
      // Note / Akkord
      const L = layoutNote(it, clef);
      const accW = L.nCols * 11 + L.leftShift;
      x += accW;
      const cx = x + 8;
      let s = '';
      // Hilfslinien
      const hw = L.dur === 'w' ? 11 : 10;
      const maxOff = Math.max(0, ...L.offs), minOff = Math.min(0, ...L.offs);
      const lx1 = cx - hw + minOff * L.headW, lx2 = cx + hw + maxOff * L.headW;
      const lowY = Math.max(...L.ys), highY = Math.min(...L.ys);
      for (let ly = BOTTOM + SP; ly <= lowY + 0.1; ly += SP) s += `<line x1="${lx1}" y1="${ly}" x2="${lx2}" y2="${ly}" stroke="currentColor" stroke-width="1.2" />`;
      for (let ly = TOP - SP; ly >= highY - 0.1; ly -= SP) s += `<line x1="${lx1}" y1="${ly}" x2="${lx2}" y2="${ly}" stroke="currentColor" stroke-width="1.2" />`;
      // Köpfe, Vorzeichen, Punkte
      L.ps.forEach((p, i) => {
        const hx = cx + L.offs[i] * L.headW;
        const col = (it.colors && it.colors[i]) || null;
        s += col ? `<g style="color:${col}" fill="currentColor">${headSvg(hx, L.ys[i], L.dur)}</g>` : headSvg(hx, L.ys[i], L.dur);
        if (L.accCols[i] >= 0) {
          const ax = cx - 14 - L.leftShift - L.accCols[i] * 11;
          s += accSvg(p.acc, ax, L.ys[i]);
        }
        for (let dd = 0; dd < (it.dots || 0); dd++) {
          const dy = onLine(L.ds[i], clef) ? L.ys[i] - SP / 2 : L.ys[i];
          s += `<circle cx="${cx + 12 + maxOff * L.headW + dd * 6}" cy="${dy}" r="1.9" />`;
        }
      });
      // Hals + Fähnchen
      if (L.dur !== 'w') {
        const sx = L.stemUp ? cx + 6.1 : cx - 6.1;
        const y1 = L.stemUp ? lowY + 1 : highY - 1;
        const y2 = L.stemUp ? Math.min(highY - 3.5 * SP, MID) : Math.max(lowY + 3.5 * SP, MID);
        s += `<line x1="${sx}" y1="${y1}" x2="${sx}" y2="${y2}" stroke="currentColor" stroke-width="1.3" />`;
        const nf = { '8': 1, '16': 2 }[L.dur] || 0;
        if (nf) s += flagSvg(sx, y2, L.stemUp, nf);
        minY = Math.min(minY, y2 - 4);
        maxY = Math.max(maxY, y2 + 4);
      }
      minY = Math.min(minY, highY - 8);
      maxY = Math.max(maxY, lowY + 8);
      parts.push(`<g style="color:${it.color || 'currentColor'}" fill="currentColor">${s}</g>`);
      if (it.label != null) labels.push({ x: cx, text: it.label, color: it.color });
      else if (o.labels) labels.push({ x: cx, text: L.ps.map(T.name).reverse().join('<tspan dy="0"> </tspan>'), stack: L.ps.map(T.name).reverse(), color: it.color });
      x += (it.w || spacing) + (it.dots ? 6 : 0) + Math.max(0, ...L.offs) * L.headW;
    });

    const width = Math.max(x + 6, o.minWidth || 0);
    let labelSvg = '';
    if (labels.length) {
      const ly = maxY + 20;
      labels.forEach((l) => {
        if (l.stack && l.stack.length > 1) {
          l.stack.forEach((t, i) => {
            labelSvg += `<text x="${l.x}" y="${ly + i * 15}" class="slabel" text-anchor="middle"${l.color ? ` style="fill:${l.color}"` : ''}>${t}</text>`;
          });
          maxY = Math.max(maxY, ly + (l.stack.length - 1) * 15 + 6);
        } else {
          const t = l.stack ? l.stack[0] : l.text;
          labelSvg += `<text x="${l.x}" y="${ly}" class="slabel" text-anchor="middle"${l.color ? ` style="fill:${l.color}"` : ''}>${t}</text>`;
        }
      });
      maxY = Math.max(maxY, ly + 6);
    }

    const lines = [0, 1, 2, 3, 4].map((i) => `<line x1="2" y1="${TOP + i * SP}" x2="${width - 2}" y2="${TOP + i * SP}" />`).join('');
    const y0 = Math.min(minY, TOP - 2 * SP) - 8;
    const h = Math.max(maxY, BOTTOM + 2 * SP) + 10 - y0;
    const scale = o.scale || 1.25;
    return `<svg class="staff" xmlns="http://www.w3.org/2000/svg" viewBox="0 ${y0} ${width} ${h}" width="${width * scale}" height="${h * scale}" role="img" aria-label="${o.aria || 'Notenbeispiel'}">` +
      `<g class="lines" stroke="currentColor" stroke-width="1">${lines}<line x1="2" y1="${TOP}" x2="2" y2="${BOTTOM}" /></g>` +
      `<g fill="currentColor">${parts.join('')}</g>${labelSvg}</svg>`;
  }

  const DUR_TOKENS = { w: 'w', h: 'h', q: 'q', '8': '8', '16': '16' };
  /** Kurzschreibweise → items. Bsp.: "C4:q D4:8. r:16 | C4+E4+G4:h ||" */
  function parseSeq(str, defDur = 'w') {
    return str.trim().split(/\s+/).filter(Boolean).map((tok) => {
      if (tok === '|') return { type: 'bar' };
      if (tok === '||') return { type: 'end' };
      if (tok === '?') return { type: 'q' };
      let dots = 0;
      while (tok.endsWith('.')) { dots++; tok = tok.slice(0, -1); }
      const [head, d] = tok.split(':');
      const dur = DUR_TOKENS[d] || defDur;
      if (head === 'r') return { type: 'rest', dur, dots };
      return { type: 'note', notes: head.split('+').map(T.parse), dur, dots };
    });
  }

  return { render, parseSeq, yOf, SP, TOP, BOTTOM };
})();
