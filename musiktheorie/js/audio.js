'use strict';
/* Einfache Klangerzeugung mit der Web Audio API (klavierähnlicher Ton + Metronom-Klick). */
const Sound = (() => {
  let ctx = null, master = null;
  let active = [];
  let volume = 0.7;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = volume * 0.5;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function tone(m, t0, dur = 1.2, vel = 0.8) {
    const f = freq(m);
    const out = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(f * 8, 12000), t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(f * 2, 400), t0 + dur);
    filter.connect(out);
    out.connect(master);

    // tiefe Töne etwas lauter, hohe etwas leiser
    const level = vel * Math.min(1.2, Math.max(0.5, 1.3 - (m - 48) / 60));
    out.gain.setValueAtTime(0.0001, t0);
    out.gain.exponentialRampToValueAtTime(level, t0 + 0.008);
    out.gain.exponentialRampToValueAtTime(level * 0.45, t0 + 0.25);
    out.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    const partials = [[1, 'triangle', 0.9], [2, 'sine', 0.35], [3, 'sine', 0.12], [4, 'sine', 0.05]];
    const oscs = partials.map(([mult, type, g]) => {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = type;
      o.frequency.value = f * mult;
      o.detune.value = (Math.random() - 0.5) * 4;
      og.gain.value = g;
      o.connect(og);
      og.connect(filter);
      o.start(t0);
      o.stop(t0 + dur + 0.05);
      return o;
    });
    const entry = { oscs, out };
    active.push(entry);
    oscs[0].onended = () => { active = active.filter((e) => e !== entry); };
  }

  /** Spielt MIDI-Töne. mode: 'chord' (gleichzeitig), 'melody' (nacheinander), 'arp' (gebrochen + Akkord). */
  function play(midis, { mode = 'melody', gap = 0.55, dur, delay = 0, stopPrev = true } = {}) {
    if (!ensure()) return 0;
    if (stopPrev) stop();
    const list = Array.isArray(midis) ? midis : [midis];
    const t = ctx.currentTime + 0.03 + delay;
    if (mode === 'chord') {
      list.forEach((m) => tone(m, t, dur || 1.8, 0.7 / Math.sqrt(list.length)));
      return (dur || 1.8);
    }
    if (mode === 'arp') {
      list.forEach((m, i) => tone(m, t + i * gap, dur || 1.4, 0.7));
      const tc = t + list.length * gap;
      list.forEach((m) => tone(m, tc, 1.8, 0.7 / Math.sqrt(list.length)));
      return list.length * gap + 1.8;
    }
    list.forEach((m, i) => tone(m, t + i * gap, dur || gap * 1.6, 0.75));
    return list.length * gap + 0.5;
  }

  /** Spielt eine Folge von Akkorden (Array von MIDI-Arrays). */
  function progression(chords, { gap = 1.0, dur = 1.1 } = {}) {
    if (!ensure()) return 0;
    stop();
    const t = ctx.currentTime + 0.05;
    chords.forEach((c, i) => c.forEach((m) => tone(m, t + i * gap, i === chords.length - 1 ? 2 : dur, 0.6 / Math.sqrt(c.length))));
    return chords.length * gap + 1;
  }

  /** Spielt einen Rhythmus: [{midi|null, beats}] bei gegebenem Tempo (Viertel pro Minute). */
  function rhythm(events, bpm = 90, { countIn = 0 } = {}) {
    if (!ensure()) return 0;
    stop();
    const spb = 60 / bpm;
    let t = ctx.currentTime + 0.05;
    for (let i = 0; i < countIn; i++) { clickAt(t, i === 0); t += spb; }
    events.forEach((e) => {
      if (e.midi != null) tone(e.midi, t, Math.max(0.15, e.beats * spb * 0.9), 0.8);
      t += e.beats * spb;
    });
    return t - ctx.currentTime;
  }

  function clickAt(t, accent) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = accent ? 1760 : 1100;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(accent ? 0.5 : 0.3, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 0.06);
  }

  function click(accent = false, when = 0) {
    if (!ensure()) return;
    clickAt(Math.max(ctx.currentTime, when || ctx.currentTime), accent);
  }

  function stop() {
    if (!ctx) return;
    const now = ctx.currentTime;
    active.forEach(({ oscs, out }) => {
      try {
        out.gain.cancelScheduledValues(now);
        out.gain.setValueAtTime(out.gain.value, now);
        out.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        oscs.forEach((o) => o.stop(now + 0.05));
      } catch (e) { /* bereits gestoppt */ }
    });
    active = [];
  }

  function setVolume(v) {
    volume = v;
    if (master) master.gain.value = v * 0.5;
  }

  return { ensure, play, progression, rhythm, click, stop, setVolume, get ctx() { return ensure(); }, get volume() { return volume; } };
})();
