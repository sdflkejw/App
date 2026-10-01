'use strict';
/*
 * Musiktheorie-Kern: Töne, Intervalle, Tonleitern, Akkorde, Tonarten.
 * Ein Ton ist { letter: 0–6 (C D E F G A H), acc: -2…2, octave }.
 * Oktavzählung wissenschaftlich: C4 = eingestrichenes c' (mittleres C).
 */
const Theory = (() => {
  const STEP_SEMI = [0, 2, 4, 5, 7, 9, 11];
  const EN = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const DE = ['C', 'D', 'E', 'F', 'G', 'A', 'H'];
  const mod = (a, n) => ((a % n) + n) % n;

  const note = (letter, acc = 0, octave = 4) => ({ letter, acc, octave });
  const midi = (p) => 12 * (p.octave + 1) + STEP_SEMI[p.letter] + p.acc;
  const dia = (p) => p.letter + 7 * p.octave;
  const pc = (p) => mod(midi(p), 12);
  const same = (a, b) => a.letter === b.letter && a.acc === b.acc;
  const isWhiteMidi = (m) => [0, 2, 4, 5, 7, 9, 11].includes(mod(m, 12));

  function parse(str) {
    const m = /^([A-G])(bb|b|##|#|x)?(-?\d)?$/.exec(String(str).trim());
    if (!m) throw new Error('Ungültige Note: ' + str);
    const accMap = { bb: -2, b: -1, '#': 1, '##': 2, x: 2 };
    return note(EN.indexOf(m[1]), m[2] ? accMap[m[2]] : 0, m[3] !== undefined ? +m[3] : 4);
  }

  /** Deutscher Tonname: C, Cis, Des, Es, As, H, B, Heses … */
  function name(p) {
    const a = p.acc, L = p.letter;
    if (L === 6 && a === -1) return 'B';
    if (L === 6 && a === -2) return 'Heses';
    const l = DE[L];
    if (a < 0 && (L === 2 || L === 5)) return l + (a === -1 ? 's' : 'ses');
    return l + ['eses', 'es', '', 'is', 'isis'][a + 2];
  }

  /** Helmholtz-Schreibweise: C, (groß) c (klein) c' (eingestrichen) … */
  function helmholtz(p) {
    const n = name(p);
    if (p.octave <= 2) return n + ','.repeat(2 - p.octave);
    return n.toLowerCase() + "'".repeat(Math.max(0, p.octave - 3));
  }

  const PC_NAMES = ['C', 'Cis/Des', 'D', 'Dis/Es', 'E', 'F', 'Fis/Ges', 'G', 'Gis/As', 'A', 'Ais/B', 'H'];

  function fromMidi(m, preferFlat = false) {
    const p = mod(m, 12);
    const letters = preferFlat ? [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6] : [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
    const accs = preferFlat ? [0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0] : [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    const octave = Math.floor(m / 12) - 1;
    return note(letters[p], accs[p], octave);
  }

  // ---------- Intervalle ----------
  const IV_NAMES = ['Prime', 'Sekunde', 'Terz', 'Quarte', 'Quinte', 'Sexte', 'Septime', 'Oktave',
    'None', 'Dezime', 'Undezime', 'Duodezime', 'Terzdezime', 'Quartdezime', 'Quintdezime'];
  const Q_NAMES = { P: 'reine', M: 'große', m: 'kleine', A: 'übermäßige', d: 'verminderte', AA: 'doppelt übermäßige', dd: 'doppelt verminderte' };
  const isPerfectNum = (num) => [0, 3, 4].includes((num - 1) % 7);

  function ivParse(s) {
    const m = /^(AA|dd|P|M|m|A|d)(\d+)$/.exec(s);
    return { q: m[1], num: +m[2] };
  }
  const ivStr = (iv) => iv.q + iv.num;

  function ivSemis(iv) {
    const iv2 = typeof iv === 'string' ? ivParse(iv) : iv;
    const simple = (iv2.num - 1) % 7, octs = Math.floor((iv2.num - 1) / 7);
    const base = STEP_SEMI[simple] + 12 * octs;
    const off = isPerfectNum(iv2.num)
      ? { P: 0, A: 1, d: -1, AA: 2, dd: -2 }[iv2.q]
      : { M: 0, m: -1, A: 1, d: -2, AA: 2, dd: -3 }[iv2.q];
    return base + off;
  }

  function transpose(p, iv, down = false) {
    const i = typeof iv === 'string' ? ivParse(iv) : iv;
    const d = dia(p) + (down ? -(i.num - 1) : i.num - 1);
    const target = midi(p) + (down ? -ivSemis(i) : ivSemis(i));
    const r = note(mod(d, 7), 0, Math.floor(d / 7));
    r.acc = target - midi(r);
    return r;
  }

  /** Intervall von a nach b (b liegt diatonisch höher oder gleich). */
  function between(a, b) {
    if (dia(b) < dia(a)) [a, b] = [b, a];
    const steps = dia(b) - dia(a);
    const semis = midi(b) - midi(a);
    const base = STEP_SEMI[steps % 7] + 12 * Math.floor(steps / 7);
    const diff = semis - base;
    const num = steps + 1;
    const q = isPerfectNum(num)
      ? { '-2': 'dd', '-1': 'd', 0: 'P', 1: 'A', 2: 'AA' }[diff]
      : { '-3': 'dd', '-2': 'd', '-1': 'm', 0: 'M', 1: 'A', 2: 'AA' }[diff];
    return { q: q || '?', num };
  }

  function ivName(iv) {
    const i = typeof iv === 'string' ? ivParse(iv) : iv;
    return `${Q_NAMES[i.q] || '?'} ${IV_NAMES[i.num - 1] || i.num + '.'}`;
  }
  const ivNameCap = (iv) => { const s = ivName(iv); return s[0].toUpperCase() + s.slice(1); };

  // ---------- Tonleitern ----------
  const SCALES = {
    major: { name: 'Dur', ivs: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'] },
    minor: { name: 'natürliches Moll', ivs: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'] },
    harmonic: { name: 'harmonisches Moll', ivs: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'] },
    melodic: { name: 'melodisches Moll', ivs: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'] },
    ionian: { name: 'Ionisch', ivs: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'] },
    dorian: { name: 'Dorisch', ivs: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'] },
    phrygian: { name: 'Phrygisch', ivs: ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'] },
    lydian: { name: 'Lydisch', ivs: ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'] },
    mixolydian: { name: 'Mixolydisch', ivs: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'] },
    aeolian: { name: 'Äolisch', ivs: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'] },
    locrian: { name: 'Lokrisch', ivs: ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'] },
    pentaMajor: { name: 'Dur-Pentatonik', ivs: ['P1', 'M2', 'M3', 'P5', 'M6'] },
    pentaMinor: { name: 'Moll-Pentatonik', ivs: ['P1', 'm3', 'P4', 'P5', 'm7'] },
    blues: { name: 'Blues-Tonleiter', ivs: ['P1', 'm3', 'P4', 'd5', 'P5', 'm7'] },
    whole: { name: 'Ganztonleiter', ivs: ['P1', 'M2', 'M3', 'A4', 'A5', 'A6'] },
  };

  function scale(root, type, withOctave = true) {
    const notes = SCALES[type].ivs.map((iv) => transpose(root, iv));
    if (withOctave) notes.push(transpose(root, 'P8'));
    return notes;
  }

  // ---------- Akkorde ----------
  const CHORDS = {
    maj: { name: 'Dur-Dreiklang', short: 'Dur', sym: '', ivs: ['P1', 'M3', 'P5'] },
    min: { name: 'Moll-Dreiklang', short: 'Moll', sym: 'm', ivs: ['P1', 'm3', 'P5'] },
    dim: { name: 'verminderter Dreiklang', short: 'vermindert', sym: '°', ivs: ['P1', 'm3', 'd5'] },
    aug: { name: 'übermäßiger Dreiklang', short: 'übermäßig', sym: '+', ivs: ['P1', 'M3', 'A5'] },
    sus2: { name: 'sus2-Akkord', short: 'sus2', sym: 'sus2', ivs: ['P1', 'M2', 'P5'] },
    sus4: { name: 'sus4-Akkord', short: 'sus4', sym: 'sus4', ivs: ['P1', 'P4', 'P5'] },
    dom7: { name: 'Dominantseptakkord', short: 'Dominantsept (7)', sym: '7', ivs: ['P1', 'M3', 'P5', 'm7'] },
    maj7: { name: 'großer Dur-Septakkord', short: 'maj7', sym: 'maj7', ivs: ['P1', 'M3', 'P5', 'M7'] },
    min7: { name: 'Moll-Septakkord', short: 'm7', sym: 'm7', ivs: ['P1', 'm3', 'P5', 'm7'] },
    hdim7: { name: 'halbverminderter Septakkord', short: 'halbvermindert (ø7)', sym: 'ø7', ivs: ['P1', 'm3', 'd5', 'm7'] },
    dim7: { name: 'verminderter Septakkord', short: 'vermindert (°7)', sym: '°7', ivs: ['P1', 'm3', 'd5', 'd7'] },
    minMaj7: { name: 'Moll-Dur-Septakkord', short: 'm(maj7)', sym: 'm(maj7)', ivs: ['P1', 'm3', 'P5', 'M7'] },
    augMaj7: { name: 'übermäßiger Dur-Septakkord', short: '+maj7', sym: '+maj7', ivs: ['P1', 'M3', 'A5', 'M7'] },
  };

  function chord(root, type, inversion = 0) {
    let notes = CHORDS[type].ivs.map((iv) => transpose(root, iv));
    for (let i = 0; i < inversion; i++) {
      const low = notes.shift();
      notes.push(transpose(low, 'P8'));
    }
    return notes;
  }
  const chordSymbol = (root, type) => name(root) + (CHORDS[type] ? CHORDS[type].sym : '?');

  /** Erkennt den Akkordtyp aus Grundton + Tönen in Grundstellung. */
  function identify(notes) {
    const sig = notes.map((n) => ivStr(between(notes[0], n))).join(',');
    return Object.keys(CHORDS).find((k) => CHORDS[k].ivs.join(',') === sig) || null;
  }

  // ---------- Tonarten ----------
  /** Dur-Grundton zur Vorzeichenzahl k (−7 … +7, positiv = Kreuze). */
  function majorTonic(k) {
    const letter = mod(4 * k, 7);
    const acc = mod(mod(7 * k, 12) - STEP_SEMI[letter] + 6, 12) - 6;
    return note(letter, acc, 4);
  }
  const minorTonic = (k) => { const t = majorTonic(k + 3); t.octave = t.letter >= 5 ? 3 : 4; return t; };
  const keyName = (k, minor = false) => minor ? name(minorTonic(k)).toLowerCase() + '-Moll' : name(majorTonic(k)) + '-Dur';
  function fifthsOf(tonic, minor = false) {
    for (let k = -7; k <= 7; k++) if (same(minor ? minorTonic(k) : majorTonic(k), tonic)) return k;
    return null;
  }
  const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6]; // F C G D A E H
  const FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3]; // H E A D G C F
  function keySigNames(k) {
    if (k > 0) return SHARP_ORDER.slice(0, k).map((l) => name(note(l, 1)));
    if (k < 0) return FLAT_ORDER.slice(0, -k).map((l) => name(note(l, -1)));
    return [];
  }
  const sigText = (k) => k === 0 ? 'keine Vorzeichen' : `${Math.abs(k)} ${k > 0 ? '♯' : '♭'}`;

  // ---------- Leitereigene Akkorde ----------
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const FUNCS_MAJOR = ['T', 'Sp', 'Dp', 'S', 'D', 'Tp', 'D⁷ verkürzt'];

  function roman(deg, type) {
    const r = ROMAN[deg];
    if (type === 'maj' || type === 'dom7' || type === 'maj7') return r + (type === 'dom7' ? '⁷' : type === 'maj7' ? 'maj7' : '');
    if (type === 'aug') return r + '+';
    if (type === 'augMaj7') return r + '+maj7';
    if (type === 'minMaj7') return r.toLowerCase() + '(maj7)';
    if (type === 'dim') return r.toLowerCase() + '°';
    if (type === 'hdim7') return r.toLowerCase() + 'ø⁷';
    if (type === 'min7') return r.toLowerCase() + '⁷';
    return r.toLowerCase();
  }

  /** Leitereigene Drei- bzw. Vierklänge in Dur (k) oder Moll. */
  function diatonicChords(k, { minor = false, sevenths = false, scaleType } = {}) {
    const tonic = minor ? minorTonic(k) : majorTonic(k);
    tonic.octave = 3;
    const st = scaleType || (minor ? 'minor' : 'major');
    const s = scale(tonic, st, false);
    const ext = [...s, ...s.map((n) => transpose(n, 'P8')), ...s.map((n) => transpose(n, 'P15'))];
    return s.map((_, i) => {
      const notes = [ext[i], ext[i + 2], ext[i + 4]];
      if (sevenths) notes.push(ext[i + 6]);
      const type = identify(notes);
      return { degree: i, root: ext[i], notes, type, symbol: chordSymbol(ext[i], type), roman: roman(i, type) };
    });
  }

  return {
    EN, DE, STEP_SEMI, PC_NAMES, IV_NAMES, Q_NAMES, SCALES, CHORDS, ROMAN, FUNCS_MAJOR, SHARP_ORDER, FLAT_ORDER,
    mod, note, midi, dia, pc, same, parse, name, helmholtz, fromMidi, isWhiteMidi,
    ivParse, ivStr, ivSemis, transpose, between, ivName, ivNameCap, isPerfectNum,
    scale, chord, chordSymbol, identify,
    majorTonic, minorTonic, keyName, fifthsOf, keySigNames, sigText, diatonicChords, roman,
  };
})();
