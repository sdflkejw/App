'use strict';
/* Hauptanwendung: Routing, Navigation, Fortschritt, Lektionen und Quiz. */
const Progress = (() => {
  const KEY = 'musiktheorie-progress-v1';
  let data = { lessons: {}, ex: {}, days: [], answered: 0, correct: 0 };
  try { Object.assign(data, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* Speicher nicht verfügbar */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignorieren */ } };
  const today = () => new Date().toISOString().slice(0, 10);
  function touchDay() { const d = today(); if (!data.days.includes(d)) { data.days.push(d); data.days = data.days.slice(-400); save(); } }
  return {
    get data() { return data; },
    lessonDone: (id) => !!data.lessons[id],
    setLesson(id, v = true) { if (v) data.lessons[id] = Date.now(); else delete data.lessons[id]; touchDay(); save(); },
    answer(ok) { data.answered++; if (ok) data.correct++; touchDay(); save(); },
    result(exId, level, correct, total) {
      const e = data.ex[exId] || (data.ex[exId] = { best: [0, 0, 0], rounds: 0 });
      const pct = Math.round(100 * correct / total);
      e.best[level] = Math.max(e.best[level] || 0, pct);
      e.rounds++;
      save();
      return pct;
    },
    exBest: (exId) => { const e = data.ex[exId]; return e ? Math.max(...e.best) : null; },
    exInfo: (exId) => data.ex[exId] || null,
    streak() {
      const set = new Set(data.days);
      let n = 0;
      const d = new Date();
      if (!set.has(today())) d.setDate(d.getDate() - 1);
      while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    reset() { data = { lessons: {}, ex: {}, days: [], answered: 0, correct: 0 }; save(); },
    export: () => JSON.stringify(data),
  };
})();

const App = (() => {
  const T = Theory;
  const main = document.getElementById('main');
  const sidebar = document.getElementById('sidebar');
  const EX = Exercises.EX;
  const chapters = Course.chapters;
  const allLessons = chapters.flatMap((c) => c.lessons.map((l) => ({ ...l, chapter: c })));
  const chapterOfEx = (id) => chapters.find((c) => c.exercises.includes(id));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------------------------------------------------------------- Theme & Lautstärke
  function initChrome() {
    const saved = (() => { try { return localStorage.getItem('mt-theme'); } catch (e) { return null; } })();
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
    document.getElementById('themeBtn').onclick = () => {
      const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = t;
      try { localStorage.setItem('mt-theme', t); } catch (e) { /* */ }
    };
    const vol = document.getElementById('volume');
    try { const v = localStorage.getItem('mt-volume'); if (v !== null) { vol.value = v; Sound.setVolume(+v); } } catch (e) { /* */ }
    vol.oninput = () => { Sound.setVolume(+vol.value); try { localStorage.setItem('mt-volume', vol.value); } catch (e) { /* */ } };
    document.getElementById('menuBtn').onclick = () => document.body.classList.toggle('nav-open');
    document.getElementById('backdrop').onclick = () => document.body.classList.remove('nav-open');
  }

  // ---------------------------------------------------------------- Navigation
  function chapterProgress(c) {
    const total = c.lessons.length + c.exercises.length;
    const done = c.lessons.filter((l) => Progress.lessonDone(l.id)).length + c.exercises.filter((e) => (Progress.exBest(e) || 0) >= 80).length;
    return { done, total, pct: Math.round(100 * done / total) };
  }

  function renderSidebar(route) {
    const openId = route.chapter || null;
    let s = `<a class="nav-link nav-top${route.view === 'home' ? ' active' : ''}" href="#/">🏠 Übersicht</a>`;
    s += '<div class="nav-section">Kurs</div>';
    chapters.forEach((c, i) => {
      const pr = chapterProgress(c);
      s += `<details class="nav-chapter"${c.id === openId ? ' open' : ''}><summary><span class="nav-num">${i + 1}</span>${c.title}<span class="nav-mini">${pr.pct}%</span><span class="chev">›</span></summary>`;
      s += '<div class="nav-sub">Lektionen</div>';
      c.lessons.forEach((l) => {
        const act = route.view === 'lesson' && route.id === l.id;
        s += `<a class="nav-link${act ? ' active' : ''}" href="#/lektion/${l.id}">${l.title}${Progress.lessonDone(l.id) ? '<span class="nav-check">✓</span>' : ''}</a>`;
      });
      s += '<div class="nav-sub">Übungen</div>';
      c.exercises.forEach((e) => {
        const act = route.view === 'quiz' && route.id === e;
        const b = Progress.exBest(e);
        s += `<a class="nav-link${act ? ' active' : ''}" href="#/uebung/${e}">${EX[e].ear ? '👂 ' : '✏️ '}${EX[e].title}${b !== null ? `<span class="nav-mini">${b}%</span>` : ''}</a>`;
      });
      s += '</details>';
    });
    s += '<div class="nav-section">Training</div>';
    s += `<a class="nav-link${route.view === 'quiz' && route.id === 'mix' ? ' active' : ''}" href="#/uebung/mix">🎲 Gemischtes Training</a>`;
    s += `<a class="nav-link${route.view === 'exlist' ? ' active' : ''}" href="#/uebungen">📋 Alle Übungen</a>`;
    s += '<div class="nav-section">Werkzeuge</div>';
    Object.entries(Tools.TOOLS).forEach(([id, t]) => {
      s += `<a class="nav-link${route.view === 'tool' && route.id === id ? ' active' : ''}" href="#/werkzeug/${id}">${t.icon} ${t.title}</a>`;
    });
    sidebar.innerHTML = s;
  }

  // ---------------------------------------------------------------- Ansichten
  function viewHome() {
    const d = Progress.data;
    const lessonsDone = allLessons.filter((l) => Progress.lessonDone(l.id)).length;
    const next = allLessons.find((l) => !Progress.lessonDone(l.id));
    const rate = d.answered ? Math.round(100 * d.correct / d.answered) : 0;
    main.innerHTML = `
      <section class="hero">
        <div class="hero-deco">𝄞</div>
        <h1>Musiktheorie lernen</h1>
        <p>Von den ersten Notennamen bis zur Harmonielehre: ${allLessons.length} Lektionen, ${Object.keys(EX).length - 1} interaktive Übungen mit drei Schwierigkeitsstufen und praktische Werkzeuge – mit Klang, Notenbild und Klaviatur.</p>
        <div class="btn-row">
          ${next ? `<a class="btn" href="#/lektion/${next.id}">▶ ${lessonsDone ? 'Weiterlernen' : 'Jetzt starten'}: ${esc(next.title)}</a>` : '<a class="btn" href="#/uebung/mix">🎲 Gemischtes Training</a>'}
        </div>
      </section>
      <div class="stats">
        <div class="stat"><b>${lessonsDone}/${allLessons.length}</b><span>Lektionen gelesen</span></div>
        <div class="stat"><b>${d.answered}</b><span>Aufgaben beantwortet</span></div>
        <div class="stat"><b>${rate}%</b><span>Trefferquote</span></div>
        <div class="stat"><b>${Progress.streak()} 🔥</b><span>Tage in Folge</span></div>
      </div>
      <h2>Kapitel</h2>
      <div class="grid grid-2">
        ${chapters.map((c, i) => {
          const pr = chapterProgress(c);
          return `<a class="card chapter-card" href="#/lektion/${c.lessons[0].id}">
            <h3><span class="chapter-icon">${c.icon}</span> ${i + 1}. ${c.title}</h3>
            <p>${c.desc}</p>
            <div class="small muted">${c.lessons.length} Lektionen · ${c.exercises.length} Übungen</div>
            <div class="bar"><span style="width:${pr.pct}%"></span></div>
          </a>`;
        }).join('')}
      </div>
      <h2>Werkzeuge</h2>
      <div class="grid grid-3">
        ${Object.entries(Tools.TOOLS).map(([id, t]) => `<a class="card chapter-card" href="#/werkzeug/${id}"><h3><span class="chapter-icon">${t.icon}</span> ${t.title}</h3><p>${t.desc}</p></a>`).join('')}
      </div>
      <h2>So funktioniert's</h2>
      <div class="card">
        <ol style="margin:0;padding-left:20px">
          <li>Arbeite die <b>Lektionen</b> der Reihe nach durch. Alle Notenbeispiele kannst du dir anhören.</li>
          <li>Festige das Gelernte mit den <b>Übungen</b> am Ende jedes Kapitels. Jede Übung hat drei Stufen.</li>
          <li>Ein Kapitel gilt als abgeschlossen, wenn alle Lektionen gelesen und alle Übungen mit mindestens 80 % bestanden sind.</li>
          <li>Dein Fortschritt wird automatisch in diesem Browser gespeichert.</li>
        </ol>
        <div class="btn-row" style="margin-top:14px"><button class="btn ghost small" id="resetBtn">Fortschritt zurücksetzen</button></div>
      </div>`;
    main.querySelector('#resetBtn').onclick = () => {
      if (confirm('Wirklich den gesamten Lernfortschritt löschen?')) { Progress.reset(); route(); }
    };
  }

  function viewLesson(id) {
    const idx = allLessons.findIndex((l) => l.id === id);
    if (idx < 0) return viewNotFound();
    const l = allLessons[idx];
    const c = l.chapter;
    const prev = allLessons[idx - 1], next = allLessons[idx + 1];
    const isLastOfChapter = c.lessons[c.lessons.length - 1].id === l.id;
    const lNum = c.lessons.indexOf(c.lessons.find((x) => x.id === l.id)) + 1;
    const cNum = chapters.indexOf(c) + 1;
    main.innerHTML = `
      <div class="crumbs"><a href="#/">Übersicht</a> › ${cNum}. ${c.title}</div>
      <article class="lesson">
        <h1>${cNum}.${lNum} ${l.title}</h1>
        ${l.html}
      </article>
      <div class="card done-box">
        <div><b>${Progress.lessonDone(l.id) ? '✓ Lektion abgeschlossen' : 'Fertig gelesen?'}</b><div class="small muted">Übe das Gelernte direkt:</div>
          <div class="ex-links">${c.exercises.map((e) => `<a class="btn play-btn" href="#/uebung/${e}">${EX[e].ear ? '👂' : '✏️'} ${EX[e].title}</a>`).join('')}</div>
        </div>
        <button class="btn ${Progress.lessonDone(l.id) ? '' : 'primary'}" id="doneBtn">${Progress.lessonDone(l.id) ? 'Als ungelesen markieren' : '✓ Als gelesen markieren'}</button>
      </div>
      <nav class="lesson-nav">
        ${prev ? `<a class="btn" href="#/lektion/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
        ${isLastOfChapter ? `<a class="btn primary" href="#/uebung/${c.exercises[0]}">Zu den Übungen →</a>` : (next ? `<a class="btn primary" href="#/lektion/${next.id}">${esc(next.title)} →</a>` : '')}
      </nav>`;
    Widgets.hydrate(main);
    main.querySelector('#doneBtn').onclick = () => {
      const done = Progress.lessonDone(l.id);
      Progress.setLesson(l.id, !done);
      if (!done && next && !isLastOfChapter) location.hash = '#/lektion/' + next.id;
      else route();
    };
  }

  function viewExList() {
    const items = (list) => list.map((e) => {
      const b = Progress.exBest(e);
      return `<a class="card" href="#/uebung/${e}"><h3>${EX[e].ear ? '👂' : '✏️'} ${EX[e].title}</h3><span class="small muted">${EX[e].desc}</span>${b !== null ? `<span class="pill${b >= 80 ? ' good' : ''}">Bestwert ${b}%</span>` : '<span class="ex-tag">noch nicht geübt</span>'}</a>`;
    }).join('');
    main.innerHTML = `<h1>📋 Alle Übungen</h1>
      <div class="ex-list"><div class="grid grid-2">${items(['mix'])}</div></div>
      ${chapters.map((c, i) => `<h2>${c.icon} ${i + 1}. ${c.title}</h2><div class="ex-list"><div class="grid grid-2">${items(c.exercises)}</div></div>`).join('')}`;
  }

  function viewTool(id) {
    if (!Tools.TOOLS[id]) return viewNotFound();
    Tools.render(id, main);
  }

  function viewNotFound() {
    main.innerHTML = '<h1>Seite nicht gefunden</h1><p><a href="#/">Zur Übersicht</a></p>';
  }

  // ---------------------------------------------------------------- Quiz
  const ROUND = 10;
  let quizKeyHandler = null;

  function viewQuiz(exId) {
    const ex = EX[exId];
    if (!ex) return viewNotFound();
    const c = chapterOfEx(exId);
    const info = Progress.exInfo(exId);
    let level = 0;
    try { level = +(localStorage.getItem('mt-level-' + exId) || 0); } catch (e) { /* */ }
    let state;

    main.innerHTML = `
      <div class="crumbs"><a href="#/">Übersicht</a> › ${c ? `<a href="#/lektion/${c.lessons[0].id}">${c.title}</a>` : 'Training'} › Übung</div>
      <div class="quiz-head">
        <h1>${ex.ear ? '👂' : '✏️'} ${ex.title}</h1>
        <div class="levels" role="group" aria-label="Schwierigkeit">${ex.levels.map((lv, i) => `<button data-l="${i}" title="${lv}">${'●'.repeat(i + 1)}${'○'.repeat(2 - i)} ${lv}</button>`).join('')}</div>
      </div>
      <p class="muted" style="margin-top:0">${ex.desc}</p>
      <div class="quiz-progress"><span id="qNum"></span><div class="bar"><span id="qBar" style="width:0"></span></div><span id="qScore"></span></div>
      <div class="card quiz-card" id="qCard"></div>
      <p class="small muted" style="margin-top:10px">Tastatur: <kbd>1</kbd>–<kbd>9</kbd> Antwort wählen · <kbd>Enter</kbd> weiter · <kbd>R</kbd> nochmal anhören</p>`;
    const card = main.querySelector('#qCard');

    const setLevel = (l) => {
      level = l;
      try { localStorage.setItem('mt-level-' + exId, l); } catch (e) { /* */ }
      main.querySelectorAll('.levels button').forEach((b) => b.classList.toggle('on', +b.dataset.l === l));
      newRound();
    };
    main.querySelectorAll('.levels button').forEach((b) => b.onclick = () => setLevel(+b.dataset.l));

    function newRound() {
      state = { n: 0, correct: 0, q: null, answered: false, history: [] };
      nextQuestion();
    }

    function updateBar() {
      main.querySelector('#qNum').textContent = `Frage ${Math.min(state.n, ROUND)} / ${ROUND}`;
      main.querySelector('#qBar').style.width = (100 * (state.n - (state.answered ? 0 : 1)) / ROUND) + '%';
      main.querySelector('#qScore').textContent = `${state.correct} richtig`;
    }

    function nextQuestion() {
      Sound.stop();
      if (state.n >= ROUND) return showResult();
      state.n++;
      state.answered = false;
      let q;
      for (let tries = 0; tries < 20; tries++) {
        q = ex.gen(level);
        const sig = q.prompt + '|' + q.answer + '|' + JSON.stringify(q.piano?.hl || '');
        if (!state.history.includes(sig) || tries === 19) { state.history.push(sig); break; }
      }
      state.q = q;
      updateBar();
      renderQuestion(q);
    }

    function renderQuestion(q) {
      let html = `<p class="q-prompt">${q.prompt}</p>`;
      if (q.staff) html += `<div class="q-visual">${Staff.render({ ...q.staff, scale: q.staff.scale || 1.7 })}</div>`;
      if (q.piano && q.input !== 'piano' && q.input !== 'sequence') html += '<div class="q-visual piano-wrap" id="qPianoShow"></div>';
      if (q.audio) {
        html += `<div class="q-audio"><button class="btn ${q.audioOptional ? '' : 'primary big-play'}" id="qPlay">▶ ${q.audioOptional ? 'Anhören' : 'Abspielen'}</button>` +
          (q.extraAudio || []).map((x, i) => `<button class="btn" data-xa="${i}">▶ ${x[0]}</button>`).join('') + '</div>';
      }
      if (q.input === 'piano' || q.input === 'sequence') html += '<div class="q-visual piano-wrap" id="qPianoIn"></div>';
      else html += `<div class="options">${q.options.map((o, i) => `<button class="opt" data-v="${esc(o)}">${i < 9 ? `<span class="k">${i + 1}</span>` : ''}${esc(o)}</button>`).join('')}</div>`;
      html += '<div class="feedback" id="qFb"></div>';
      card.innerHTML = html;

      if (q.piano && q.input !== 'piano' && q.input !== 'sequence') {
        const p = Piano(card.querySelector('#qPianoShow'), { from: q.piano.from, to: q.piano.to, labels: q.piano.labels || 'none' });
        p.highlight(q.piano.hl || []);
      }
      if (q.audio) {
        card.querySelector('#qPlay').onclick = () => q.audio();
        card.querySelectorAll('[data-xa]').forEach((b) => b.onclick = () => q.extraAudio[+b.dataset.xa][1]());
        if (!q.audioOptional) setTimeout(() => { if (state.q === q) q.audio(); }, 250);
      }
      if (q.input === 'piano') {
        const p = Piano(card.querySelector('#qPianoIn'), {
          from: q.piano.from, to: q.piano.to, labels: q.piano.labels || 'c',
          onPress: (m) => {
            if (state.answered) return;
            const ok = q.exact ? m === q.pianoAnswer : T.mod(m, 12) === q.pianoAnswer;
            p.keys.get(m).classList.add(ok ? 'good' : 'bad');
            if (!ok) p.highlight(q.correctMidis || [], 'good');
            finish(ok, ok ? null : (q.exact ? T.helmholtz(T.fromMidi(m)) : T.PC_NAMES[T.mod(m, 12)]));
            p.setDisabled(true);
          },
        });
      } else if (q.input === 'sequence') {
        let idx = 0;
        const p = Piano(card.querySelector('#qPianoIn'), {
          from: q.piano.from, to: q.piano.to, labels: q.piano.labels || 'white',
          onPress: (m) => {
            if (state.answered) return;
            if (m === q.seq[idx]) {
              p.keys.get(m).classList.add('good');
              setTimeout(() => p.keys.get(m)?.classList.remove('good'), 300);
              idx++;
              if (idx === q.seq.length) { finish(true); p.setDisabled(true); }
            } else {
              p.keys.get(m).classList.add('bad');
              finish(false, `Ton ${idx + 1}: ${T.name(T.fromMidi(m))} statt ${T.name(T.fromMidi(q.seq[idx]))}`);
              p.setDisabled(true);
              setTimeout(() => Sound.play(q.seq, { gap: 0.55 }), 500);
            }
          },
        });
        if (q.piano.hl2) p.highlight(q.piano.hl2, 'hl2');
      } else {
        card.querySelectorAll('.opt').forEach((b) => b.onclick = () => choose(b));
      }
    }

    function choose(btn) {
      if (state.answered) return;
      const v = btn.dataset.v;
      const ok = v === state.q.answer;
      card.querySelectorAll('.opt').forEach((b) => {
        b.disabled = true;
        if (b.dataset.v === state.q.answer) b.classList.add('correct');
      });
      if (!ok) btn.classList.add('wrong');
      finish(ok, ok ? null : v);
    }

    function finish(ok, given) {
      const q = state.q;
      state.answered = true;
      if (ok) state.correct++;
      Progress.answer(ok);
      updateBar();
      const fb = card.querySelector('#qFb');
      fb.className = 'feedback show ' + (ok ? 'good' : 'bad');
      const praise = ['Richtig!', 'Sehr gut!', 'Genau!', 'Super!', 'Prima!'];
      fb.innerHTML = `<h4>${ok ? '✓ ' + praise[Math.floor(Math.random() * praise.length)] : '✗ Leider falsch'}</h4>` +
        (!ok && given ? `<div class="small">Deine Antwort: ${esc(given)} · Richtig: <b>${esc(q.answer)}</b></div>` : '') +
        `<div>${q.explain || ''}</div>` +
        (q.reveal ? `<div class="q-visual">${Staff.render({ ...q.reveal, scale: 1.25 })}</div>` : '') +
        `<div class="feedback-actions">${q.audio ? '<button class="btn" id="fbReplay">▶ Nochmal hören</button>' : ''}<button class="btn primary" id="qNext">${state.n >= ROUND ? 'Ergebnis anzeigen' : 'Weiter →'}</button></div>`;
      if (q.audio) fb.querySelector('#fbReplay').onclick = () => q.audio();
      fb.querySelector('#qNext').onclick = nextQuestion;
      if (q.onReveal) q.onReveal();
      fb.querySelector('#qNext').focus({ preventScroll: true });
      fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function showResult() {
      const pct = Progress.result(exId, level, state.correct, ROUND);
      const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
      const msg = pct === 100 ? 'Perfekt! Probiere die nächste Stufe.' : pct >= 80 ? 'Sehr gut – bestanden!' : pct >= 50 ? 'Gut gemacht! Mit etwas Übung schaffst du 80 %.' : 'Nicht aufgeben – lies die Lektion nochmal und versuche es erneut.';
      main.querySelector('#qBar').style.width = '100%';
      card.innerHTML = `<div class="result">
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <div class="score">${pct}%</div>
        <p>${state.correct} von ${ROUND} richtig · Stufe „${ex.levels[level]}"</p>
        <p class="muted">${msg}</p>
        <div class="btn-row" style="justify-content:center">
          <button class="btn primary" id="again">↻ Nochmal</button>
          ${level < 2 && pct >= 80 ? '<button class="btn" id="up">Nächste Stufe →</button>' : ''}
          ${c ? `<a class="btn" href="#/lektion/${c.lessons[0].id}">Zur Lektion</a>` : ''}
        </div></div>`;
      card.querySelector('#again').onclick = newRound;
      card.querySelector('#up')?.addEventListener('click', () => setLevel(level + 1));
      renderSidebar(currentRoute);
    }

    quizKeyHandler = (e) => {
      if (e.target.closest('input, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (!state || !state.q) return;
      if (e.key === 'Enter' && state.answered) { e.preventDefault(); card.querySelector('#qNext, #again')?.click(); return; }
      if ((e.key === 'r' || e.key === 'R') && state.q.audio) { state.q.audio(); return; }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9 && !state.answered) {
        const b = card.querySelectorAll('.opt')[n - 1];
        if (b) choose(b);
      }
    };
    window.addEventListener('keydown', quizKeyHandler);
    setLevel(Math.min(level, ex.levels.length - 1));
    void info;
  }

  // ---------------------------------------------------------------- Router
  let currentRoute = { view: 'home' };
  function parseHash() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!parts.length) return { view: 'home' };
    if (parts[0] === 'lektion') { const l = allLessons.find((x) => x.id === parts[1]); return { view: 'lesson', id: parts[1], chapter: l?.chapter.id }; }
    if (parts[0] === 'uebung') return { view: 'quiz', id: parts[1], chapter: chapterOfEx(parts[1])?.id };
    if (parts[0] === 'uebungen') return { view: 'exlist' };
    if (parts[0] === 'werkzeug') return { view: 'tool', id: parts[1] };
    return { view: '404' };
  }

  function route() {
    Sound.stop();
    Tools.cleanup();
    if (quizKeyHandler) { window.removeEventListener('keydown', quizKeyHandler); quizKeyHandler = null; }
    currentRoute = parseHash();
    renderSidebar(currentRoute);
    document.body.classList.remove('nav-open');
    const r = currentRoute;
    if (r.view === 'home') viewHome();
    else if (r.view === 'lesson') viewLesson(r.id);
    else if (r.view === 'quiz') viewQuiz(r.id);
    else if (r.view === 'exlist') viewExList();
    else if (r.view === 'tool') viewTool(r.id);
    else viewNotFound();
    const titles = { home: 'Übersicht', lesson: allLessons.find((l) => l.id === r.id)?.title, quiz: EX[r.id]?.title, exlist: 'Alle Übungen', tool: Tools.TOOLS[r.id]?.title };
    document.title = (titles[r.view] ? titles[r.view] + ' · ' : '') + 'Musiktheorie lernen';
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  initChrome();
  window.addEventListener('hashchange', route);
  route();
  return { route };
})();
