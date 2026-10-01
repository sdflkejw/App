'use strict';
/*
 * Übungen: Jede Übung hat gen(level) → Frage-Objekt:
 *  { prompt, staff?, piano?, audio?, options?, answer?, input?: 'choice'|'piano'|'sequence',
 *    pianoAnswer?, exact?, seq?, explain, reveal?, onReveal?, keepOrder? }
 */
const Exercises = (() => {
  const T = Theory;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const chance = (p) => Math.random() < p;
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fromDia = (d, acc = 0) => T.note(T.mod(d, 7), acc, Math.floor(d / 7));
  const NATURALS = ['C', 'D', 'E', 'F', 'G', 'A', 'H'];
  const REF = { treble: 30, bass: 18 };
  const noteItem = (notes, extra = {}) => ({ type: 'note', notes: Array.isArray(notes) ? notes : [notes], dur: 'w', ...extra });
  const maxAbsAcc = (notes) => Math.max(...notes.map((n) => Math.abs(n.acc)));
  const join = (notes) => notes.map(T.name).join(' – ');
  const fmtBeats = (q) => ({ 0.25: '¼', 0.5: '½', 0.75: '¾', 1.5: '1½', 2.5: '2½', 3.5: '3½', 1.25: '1¼', 1.75: '1¾', 2.25: '2¼', 2.75: '2¾', 3.25: '3¼', 3.75: '3¾' }[q] || String(q));

  /** Optionen zusammenstellen: Antwort + bis zu n−1 eindeutige Ablenker. */
  function makeOptions(answer, distractors, n = 6) {
    const uniq = [...new Set(distractors.filter((d) => d !== answer))];
    return shuffle([answer, ...shuffle(uniq).slice(0, n - 1)]);
  }

  /** Plausible falsche Schreibweisen zu einem Ton (bevorzugt: enharmonische Verwechslung). */
  function spellDistractors(ans, maxAcc = 1) {
    const lim = Math.max(maxAcc, Math.abs(ans.acc));
    const first = [], rest = [];
    const pcAns = T.pc(ans);
    for (const dl of [-1, 1]) {
      const letter = T.mod(ans.letter + dl, 7);
      const acc = T.mod(pcAns - T.STEP_SEMI[letter] + 6, 12) - 6;
      if (Math.abs(acc) <= Math.min(2, lim + 1)) first.push(T.name(T.note(letter, acc)));
    }
    for (let a = -lim; a <= lim; a++) if (a !== ans.acc) first.push(T.name(T.note(ans.letter, a)));
    for (const dl of [-1, 1]) for (let a = -1; a <= 1; a++) rest.push(T.name(T.note(T.mod(ans.letter + dl, 7), a)));
    return { first: shuffle([...new Set(first)]), rest: shuffle([...new Set(rest)]) };
  }
  function spellOptions(ans, n = 6, maxAcc = 1) {
    const { first, rest } = spellDistractors(ans, maxAcc);
    const a = T.name(ans);
    const list = [...new Set([...first, ...rest])].filter((x) => x !== a);
    return shuffle([a, ...list.slice(0, n - 1)]);
  }

  function posText(d, clef) {
    const off = d - REF[clef];
    if (off >= 0 && off <= 8) return off % 2 === 0 ? `auf der ${off / 2 + 1}. Linie` : `im ${(off + 1) / 2}. Zwischenraum`;
    if (off < 0) {
      const k = -off;
      if (k === 1) return 'direkt unter dem System';
      return k % 2 === 0 ? `auf der ${k / 2}. Hilfslinie unten` : `unter der ${(k - 1) / 2}. Hilfslinie`;
    }
    const k = off - 8;
    if (k === 1) return 'direkt über dem System';
    return k % 2 === 0 ? `auf der ${k / 2}. Hilfslinie oben` : `über der ${(k - 1) / 2}. Hilfslinie`;
  }

  // ---------- Intervall-Hilfen ----------
  const IV_L0 = ['m2', 'M2', 'm3', 'M3', 'P4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];
  const IV_L1 = [...IV_L0, 'A4', 'd5', 'P1'];
  const IV_L2 = [...IV_L1, 'A2', 'A5', 'A6', 'd4', 'd7', 'd3', 'A1'];
  const ivLabel = (s) => T.ivNameCap(s);
  const refQuality = (num) => T.isPerfectNum(num) ? 'P' : 'M';

  function randomInterval(level, { maxNum = 8 } = {}) {
    const set = [IV_L0, IV_L1, IV_L2][level].filter((s) => T.ivParse(s).num <= maxNum);
    for (let tries = 0; tries < 200; tries++) {
      const iv = pick(set);
      const acc = level === 0 ? 0 : (chance(0.35) ? pick([-1, 1]) : 0);
      const lower = T.note(rnd(0, 6), acc, 4);
      if (T.dia(lower) > 33) lower.octave = 3;
      const upper = T.transpose(lower, iv);
      const lim = level === 2 ? 2 : 1;
      if (Math.abs(upper.acc) <= lim && T.dia(upper) <= 43 && T.dia(lower) >= 24) return { iv, lower, upper };
    }
    return { iv: 'M3', lower: T.parse('C4'), upper: T.parse('E4') };
  }

  function intervalExplain(lower, upper) {
    const iv = T.between(lower, upper);
    const semis = T.midi(upper) - T.midi(lower);
    const letters = [];
    for (let d = T.dia(lower); d <= T.dia(upper); d++) letters.push(T.DE[T.mod(d, 7)]);
    const ref = T.transpose(lower, { q: refQuality(iv.num), num: iv.num });
    let s = `<b>${T.name(lower)} – ${T.name(upper)}</b> ist eine <b>${T.ivName(iv)}</b> (${semis} Halbtöne).<br>`;
    s += `Zahl: ${letters.join('–')} = ${iv.num} Stammtöne → ${T.IV_NAMES[iv.num - 1]}. `;
    if (iv.num <= 8) s += `In ${T.name(lower)}-Dur wäre es ${T.name(ref)} (${T.ivName({ q: refQuality(iv.num), num: iv.num })}).`;
    return s;
  }

  function intervalDistractors(ivs) {
    const iv = T.ivParse(ivs);
    const semis = T.ivSemis(iv);
    const out = [];
    const quals = T.isPerfectNum(iv.num) ? ['P', 'A', 'd'] : ['M', 'm', 'A', 'd'];
    quals.forEach((q) => out.push(q + iv.num));
    [...IV_L2].forEach((s) => { const d = Math.abs(T.ivSemis(s) - semis); if (d <= 1 && s !== ivs) out.push(s); });
    if (iv.num > 1) out.push(pick(['M', 'm', 'P']) + (iv.num - 1));
    return out.filter((s) => { try { const p = T.ivParse(s); return p.num >= 1 && !(T.isPerfectNum(p.num) && (p.q === 'M' || p.q === 'm')) && !(!T.isPerfectNum(p.num) && p.q === 'P') && T.ivSemis(p) >= 0; } catch (e) { return false; } });
  }

  // ---------- Tonart-Hilfen ----------
  const keyRange = (level, lims = [2, 4, 7]) => rnd(-lims[level], lims[level]);

  /** Einfache Stimmführung für Akkordfolgen (Bass + enge Lage). */
  function voiceProgression(tonicMidi, degrees, minor = false) {
    const scaleSemis = minor ? [0, 2, 3, 5, 7, 8, 11] : [0, 2, 4, 5, 7, 9, 11];
    let prev = null;
    return degrees.map((deg) => {
      const pcs = [0, 2, 4].map((k) => scaleSemis[(deg + k) % 7] + (deg + k >= 7 ? 12 : 0));
      const rootMidi = tonicMidi + scaleSemis[deg];
      const bass = rootMidi - 12 >= 36 ? rootMidi - 12 : rootMidi;
      const cands = [];
      for (let base = tonicMidi + 6; base <= tonicMidi + 24; base++) {
        // Alle Lagen, deren Töne die Akkordtöne treffen
        const set = pcs.map((p) => T.mod(tonicMidi + p, 12));
        if (!set.includes(T.mod(base, 12))) continue;
        const v = [base];
        let m = base;
        while (v.length < 3) { m++; if (set.includes(T.mod(m, 12)) && !v.some((x) => T.mod(x, 12) === T.mod(m, 12))) v.push(m); }
        cands.push(v);
      }
      let best = cands[0];
      if (prev) {
        let bestCost = Infinity;
        cands.forEach((c) => { const cost = c.reduce((s, m, i) => s + Math.abs(m - prev[i]), 0); if (cost < bestCost) { bestCost = cost; best = c; } });
      } else {
        best = cands.find((c) => c[0] >= tonicMidi + 12) || cands[0];
      }
      prev = best;
      return [bass, ...best];
    });
  }

  // =====================================================================
  const EX = {};

  // ---------- 1 Grundlagen ----------
  EX['tasten'] = {
    title: 'Klaviertasten benennen', desc: 'Erkenne die markierte Taste auf der Klaviatur.', chapter: 'grundlagen',
    levels: ['Weiße Tasten', 'Alle Tasten', 'Drei Oktaven'],
    gen(l) {
      const from = l === 2 ? 48 : 60, to = l === 2 ? 83 : 71;
      let m;
      do { m = rnd(from, to); } while (l === 0 && !T.isWhiteMidi(m));
      const answer = T.PC_NAMES[m % 12];
      return {
        prompt: 'Wie heißt die markierte Taste?',
        piano: { from, to, hl: [m], labels: 'none' },
        options: l === 0 ? NATURALS : T.PC_NAMES, keepOrder: true, answer,
        explain: `Das ist <b>${answer}</b>.` + (T.isWhiteMidi(m) ? '' : ' Schwarze Tasten haben zwei Namen: einen mit ♯ (‑is) und einen mit ♭ (‑es).'),
        onReveal: () => Sound.play(m),
      };
    },
  };

  function readNotes(clef) {
    const ranges = clef === 'treble' ? [[30, 38], [26, 42], [26, 42]] : [[18, 26], [14, 30], [14, 30]];
    return {
      title: clef === 'treble' ? 'Noten lesen: Violinschlüssel' : 'Noten lesen: Bassschlüssel',
      desc: clef === 'treble' ? 'Benenne Noten im Violinschlüssel.' : 'Benenne Noten im Bassschlüssel.', chapter: 'grundlagen',
      levels: ['Im System', 'Mit Hilfslinien', 'Mit Vorzeichen'],
      gen(l) {
        const [a, b] = ranges[l];
        const d = rnd(a, b);
        const acc = l === 2 ? pick([-1, 0, 1, 1, -1]) : 0;
        const p = fromDia(d, acc);
        const answer = T.name(p);
        return {
          prompt: 'Wie heißt diese Note?',
          staff: { clef, items: [noteItem(p)] },
          options: l < 2 ? NATURALS : spellOptions(p, 6, 1), keepOrder: l < 2, answer,
          explain: `Das ist <b>${answer}</b> (${T.helmholtz(p)}) – ${posText(d, clef)}.`,
          onReveal: () => Sound.play(T.midi(p)),
        };
      },
    };
  }
  EX['noten-violin'] = readNotes('treble');
  EX['noten-bass'] = readNotes('bass');

  EX['note-finden'] = {
    title: 'Töne auf der Klaviatur finden', desc: 'Klicke die gesuchte Taste an.', chapter: 'grundlagen',
    levels: ['Stammtöne', 'Mit Vorzeichen', 'Vom Notenblatt'],
    gen(l) {
      if (l < 2) {
        let p;
        if (l === 0) p = T.note(rnd(0, 6), 0, 4);
        else {
          do { p = T.note(rnd(0, 6), pick([-1, 1, 1, -1, 0]), 4); } while (['Eis', 'His', 'Fes', 'Ces'].includes(T.name(p)) && chance(0.7));
        }
        const pcv = T.pc(p);
        return {
          prompt: `Finde den Ton <b>${T.name(p)}</b> auf der Klaviatur.`,
          input: 'piano', piano: { from: 60, to: 83, labels: 'c' }, pianoAnswer: pcv, exact: false,
          answer: T.name(p),
          explain: `<b>${T.name(p)}</b> – ` + (T.isWhiteMidi(pcv) ? 'eine weiße Taste.' : `die schwarze Taste ${p.acc > 0 ? 'rechts' : 'links'} neben ${T.DE[p.letter]}.`),
          correctMidis: [60 + pcv, 72 + pcv],
        };
      }
      const clef = chance(0.5) ? 'treble' : 'bass';
      const d = clef === 'treble' ? rnd(26, 41) : rnd(14, 29);
      const p = fromDia(d, chance(0.3) ? pick([-1, 1]) : 0);
      const m = T.midi(p);
      if (m < 48 || m > 83) return EX['note-finden'].gen(l);
      return {
        prompt: 'Spiele diese Note in der richtigen Oktave.',
        staff: { clef, items: [noteItem(p)] },
        input: 'piano', piano: { from: 48, to: 83, labels: 'c' }, pianoAnswer: m, exact: true,
        answer: T.helmholtz(p),
        explain: `Das ist <b>${T.helmholtz(p)}</b> (${T.name(p)}). Orientierung: c' ist das mittlere C.`,
        correctMidis: [m],
      };
    },
  };

  EX['halbton-ganzton'] = {
    title: 'Halbton oder Ganzton?', desc: 'Bestimme den Abstand zweier benachbarter Töne.', chapter: 'grundlagen',
    levels: ['Stammtöne', 'Mit Vorzeichen', 'Nur Notenbild'],
    gen(l) {
      let a, b;
      if (l === 0) {
        const L = rnd(0, 6);
        a = T.note(L, 0, 4); b = T.note(L + 1 > 6 ? 0 : L + 1, 0, L + 1 > 6 ? 5 : 4);
      } else {
        for (;;) {
          a = T.note(rnd(0, 6), pick([-1, 0, 1]), 4);
          b = chance(0.15) ? T.note(a.letter, a.acc + pick([-1, 1]), 4) : T.transpose(a, pick(['m2', 'M2']));
          if (T.midi(b) < T.midi(a)) [a, b] = [b, a];
          const s = T.midi(b) - T.midi(a);
          if ((s === 1 || s === 2) && Math.abs(a.acc) <= 1 && Math.abs(b.acc) <= 1) break;
        }
      }
      const semis = T.midi(b) - T.midi(a);
      const answer = semis === 1 ? 'Halbton' : 'Ganzton';
      const midis = [T.midi(a), T.midi(b)];
      return {
        prompt: `Ist der Abstand <b>${T.name(a)} – ${T.name(b)}</b> ein Halbton oder ein Ganzton?`,
        staff: { items: [noteItem(a), noteItem(b)] },
        piano: l < 2 ? { from: 60, to: 76, hl: midis, labels: 'none' } : null,
        options: ['Halbton', 'Ganzton'], keepOrder: true, answer,
        audio: () => Sound.play(midis, { gap: 0.6 }),
        explain: `${T.name(a)} – ${T.name(b)} umfasst <b>${semis} ${semis === 1 ? 'Halbton' : 'Halbtöne'}</b> → ${answer}.` + (l === 0 ? ' Natürliche Halbtöne gibt es nur bei E–F und H–C.' : ''),
      };
    },
  };

  EX['enharmonik'] = {
    title: 'Enharmonische Verwechslung', desc: 'Finde den gleich klingenden Ton mit anderem Namen.', chapter: 'grundlagen',
    levels: ['Schwarze Tasten', 'Mit Eis, His, Fes, Ces', 'Doppelvorzeichen'],
    gen(l) {
      for (;;) {
        const lim = l === 2 ? 2 : 1;
        const p = T.note(rnd(0, 6), l === 2 ? pick([-2, 2]) : pick([-1, 1]), 4);
        const nm = T.name(p);
        if (l === 0 && ['Eis', 'His', 'Fes', 'Ces'].includes(nm)) continue;
        if (l === 1 && !['Eis', 'His', 'Fes', 'Ces'].includes(nm) && chance(0.5)) continue;
        const eqs = [];
        for (const dl of [-2, -1, 1, 2]) {
          const letter = T.mod(p.letter + dl, 7);
          const acc = T.mod(T.pc(p) - T.STEP_SEMI[letter] + 6, 12) - 6;
          if (Math.abs(acc) <= lim) eqs.push(T.note(letter, acc));
        }
        const pref = eqs.filter((e) => Math.abs(e.acc) < Math.abs(p.acc) || (Math.abs(e.acc) <= 1 && l < 2));
        const pool = pref.length ? pref : eqs;
        if (!pool.length) continue;
        const ans = pick(pool);
        const answer = T.name(ans);
        const wrong = [];
        for (const dl of [-1, 0, 1]) for (let a = -1; a <= 1; a++) {
          const q = T.note(T.mod(p.letter + dl, 7), a);
          if (T.pc(q) !== T.pc(p)) wrong.push(T.name(q));
        }
        return {
          prompt: `Welcher Ton klingt genauso wie <b>${nm}</b>?`,
          staff: { items: [noteItem(p)] },
          options: makeOptions(answer, wrong, 5), answer,
          explain: `<b>${nm}</b> und <b>${answer}</b> sind auf dem Klavier dieselbe Taste (${T.PC_NAMES[T.pc(p)]}).`,
          reveal: { items: [noteItem(p), noteItem([3, 4, 5].map((o) => T.note(ans.letter, ans.acc, o)).find((x) => T.midi(x) === T.midi(p)) || ans, { color: 'var(--good)' })] },
          onReveal: () => Sound.play(T.midi(p)),
        };
      }
    },
  };

  // ---------- 2 Rhythmus ----------
  const VAL_NAMES = { w: 'Ganze Note', h: 'Halbe Note', q: 'Viertelnote', '8': 'Achtelnote', '16': 'Sechzehntelnote' };
  const REST_NAMES = { w: 'Ganze Pause', h: 'Halbe Pause', q: 'Viertelpause', '8': 'Achtelpause', '16': 'Sechzehntelpause' };
  EX['notenwerte'] = {
    title: 'Notenwerte und Pausen', desc: 'Erkenne Notenwerte, Pausen und ihre Dauer.', chapter: 'rhythmus',
    levels: ['Noten', 'Noten & Pausen', 'Dauer berechnen'],
    gen(l) {
      if (l < 2) {
        const dur = pick(['w', 'h', 'q', '8', '16']);
        const rest = l === 1 && chance(0.5);
        const answer = rest ? REST_NAMES[dur] : VAL_NAMES[dur];
        const opts = l === 0 ? Object.values(VAL_NAMES) : makeOptions(answer, [...Object.values(VAL_NAMES), ...Object.values(REST_NAMES)], 6);
        return {
          prompt: rest ? 'Welche Pause ist das?' : 'Welcher Notenwert ist das?',
          staff: { items: [rest ? { type: 'rest', dur } : { type: 'note', notes: [T.parse(pick(['G4', 'A4', 'C5', 'D5']))], dur }], spacing: 60 },
          options: opts, keepOrder: l === 0, answer,
          explain: `Das ist eine <b>${answer}</b> – sie dauert ${fmtBeats(Widgets.BEATS[dur])} Viertel.`,
        };
      }
      const choices = [['w', 0], ['h', 0], ['q', 0], ['8', 0], ['h', 1], ['q', 1], ['8', 1], ['w', 1]];
      const [dur, dots] = pick(choices);
      const beats = Widgets.BEATS[dur] * (dots ? 1.5 : 1);
      const rest = chance(0.25) && !dots;
      const answer = fmtBeats(beats);
      const all = ['¼', '½', '¾', '1', '1½', '2', '3', '4', '6'];
      const name = (rest ? REST_NAMES[dur] : VAL_NAMES[dur]);
      return {
        prompt: `Wie viele <b>Viertelschläge</b> dauert ${rest ? 'diese Pause' : 'diese Note'}?`,
        staff: { items: [rest ? { type: 'rest', dur } : { type: 'note', notes: [T.parse('A4')], dur, dots }], spacing: 60 },
        options: all, keepOrder: true, answer,
        explain: dots
          ? `Punktierte ${{ w: 'Ganze', h: 'Halbe', q: 'Viertel', '8': 'Achtel' }[dur]}: ${fmtBeats(Widgets.BEATS[dur])} + ${fmtBeats(Widgets.BEATS[dur] / 2)} = <b>${answer}</b> Viertel. Der Punkt verlängert um die Hälfte.`
          : `${name}: <b>${answer}</b> Viertel.`,
      };
    },
  };

  const SIXTEENTHS = { 16: ['w', 0], 12: ['h', 1], 8: ['h', 0], 6: ['q', 1], 4: ['q', 0], 3: ['8', 1], 2: ['8', 0], 1: ['16', 0] };
  const SIX_NAMES = { 16: 'Ganze Note', 12: 'punktierte Halbe', 8: 'Halbe Note', 6: 'punktierte Viertel', 4: 'Viertelnote', 3: 'punktierte Achtel', 2: 'Achtelnote', 1: 'Sechzehntelnote' };
  EX['takt-rechnen'] = {
    title: 'Takte vervollständigen', desc: 'Welcher Notenwert fehlt, damit der Takt voll ist?', chapter: 'rhythmus',
    levels: ['Ganze bis Viertel', 'Mit Achteln & Punkten', 'Alle Taktarten'],
    gen(l) {
      const times = l === 0 ? [[4, 4], [3, 4], [2, 4]] : l === 1 ? [[4, 4], [3, 4], [2, 4]] : [[4, 4], [3, 4], [6, 8], [3, 8], [2, 2], [2, 4]];
      const allowed = [[16, 12, 8, 4], [16, 12, 8, 6, 4, 2], [16, 12, 8, 6, 4, 3, 2, 1]][l];
      const [num, den] = pick(times);
      const total = num * 16 / den;
      const missCands = allowed.filter((v) => v < total || (v === total && chance(0.1)));
      const miss = pick(missCands.length ? missCands : [4]);
      let rem = total - miss;
      const vals = [];
      while (rem > 0) { const c = allowed.filter((v) => v <= rem && v !== 16); const v = c.length ? pick(c) : 1; vals.push(v); rem -= v; }
      const pos = rnd(0, vals.length);
      const pitches = ['G4', 'A4', 'B4', 'C5', 'D5'];
      const items = vals.map((v) => ({ type: 'note', notes: [T.parse(pick(pitches))], dur: SIXTEENTHS[v][0], dots: SIXTEENTHS[v][1] }));
      const qIdx = Math.min(pos, items.length);
      const shown = [...items];
      shown.splice(qIdx, 0, { type: 'q' });
      const filled = [...items];
      const missItem = { type: 'note', notes: [T.parse('B4')], dur: SIXTEENTHS[miss][0], dots: SIXTEENTHS[miss][1], color: 'var(--good)' };
      filled.splice(qIdx, 0, missItem);
      const answer = SIX_NAMES[miss];
      const q = (x) => fmtBeats(x / 4);
      const haveQ = (total - miss) / 4;
      return {
        prompt: `Welcher <b>eine</b> Notenwert fehlt an der Stelle des Fragezeichens?`,
        staff: { time: [num, den], items: [...shown, { type: 'end' }], spacing: 40 },
        options: allowed.map((v) => SIX_NAMES[v]), keepOrder: true, answer,
        explain: `Ein ${num}/${den}-Takt dauert ${q(total)} Viertel. Vorhanden: ${fmtBeats(haveQ)} Viertel → es fehlen ${q(miss)} Viertel = <b>${answer}</b>.`,
        reveal: { time: [num, den], items: [...filled, { type: 'end' }], spacing: 40 },
        onReveal: () => Sound.rhythm(filled.map((it) => ({ midi: T.midi(it.notes[0]), beats: Widgets.beatsOf(it) })), 90, { countIn: 0 }),
      };
    },
  };

  const TERMS = {
    tempo: [['Largo', 'breit, sehr langsam'], ['Adagio', 'langsam, ruhig'], ['Andante', 'gehend'], ['Moderato', 'mäßig bewegt'],
      ['Allegro', 'schnell, heiter'], ['Presto', 'sehr schnell'], ['Accelerando', 'schneller werdend'], ['Ritardando', 'langsamer werdend'], ['A tempo', 'wieder im ursprünglichen Tempo']],
    dyn: [['pianissimo (pp)', 'sehr leise'], ['piano (p)', 'leise'], ['mezzopiano (mp)', 'mittelleise'], ['mezzoforte (mf)', 'mittellaut'],
      ['forte (f)', 'laut'], ['fortissimo (ff)', 'sehr laut'], ['crescendo', 'lauter werdend'], ['decrescendo', 'leiser werdend'], ['sforzato (sfz)', 'plötzlich stark betont']],
    art: [['Legato', 'gebunden'], ['Staccato', 'kurz, abgestoßen'], ['Tenuto', 'voll ausgehalten'], ['Fermate', 'beliebig lange aushalten'],
      ['Da capo (D.C.)', 'von vorne'], ['Fine', 'Ende'], ['Coda', 'Schlussteil'], ['Akzent', 'betont']],
  };
  EX['fachbegriffe'] = {
    title: 'Fachbegriffe: Tempo, Dynamik, Artikulation', desc: 'Italienische Vortragsbezeichnungen.', chapter: 'rhythmus',
    levels: ['Tempo', 'Dynamik & Artikulation', 'Alles gemischt'],
    gen(l) {
      const pool = l === 0 ? TERMS.tempo : l === 1 ? [...TERMS.dyn, ...TERMS.art] : [...TERMS.tempo, ...TERMS.dyn, ...TERMS.art];
      const [term, meaning] = pick(pool);
      const reverse = l === 2 && chance(0.5);
      const group = [TERMS.tempo, TERMS.dyn, TERMS.art].find((g) => g.some(([t]) => t === term));
      if (reverse) {
        return {
          prompt: `Welcher Begriff bedeutet „<b>${meaning}</b>"?`,
          options: makeOptions(term, group.map(([t]) => t), 5), answer: term,
          explain: `<b>${term}</b> = ${meaning}.`,
        };
      }
      return {
        prompt: `Was bedeutet <b>${term}</b>?`,
        options: makeOptions(meaning, group.map(([, m]) => m), 5), answer: meaning,
        explain: `<b>${term}</b> = ${meaning}.`,
      };
    },
  };

  // ---------- 3 Intervalle ----------
  EX['intervall-zahl'] = {
    title: 'Intervalle zählen', desc: 'Bestimme die Intervallgröße (Prime bis Oktave).', chapter: 'intervalle',
    levels: ['Stammtöne', 'Mit Vorzeichen', 'Bis zur Dezime'],
    gen(l) {
      const maxNum = l === 2 ? 10 : 8;
      const num = rnd(1, maxNum);
      const clef = l === 2 && chance(0.5) ? 'bass' : 'treble';
      const base = clef === 'treble' ? rnd(28, 40 - num + 1) : rnd(15, 28 - num + 1);
      const lower = fromDia(base, l ? pick([0, 0, -1, 1]) : 0);
      const upper = fromDia(base + num - 1, l ? pick([0, 0, -1, 1]) : 0);
      const harmonic = num > 1 && chance(0.5);
      const items = harmonic ? [noteItem([lower, upper])] : [noteItem(lower), noteItem(upper)];
      const answer = T.IV_NAMES[num - 1];
      const letters = [];
      for (let d = T.dia(lower); d <= T.dia(upper); d++) letters.push(T.DE[T.mod(d, 7)]);
      return {
        prompt: 'Welches Intervall (nur die Zahl) ist das?',
        staff: { clef, items },
        options: T.IV_NAMES.slice(0, maxNum), keepOrder: true, answer,
        explain: `${letters.join(' – ')}: ${num} Stammtöne → <b>${answer}</b>.` + (l ? ' Vorzeichen ändern die Zahl nicht.' : ''),
        onReveal: () => Sound.play([T.midi(lower), T.midi(upper)], { mode: harmonic ? 'chord' : 'melody' }),
      };
    },
  };

  EX['intervall-bestimmen'] = {
    title: 'Intervalle bestimmen', desc: 'Bestimme Zahl und Qualität (rein, groß, klein …).', chapter: 'intervalle',
    levels: ['Grundintervalle', 'Mit Tritonus & Vorzeichen', 'Übermäßig & vermindert'],
    gen(l) {
      const { iv, lower, upper } = randomInterval(l);
      const harmonic = iv !== 'P1' && iv !== 'A1' && chance(0.5);
      const answer = ivLabel(iv);
      const options = makeOptions(answer, intervalDistractors(iv).map(ivLabel), 6);
      return {
        prompt: 'Wie heißt dieses Intervall genau?',
        staff: { items: harmonic ? [noteItem([lower, upper])] : [noteItem(lower), noteItem(upper)] },
        options, answer,
        explain: intervalExplain(lower, upper),
        onReveal: () => Sound.play([T.midi(lower), T.midi(upper)], { mode: harmonic ? 'chord' : 'melody' }),
      };
    },
  };

  EX['intervall-bauen'] = {
    title: 'Intervalle bauen', desc: 'Finde den Ton, der ein bestimmtes Intervall bildet.', chapter: 'intervalle',
    levels: ['Aufwärts', 'Mit Vorzeichen', 'Auf- und abwärts'],
    gen(l) {
      const { iv, lower, upper } = randomInterval(l === 2 ? 1 : l);
      const down = l === 2 && chance(0.5);
      const given = down ? upper : lower;
      const target = down ? lower : upper;
      const answer = T.name(target);
      const q = { items: down ? [{ type: 'q' }, noteItem(given)] : [noteItem(given), { type: 'q' }] };
      return {
        prompt: `Welcher Ton liegt eine <b>${T.ivName(iv)}</b> ${down ? 'unter' : 'über'} <b>${T.name(given)}</b>?`,
        staff: q,
        options: spellOptions(target, 6, 1), answer,
        explain: intervalExplain(lower, upper) + (down ? '' : ''),
        reveal: { items: down ? [noteItem(target, { color: 'var(--good)' }), noteItem(given)] : [noteItem(given), noteItem(target, { color: 'var(--good)' })] },
        onReveal: () => Sound.play([T.midi(given), T.midi(target)]),
      };
    },
  };

  const EAR_IVS = [['M3', 'P4', 'P5', 'P8'], ['m2', 'M2', 'm3', 'M3', 'P4', 'P5', 'M6', 'P8'], ['m2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8']];
  const earLabel = (s) => s === 'A4' ? 'Tritonus' : ivLabel(s);
  EX['intervall-hoeren'] = {
    title: 'Intervalle hören', desc: 'Erkenne Intervalle nach Gehör.', chapter: 'intervalle', ear: true,
    levels: ['4 Intervalle', '8 Intervalle', 'Alle 12'],
    gen(l) {
      const iv = pick(EAR_IVS[l]);
      const semis = T.ivSemis(iv);
      const low = rnd(53, 67);
      const mode = l === 0 ? 'up' : l === 1 ? pick(['up', 'down']) : pick(['up', 'down', 'harm']);
      const play = () => mode === 'harm' ? Sound.play([low, low + semis], { mode: 'chord' })
        : Sound.play(mode === 'up' ? [low, low + semis] : [low + semis, low], { gap: 0.7 });
      let lower = T.fromMidi(low, chance(0.5));
      let upper = T.transpose(lower, iv);
      if (Math.abs(upper.acc) > 1) { lower = T.fromMidi(low, !(lower.acc < 0)); upper = T.transpose(lower, iv); }
      const modeText = { up: 'melodisch aufwärts', down: 'melodisch abwärts', harm: 'harmonisch' }[mode];
      return {
        prompt: `Welches Intervall hörst du? <span class="pill">${modeText}</span>`,
        audio: play,
        options: EAR_IVS[l].map(earLabel), keepOrder: true, answer: earLabel(iv),
        explain: `Das war eine <b>${earLabel(iv)}</b> (${semis} Halbtöne).`,
        reveal: { items: mode === 'harm' ? [noteItem([lower, upper])] : mode === 'up' ? [noteItem(lower), noteItem(upper)] : [noteItem(upper), noteItem(lower)] },
      };
    },
  };

  // ---------- 4 Tonleitern ----------
  EX['tonleiter-stufe'] = {
    title: 'Tonleiter-Stufen', desc: 'Welcher Ton ist die n-te Stufe einer Tonleiter?', chapter: 'tonleitern',
    levels: ['Dur bis 2 Vorzeichen', 'Dur & Moll bis 4', 'Alle Tonarten & Moll-Arten'],
    gen(l) {
      const minor = l > 0 && chance(0.5);
      const k = keyRange(l, [2, 4, 7]);
      const type = minor ? (l === 2 ? pick(['minor', 'harmonic', 'melodic']) : 'minor') : 'major';
      const tonic = minor ? T.minorTonic(k) : T.majorTonic(k);
      const sc = T.scale(tonic, type);
      const deg = rnd(2, 7);
      const ans = sc[deg - 1];
      const keyLabel = minor ? `${T.name(tonic).toLowerCase()}-Moll${type !== 'minor' ? ' (' + T.SCALES[type].name.split(' ')[0] + ')' : ''}` : `${T.name(tonic)}-Dur`;
      return {
        prompt: `Welcher Ton ist die <b>${deg}. Stufe</b> von <b>${keyLabel}</b>?`,
        options: spellOptions(ans, 6, 2), answer: T.name(ans),
        explain: `${keyLabel}: ${sc.slice(0, 7).map((n, i) => i === deg - 1 ? `<b>${T.name(n)}</b>` : T.name(n)).join(' – ')}.`,
        reveal: { items: sc.map((n, i) => noteItem(n, { label: String(i + 1), color: i === deg - 1 ? 'var(--good)' : undefined })), spacing: 38 },
        onReveal: () => Sound.play(sc.map(T.midi), { gap: 0.3 }),
      };
    },
  };

  const SCALE_SETS = [['major', 'minor'], ['major', 'minor', 'harmonic', 'melodic'], ['major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian']];
  const scaleLabel = (t) => t === 'major' ? 'Dur' : t === 'minor' ? (T.SCALES[t].name) : T.SCALES[t].name;
  function randomScale(l) {
    for (;;) {
      const type = pick(SCALE_SETS[l]);
      const root = T.note(rnd(0, 6), l === 0 ? 0 : pick([0, 0, 0, -1, 1]), 4);
      if (T.dia(root) > 32) root.octave = 3;
      const sc = T.scale(root, type);
      if (maxAbsAcc(sc) <= 1) return { type, root, sc };
    }
  }
  EX['tonleiter-erkennen'] = {
    title: 'Tonleitern erkennen', desc: 'Bestimme die Art der notierten Tonleiter.', chapter: 'tonleitern',
    levels: ['Dur / Moll', 'Moll-Arten', 'Kirchentonarten'],
    gen(l) {
      const { type, root, sc } = randomScale(l);
      const answer = scaleLabel(type);
      return {
        prompt: `Welche Tonleiter ist das? (Grundton ${T.name(root)})`,
        staff: { items: sc.map((n) => noteItem(n)), spacing: 36 },
        audio: () => Sound.play(sc.map(T.midi), { gap: 0.32 }), audioOptional: true,
        options: SCALE_SETS[l].map(scaleLabel), keepOrder: true, answer,
        explain: `<b>${T.name(root)} ${answer}</b>: ${sc.map(T.name).join(' – ')}. Bauplan: ${stepPattern(sc)}.`,
      };
    },
  };
  function stepPattern(sc) {
    const out = [];
    for (let i = 1; i < sc.length; i++) { const s = T.midi(sc[i]) - T.midi(sc[i - 1]); out.push(s === 1 ? 'HT' : s === 2 ? 'GT' : s === 3 ? '1½' : s + 'HT'); }
    return out.join(' ');
  }

  EX['tonleiter-hoeren'] = {
    title: 'Tonleitern hören', desc: 'Erkenne Tonleitern nach Gehör.', chapter: 'tonleitern', ear: true,
    levels: ['Dur / Moll', 'Moll-Arten', 'Kirchentonarten'],
    gen(l) {
      const type = pick(SCALE_SETS[l]);
      const root = rnd(55, 64);
      const midis = [...T.SCALES[type].ivs.map((iv) => root + T.ivSemis(iv)), root + 12];
      const r = T.fromMidi(root, chance(0.5));
      return {
        prompt: 'Welche Tonleiter hörst du?',
        audio: () => Sound.play(midis, { gap: 0.33 }),
        options: SCALE_SETS[l].map(scaleLabel), keepOrder: true, answer: scaleLabel(type),
        explain: `Das war <b>${scaleLabel(type)}</b>. Bauplan: ${stepPattern(T.scale(r, type))}.`,
        reveal: { items: T.scale(r, type).map((n) => noteItem(n)), spacing: 34 },
      };
    },
  };

  // ---------- 5 Tonarten ----------
  EX['vorzeichen-tonart'] = {
    title: 'Tonart am Vorzeichen erkennen', desc: 'Welche Tonart gehört zu dieser Vorzeichnung?', chapter: 'tonarten',
    levels: ['Dur bis 3 Vorzeichen', 'Dur & Moll bis 5', 'Alle, auch Bassschlüssel'],
    gen(l) {
      const k = keyRange(l, [3, 5, 7]);
      const minor = l > 0 && chance(0.5);
      const clef = l === 2 && chance(0.4) ? 'bass' : 'treble';
      const answer = T.keyName(k, minor);
      const ds = [];
      for (let d = -3; d <= 3; d++) if (d && k + d >= -7 && k + d <= 7) ds.push(T.keyName(k + d, minor));
      ds.push(T.keyName(-k, minor));
      const rule = k > 0 ? `Letztes Kreuz (${T.keySigNames(k).slice(-1)[0]}) + Halbton = ${T.name(T.majorTonic(k))}` : k < 0 ? (k === -1 ? '1 ♭ = F-Dur (merken!)' : `Vorletztes B (${T.keySigNames(k).slice(-2)[0]}) = Dur-Grundton`) : 'Keine Vorzeichen = C-Dur / a-Moll';
      return {
        prompt: `Welche <b>${minor ? 'Moll' : 'Dur'}</b>-Tonart hat diese Vorzeichen?`,
        staff: { clef, keySig: k, items: [], minWidth: 160 },
        options: makeOptions(answer, ds, 5), answer,
        explain: `${T.sigText(k)}${k ? ' (' + T.keySigNames(k).join(', ') + ')' : ''} → <b>${T.keyName(k)}</b> / <b>${T.keyName(k, true)}</b>. ${rule}.`,
      };
    },
  };

  EX['tonart-vorzeichen'] = {
    title: 'Vorzeichen einer Tonart', desc: 'Wie viele ♯ oder ♭ hat eine Tonart?', chapter: 'tonarten',
    levels: ['Dur bis 3', 'Dur & Moll bis 5', 'Alle Tonarten'],
    gen(l) {
      const k = keyRange(l, [3, 5, 7]);
      const minor = l > 0 && chance(0.5);
      const name = T.keyName(k, minor);
      const answer = T.sigText(k);
      const ds = [T.sigText(-k), T.sigText(k + 1), T.sigText(k - 1), T.sigText(k + 2), T.sigText(k - 2), T.sigText(0)].filter((s) => !/(8|9)/.test(s));
      return {
        prompt: `Wie viele Vorzeichen hat <b>${name}</b>?`,
        options: makeOptions(answer, ds, 5), answer,
        explain: `<b>${name}</b>: ${answer}${k ? ' – ' + T.keySigNames(k).join(', ') : ''}.` + (minor ? ` (Parallele zu ${T.keyName(k)})` : ''),
        reveal: { keySig: k, items: (() => { const t = minor ? T.minorTonic(k) : T.majorTonic(k); return T.scale(t, minor ? 'minor' : 'major').map((n) => ({ ...noteItem(n), showAcc: false })); })(), spacing: 34 },
      };
    },
  };

  EX['parallel'] = {
    title: 'Parallel- und Varianttonarten', desc: 'Finde verwandte Tonarten.', chapter: 'tonarten',
    levels: ['Dur → Moll-Parallele', 'Beide Richtungen', 'Parallele & Variante'],
    gen(l) {
      for (;;) {
        const k = keyRange(l, [3, 5, 6]);
        const fromMinor = l > 0 && chance(0.5);
        const variant = l === 2 && chance(0.5);
        const src = T.keyName(k, fromMinor);
        let answer, explain;
        if (!variant) {
          answer = T.keyName(k, !fromMinor);
          explain = `<b>${src}</b> und <b>${answer}</b> haben dieselben Vorzeichen (${T.sigText(k)}). Die Moll-Parallele liegt eine kleine Terz unter dem Dur-Grundton.`;
        } else {
          const tonic = fromMinor ? T.minorTonic(k) : T.majorTonic(k);
          const k2 = T.fifthsOf(tonic, !fromMinor);
          if (k2 === null) continue;
          answer = T.keyName(k2, !fromMinor);
          explain = `Die Variante hat denselben Grundton: <b>${src}</b> ↔ <b>${answer}</b> (${T.sigText(k)} ↔ ${T.sigText(k2)}).`;
        }
        const ds = [];
        const tonic = fromMinor ? T.minorTonic(k) : T.majorTonic(k);
        const k2 = T.fifthsOf(tonic, !fromMinor);
        if (k2 !== null) ds.push(T.keyName(k2, !fromMinor));
        ds.push(T.keyName(k, !fromMinor));
        for (const d of [-2, -1, 1, 2, 3, -3]) if (Math.abs(k + d) <= 7) ds.push(T.keyName(k + d, !fromMinor));
        return {
          prompt: `Was ist die <b>${variant ? 'Varianttonart' : 'Paralleltonart'}</b> von <b>${src}</b>?`,
          options: makeOptions(answer, ds, 5), answer, explain,
        };
      }
    },
  };

  // ---------- 6 Akkorde ----------
  const TRIAD_SETS = [['maj', 'min'], ['maj', 'min', 'dim', 'aug'], ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4']];
  const SEVENTHS = ['maj7', 'dom7', 'min7', 'hdim7', 'dim7'];
  function randomChord(types, accProb, lim = 1) {
    for (;;) {
      const type = pick(types);
      const root = T.note(rnd(0, 6), chance(accProb) ? pick([-1, 1]) : 0, 4);
      if (T.dia(root) > 31) root.octave = 3;
      const notes = T.chord(root, type);
      if (maxAbsAcc(notes) <= (type === 'dim7' ? Math.max(lim, 2) : lim)) return { type, root, notes };
    }
  }
  function triadExplain(notes, type) {
    const parts = [];
    for (let i = 1; i < notes.length; i++) {
      const iv = T.between(notes[i - 1], notes[i]);
      parts.push(`${T.name(notes[i - 1])}–${T.name(notes[i])}: ${T.ivName(iv)}`);
    }
    return `<b>${T.CHORDS[type].name}</b> (${T.chordSymbol(notes[0], type)}): ${parts.join(', ')}.`;
  }

  EX['dreiklang-bestimmen'] = {
    title: 'Dreiklänge bestimmen', desc: 'Dur, Moll, vermindert oder übermäßig?', chapter: 'akkorde',
    levels: ['Dur / Moll', 'Alle vier Arten', 'Mit sus-Akkorden'],
    gen(l) {
      const { type, notes } = randomChord(TRIAD_SETS[l], l ? 0.35 : 0, l === 2 ? 2 : 1);
      return {
        prompt: 'Welche Art von Dreiklang ist das?',
        staff: { items: [noteItem(notes)] },
        audio: () => Sound.play(notes.map(T.midi), { mode: 'arp', gap: 0.3 }), audioOptional: true,
        options: TRIAD_SETS[l].map((t) => T.CHORDS[t].short), keepOrder: true, answer: T.CHORDS[type].short,
        explain: triadExplain(notes, type),
      };
    },
  };

  EX['akkord-toene'] = {
    title: 'Akkordsymbole lesen', desc: 'Welche Töne gehören zu einem Akkordsymbol?', chapter: 'akkorde',
    levels: ['Dur & Moll', 'Alle Dreiklänge', 'Septakkorde'],
    gen(l) {
      const types = l === 2 ? SEVENTHS : TRIAD_SETS[Math.min(l, 1)];
      const { type, root, notes } = randomChord(types, l ? 0.3 : 0.1, 1);
      const answer = join(notes);
      const ds = [];
      const alt = l === 2 ? SEVENTHS : ['maj', 'min', 'dim', 'aug'];
      alt.forEach((t) => { const c = T.chord(root, t); if (t !== type && maxAbsAcc(c) <= 2) ds.push(join(c)); });
      // falsch geschriebene Terz (enharmonisch)
      const third = notes[1];
      const enh = T.note(T.mod(third.letter + (third.acc >= 0 ? 1 : -1), 7), 0);
      enh.acc = T.mod(T.pc(third) - T.STEP_SEMI[enh.letter] + 6, 12) - 6;
      if (Math.abs(enh.acc) <= 2) ds.push(join([notes[0], enh, ...notes.slice(2)]));
      return {
        prompt: `Welche Töne hat der Akkord <b>${T.chordSymbol(root, type)}</b>?`,
        options: makeOptions(answer, ds, 4), answer,
        explain: triadExplain(notes, type),
        reveal: { items: [noteItem(notes)] },
        onReveal: () => Sound.play(notes.map(T.midi), { mode: 'arp', gap: 0.25 }),
      };
    },
  };

  const INV_TRIAD = ['Grundstellung', 'Sextakkord (1. Umkehrung)', 'Quartsextakkord (2. Umkehrung)'];
  const INV_SEV = ['Grundstellung (Septakkord)', 'Quintsextakkord', 'Terzquartakkord', 'Sekundakkord'];
  EX['umkehrung'] = {
    title: 'Umkehrungen bestimmen', desc: 'Grundstellung, Sextakkord oder Quartsextakkord?', chapter: 'akkorde',
    levels: ['Dur & Moll', 'Alle Dreiklänge', 'Septakkorde'],
    gen(l) {
      const types = l === 2 ? ['dom7', 'maj7', 'min7'] : l === 1 ? ['maj', 'min', 'dim'] : ['maj', 'min'];
      const { type, root } = randomChord(types, l ? 0.3 : 0);
      const n = T.CHORDS[type].ivs.length;
      const inv = rnd(0, n - 1);
      const r = { ...root };
      if (inv > 0 && T.dia(r) > 29) r.octave -= 1;
      const notes = T.chord(r, type, inv);
      const labels = n === 4 ? INV_SEV : INV_TRIAD;
      const bassRole = ['Grundton', 'Terz', 'Quinte', 'Septime'][inv];
      return {
        prompt: `In welcher Stellung steht dieser Akkord?`,
        staff: { items: [noteItem(notes)] },
        audio: () => Sound.play(notes.map(T.midi), { mode: 'arp', gap: 0.3 }), audioOptional: true,
        options: labels, keepOrder: true, answer: labels[inv],
        explain: `Akkord: <b>${T.chordSymbol(root, type)}</b> (${join(T.chord(root, type))}). Im Bass liegt <b>${T.name(notes[0])}</b> = ${bassRole} → <b>${labels[inv]}</b>.`,
      };
    },
  };

  const EAR_CHORDS = [['maj', 'min'], ['maj', 'min', 'dim', 'aug'], ['maj7', 'dom7', 'min7', 'hdim7', 'dim7']];
  EX['akkord-hoeren'] = {
    title: 'Akkorde hören', desc: 'Erkenne Akkordtypen nach Gehör.', chapter: 'akkorde', ear: true,
    levels: ['Dur / Moll', 'Vier Dreiklänge', 'Septakkorde'],
    gen(l) {
      const type = pick(EAR_CHORDS[l]);
      const root = rnd(52, 62);
      const midis = T.CHORDS[type].ivs.map((iv) => root + T.ivSemis(iv));
      let r = T.fromMidi(root, chance(0.5));
      if (maxAbsAcc(T.chord(r, type)) > 1) r = T.fromMidi(root, !(r.acc < 0));
      return {
        prompt: 'Welchen Akkord hörst du?',
        audio: () => Sound.play(midis, { mode: 'arp', gap: 0.28 }),
        extraAudio: [['Nur Zusammenklang', () => Sound.play(midis, { mode: 'chord' })]],
        options: EAR_CHORDS[l].map((t) => T.CHORDS[t].short), keepOrder: true, answer: T.CHORDS[type].short,
        explain: `Das war ein <b>${T.CHORDS[type].name}</b>.`,
        reveal: { items: [noteItem(T.chord(r, type))] },
      };
    },
  };

  // ---------- 7 Harmonielehre ----------
  EX['stufen'] = {
    title: 'Stufenakkorde', desc: 'Leitereigene Akkorde einer Dur-Tonart.', chapter: 'harmonielehre',
    levels: ['Bis 2 Vorzeichen', 'Bis 4 Vorzeichen', 'Rückwärts & alle Tonarten'],
    gen(l) {
      const k = keyRange(l, [2, 4, 6]);
      const chords = T.diatonicChords(k);
      const deg = l === 0 ? pick([0, 3, 4, 1, 5]) : rnd(0, 6);
      const c = chords[deg];
      const keyN = T.keyName(k);
      const table = chords.map((x) => `${x.roman} = ${x.symbol}`).join(', ');
      if (l === 2 && chance(0.5)) {
        return {
          prompt: `Auf welcher Stufe steht <b>${c.symbol}</b> in <b>${keyN}</b>?`,
          options: chords.map((x) => x.roman), keepOrder: true, answer: c.roman,
          explain: `${keyN}: ${table}.`,
          reveal: { items: chords.map((x, i) => noteItem(x.notes, { label: x.roman, color: i === deg ? 'var(--good)' : undefined })), spacing: 50 },
          onReveal: () => Sound.play(c.notes.map(T.midi), { mode: 'chord' }),
        };
      }
      const ds = chords.map((x) => x.symbol);
      ds.push(T.chordSymbol(c.root, c.type === 'maj' ? 'min' : 'maj'));
      return {
        prompt: `Welcher Akkord steht auf der <b>${T.ROMAN[deg]}. Stufe</b> von <b>${keyN}</b>?`,
        options: makeOptions(c.symbol, ds, 5), answer: c.symbol,
        explain: `${keyN}: ${table}. Muster: Dur auf I, IV, V – Moll auf ii, iii, vi – vermindert auf vii.`,
        reveal: { items: chords.map((x, i) => noteItem(x.notes, { label: x.roman, color: i === deg ? 'var(--good)' : undefined })), spacing: 50 },
        onReveal: () => Sound.play(c.notes.map(T.midi), { mode: 'chord' }),
      };
    },
  };

  const FUNC_NAMES = { T: 'Tonika (T)', S: 'Subdominante (S)', D: 'Dominante (D)', Tp: 'Tonikaparallele (Tp)', Sp: 'Subdominantparallele (Sp)', Dp: 'Dominantparallele (Dp)' };
  const FUNC_DEG = { T: 0, S: 3, D: 4, Tp: 5, Sp: 1, Dp: 2 };
  EX['funktionen'] = {
    title: 'Harmonische Funktionen', desc: 'Tonika, Subdominante, Dominante und Parallelen.', chapter: 'harmonielehre',
    levels: ['T, S, D', 'Mit Parallelen', 'Alle Tonarten'],
    gen(l) {
      const k = keyRange(l, [2, 3, 6]);
      const chords = T.diatonicChords(k);
      const keyN = T.keyName(k);
      const funcs = l === 0 ? ['T', 'S', 'D'] : Object.keys(FUNC_DEG);
      const f = pick(funcs);
      const c = chords[FUNC_DEG[f]];
      const explain = `In ${keyN}: ` + funcs.map((ff) => `${ff} = ${chords[FUNC_DEG[ff]].symbol}`).join(', ') + '.';
      const reveal = { items: funcs.map((ff) => noteItem(chords[FUNC_DEG[ff]].notes, { label: ff, color: ff === f ? 'var(--good)' : undefined })), spacing: 52 };
      if (chance(0.5)) {
        return {
          prompt: `Welcher Akkord ist die <b>${FUNC_NAMES[f]}</b> in <b>${keyN}</b>?`,
          options: makeOptions(c.symbol, chords.map((x) => x.symbol), 5), answer: c.symbol,
          explain, reveal, onReveal: () => Sound.play(c.notes.map(T.midi), { mode: 'chord' }),
        };
      }
      return {
        prompt: `Welche Funktion hat <b>${c.symbol}</b> in <b>${keyN}</b>?`,
        options: funcs.map((ff) => FUNC_NAMES[ff]), keepOrder: true, answer: FUNC_NAMES[f],
        explain, reveal, onReveal: () => Sound.play(c.notes.map(T.midi), { mode: 'chord' }),
      };
    },
  };

  const CADENCES = {
    'Ganzschluss (… V → I)': [0, 3, 4, 0],
    'Halbschluss (endet auf V)': [0, 3, 0, 4],
    'Plagalschluss (… IV → I)': [0, 4, 3, 0],
    'Trugschluss (V → vi)': [0, 3, 4, 5],
  };
  const CAD_SETS = [2, 3, 4];
  EX['kadenz-hoeren'] = {
    title: 'Kadenzen hören', desc: 'Erkenne Schlusswendungen nach Gehör.', chapter: 'harmonielehre', ear: true,
    levels: ['Ganz- / Halbschluss', '+ Plagalschluss', '+ Trugschluss'],
    gen(l) {
      const names = Object.keys(CADENCES).slice(0, CAD_SETS[l]);
      const name = pick(names);
      const tonic = rnd(48, 55);
      const prog = voiceProgression(tonic, CADENCES[name]);
      const romans = CADENCES[name].map((d) => ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'][d]).join(' – ');
      return {
        prompt: 'Welche Schlusswendung hörst du?',
        audio: () => Sound.progression(prog, { gap: 1.0 }),
        options: names, keepOrder: true, answer: name,
        explain: `Das war ein <b>${name.split(' (')[0]}</b>: ${romans}.`,
      };
    },
  };

  // ---------- 8 Gehörbildung ----------
  EX['tonhoehe'] = {
    title: 'Tonhöhen vergleichen', desc: 'Ist der zweite Ton höher, tiefer oder gleich?', chapter: 'gehoer', ear: true,
    levels: ['Große Abstände', 'Kleine Abstände', 'Halbtöne'],
    gen(l) {
      const [a, b] = [[4, 12], [2, 4], [1, 2]][l];
      const first = rnd(55, 72);
      const same = chance(0.15);
      const diff = same ? 0 : rnd(a, b) * (chance(0.5) ? 1 : -1);
      const second = first + diff;
      const answer = diff > 0 ? 'höher' : diff < 0 ? 'tiefer' : 'gleich';
      return {
        prompt: 'Ist der <b>zweite</b> Ton höher, tiefer oder gleich?',
        audio: () => Sound.play([first, second], { gap: 0.8 }),
        options: ['tiefer', 'gleich', 'höher'], keepOrder: true, answer,
        explain: diff === 0 ? 'Beide Töne waren <b>gleich</b>.' : `Der zweite Ton war <b>${Math.abs(diff)} ${Math.abs(diff) === 1 ? 'Halbton' : 'Halbtöne'} ${answer}</b>.`,
      };
    },
  };

  EX['melodie-nachspielen'] = {
    title: 'Melodien nachspielen', desc: 'Höre eine kurze Melodie und spiele sie auf der Klaviatur nach.', chapter: 'gehoer', ear: true,
    levels: ['3 Töne', '4 Töne', '5 Töne mit Sprüngen'],
    gen(l) {
      const scale = [60, 62, 64, 65, 67, 69, 71, 72];
      const len = [3, 4, 5][l];
      const seq = [60];
      let idx = 0;
      while (seq.length < len) {
        const step = l === 2 ? pick([-3, -2, -1, 1, 2, 3, 4]) : pick([-1, 1, 1, -2, 2]);
        const ni = idx + step;
        if (ni < 0 || ni > (l === 0 ? 4 : 7)) continue;
        idx = ni;
        seq.push(scale[idx]);
      }
      return {
        prompt: `Spiele die Melodie nach. Der erste Ton ist <b>c'</b> (mittleres C, markiert).`,
        audio: () => Sound.play(seq, { gap: 0.55 }),
        input: 'sequence', seq, piano: { from: 60, to: 72, labels: 'white', hl2: [60] },
        answer: seq.map((m) => T.name(T.fromMidi(m))).join(' – '),
        explain: `Die Melodie war: <b>${seq.map((m) => T.name(T.fromMidi(m))).join(' – ')}</b>.`,
        reveal: { items: seq.map((m) => noteItem(T.fromMidi(m), { dur: 'q' })), labels: true, spacing: 40 },
      };
    },
  };

  // ---------- Gemischt ----------
  EX['mix'] = {
    title: 'Gemischtes Training', desc: 'Zufällige Aufgaben aus allen Kapiteln.', chapter: null,
    levels: ['Leicht', 'Mittel', 'Schwer'],
    gen(l) {
      const ids = Object.keys(EX).filter((id) => id !== 'mix' && id !== 'melodie-nachspielen');
      const id = pick(ids);
      const q = EX[id].gen(l);
      q.prompt = `<span class="pill">${EX[id].title}</span><br>` + q.prompt;
      q.sourceId = id;
      return q;
    },
  };

  return { EX, rnd, pick, shuffle, voiceProgression };
})();
