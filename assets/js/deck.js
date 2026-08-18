(() => {
'use strict';

const slides   = [...document.querySelectorAll('.slide')];
const prevBtn  = document.getElementById('prev');
const nextBtn  = document.getElementById('next');
const chapter  = document.getElementById('chapter');
const railFill = document.getElementById('railfill');
const curEl    = document.getElementById('cur');
const totEl    = document.getElementById('tot');
const teaser   = document.getElementById('teaser');
const soundBtn = document.getElementById('sound');
const notesBtn = document.getElementById('notesbtn');
const notesPanel = document.getElementById('notespanel');

let i = 0;
// Browsers only allow sound after the viewer has interacted with the page.
// Presenters reach the teaser by pressing a key, so by then we have consent.
let gestured = false;
// Whether the presenter wants the panel open. Remembered across slides.
let wantNotes = false;
// The stylesheet already drops every animation under this; the plate cut has to agree.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

totEl.textContent = slides.length;

/* ── navigation ─────────────────────────────────────── */
/* Two screens that share a data-plate are one picture with two captions — 27 and 28 are
   the same frame, and the deck must not dissolve the art to change the words. So instead
   of the usual .7s crossfade the words fade out on their own, the plates cut, and the new
   words rise. The timer is held here and cancelled on every show(), so arrowing through
   the pair fast lands on the right screen instead of half of two. */
const PLATE_FADE = 350;     // matches .slide--plate .hold in deck.css
let plateTimer = null;
let platePending = null;    // where those 350ms are taking us

function clearPlate(s) {
  s.classList.remove('plate-out');
  s.style.removeProperty('--plate-dim');
}

/* Land the pending screen now instead of waiting out the fade. A second press during
   the pair has to count as a second press, so the deck catches up first and then does
   what was asked — otherwise two taps on 27 would spend one of them on the same move. */
function flushPlate() {
  if (platePending === null) return;
  clearTimeout(plateTimer);
  clearPlate(slides[i]);
  const to = platePending;
  platePending = null;
  swap(to);
}

function show(n) {
  n = Math.max(0, Math.min(slides.length - 1, n));
  flushPlate();
  if (n === i && slides[n].classList.contains('is-on')) return;

  commitNote();               // never lose a half-typed note to an arrow key

  const from = slides[i];
  const samePlate = from.dataset.plate && from.dataset.plate === slides[n].dataset.plate;
  if (samePlate && !reduced) {
    from.style.setProperty('--plate-dim', getComputedStyle(slides[n]).getPropertyValue('--plate-dim').trim());
    from.classList.add('plate-out');
    platePending = n;
    plateTimer = setTimeout(() => { platePending = null; clearPlate(from); swap(n); }, PLATE_FADE);
    return;
  }
  swap(n);
}

function swap(n) {
  leave(slides[i]);
  i = n;
  slides.forEach((s, k) => s.classList.toggle('is-on', k === n));
  enter(slides[n]);
  paint();
  location.hash = String(n + 1);
}

function paint() {
  paintNote();
  chapter.textContent = slides[i].dataset.chapter || '';
  curEl.textContent = i + 1;
  railFill.style.width = ((i + 1) / slides.length * 100) + '%';
  prevBtn.disabled = i === 0;
  nextBtn.disabled = i === slides.length - 1;
}

const go = d => show((platePending === null ? i : platePending) + d);

/* ── per-slide behaviour ────────────────────────────── */
function enter(s) {
  s.querySelectorAll('video[data-loop]').forEach(v => { v.currentTime = 0; v.play().catch(() => {}); });
  if (s.hasAttribute('data-teaser')) playTeaser();
  warm(i + 1);
}

function leave(s) {
  s.querySelectorAll('video').forEach(v => v.pause());
  if (s.hasAttribute('data-teaser')) stopWatching();
}

/* The teaser is 6 MB and the closing reel another 5. Neither can start from cold on
   the frame it appears, so the screen before each one puts the file on the wire. */
const warmed = new WeakSet();
function warm(n) {
  const s = slides[n];
  if (!s) return;
  s.querySelectorAll('video').forEach(v => {
    if (warmed.has(v)) return;
    warmed.add(v);
    if (v.preload === 'none') v.preload = 'auto';
    v.load();
  });
}

/* ── teaser ──────────────────────────────────────────────────────────────
   Screen 9 has to start on its own, and muted playback is the only kind a
   browser will always allow. So: start muted, and lift the mute once it is
   genuinely running and the presenter has given us a gesture to lift it with.
   Nothing here trusts play() to succeed — the watchdog reloads once, and if the
   file still will not move it hands over a button rather than a dead poster. */
let watchdog = null, tries = 0;

function playTeaser() {
  if (!teaser) return;
  stopWatching();
  teaser.currentTime = 0;
  teaser.muted = true;
  tries = 0;
  attempt();
}

function attempt() {
  teaser.play().then(unmute, () => {});
  watchdog = setTimeout(check, 900);
}

function check() {
  if (!onTeaser()) return;
  if (!teaser.paused && teaser.readyState >= 2) return;   // running, nothing to do
  if (++tries <= 2) { teaser.load(); teaser.muted = true; attempt(); }
  else document.body.classList.add('teaser-stuck');
}

function stopWatching() {
  clearTimeout(watchdog);
  watchdog = null;
  document.body.classList.remove('teaser-stuck');
}

const onTeaser = () => !!teaser && slides[i].hasAttribute('data-teaser');

function unmute() {
  if (!gestured || !onTeaser()) return;
  teaser.muted = false;
  // A browser that will not have it answers the unmute with a pause. Take the hint.
  if (teaser.paused) { teaser.muted = true; teaser.play().catch(() => {}); }
}

function paintSound() {
  if (!soundBtn || !teaser) return;
  const on = !teaser.muted;
  soundBtn.classList.toggle('on', on);
  soundBtn.firstElementChild.textContent = on ? 'sound on' : 'sound off';
}

// the label follows the element rather than our hopes for it
if (teaser) ['play', 'pause', 'volumechange'].forEach(e => teaser.addEventListener(e, paintSound));

if (soundBtn) soundBtn.addEventListener('click', e => {
  e.stopPropagation();
  gestured = true;
  teaser.muted = !teaser.muted;
  if (teaser.paused) teaser.play().catch(() => {});
  document.body.classList.remove('teaser-stuck');
});

const playBtn = document.getElementById('teaserplay');
if (playBtn) playBtn.addEventListener('click', e => {
  e.stopPropagation();
  gestured = true;
  playTeaser();
});

/* ── presenter notes ─────────────────────────────────────────────────────
   Written here, in the browser, and kept in this browser's storage. Keyed by
   the slide's data-id and not by its position, so reordering or inserting
   slides never shuffles anyone's notes onto the wrong screen. Export writes
   the whole set to a file; import reads one back. */
const STORE = 'opi-deck-notes-v1';
const viewEl  = document.getElementById('notesview');
const editEl  = document.getElementById('notesedit');
const stateEl = document.getElementById('notesstate');
const slideEl = document.getElementById('notesslide');
const fileEl  = document.getElementById('notesfile');

let notes = load();
let saveTimer = null;

function load() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch { return {}; }
}

/* The paragraphs that used to sit under the story headlines ship in the page as seeds,
   so a note is already there on a browser that has never seen this deck. A seed is only
   a default: once an id exists in `notes` the presenter owns it, and an emptied note is
   stored as "" rather than deleted so clearing one does not bring the seed back. */
const seeds = (() => {
  const el = document.getElementById('seednotes');
  if (!el) return {};
  try { return JSON.parse(el.textContent) || {}; }
  catch { return {}; }
})();

const noteFor = id => (id in notes) ? notes[id] : (seeds[id] || '');

function setNote(id, val) {
  if (val || id in seeds) notes[id] = val;
  else delete notes[id];
}

function persist() {
  try {
    localStorage.setItem(STORE, JSON.stringify(notes));
    flag('saved');
  } catch {
    flag('could not save — storage is full or blocked', true);
  }
}

let flagTimer = null;
function flag(msg, stick) {
  stateEl.textContent = msg;
  stateEl.classList.toggle('warn', !!stick);
  clearTimeout(flagTimer);
  if (!stick) flagTimer = setTimeout(() => { stateEl.textContent = ''; }, 1600);
}

const slideId = () => slides[i].dataset.id || String(i);

/* A deliberately small formatter, so the notes stay readable as plain text in
   the export file: # heading · - bullet · **bold** · __underline__ · *italic* */
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function render(src) {
  if (!src.trim()) return '';
  const inline = s => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/__([^_]+)__/g, '<u>$1</u>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>');
  const out = [];
  let list = false;
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line) { if (list) { out.push('</ul>'); list = false; } continue; }
    if (line.startsWith('#')) {
      if (list) { out.push('</ul>'); list = false; }
      out.push(`<h3>${inline(line.replace(/^#+\s*/, ''))}</h3>`);
    } else if (/^[-*·]\s+/.test(line)) {
      if (!list) { out.push('<ul>'); list = true; }
      out.push(`<li>${inline(line.replace(/^[-*·]\s+/, ''))}</li>`);
    } else {
      if (list) { out.push('</ul>'); list = false; }
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  if (list) out.push('</ul>');
  return out.join('');
}

function paintNote() {
  const id = slideId();
  slideEl.textContent = `${i + 1} · ${slides[i].dataset.chapter || 'Untitled'}`;
  const src = noteFor(id);
  viewEl.innerHTML = render(src) ||
    '<p class="notesempty">No notes on this screen yet. Click here — or press <b>E</b> — to write them.</p>';
  viewEl.scrollTop = 0;
  if (!editEl.hidden) { editEl.value = src; editEl.scrollTop = 0; }
  paintPanel();
}

function paintPanel() {
  document.body.classList.toggle('notes-open', wantNotes);
  notesBtn.setAttribute('aria-expanded', String(wantNotes));
}

function toggleNotes(force) {
  wantNotes = force !== undefined ? force : !wantNotes;
  if (!wantNotes) commitNote();
  paintPanel();
}

function startEdit() {
  if (!wantNotes) toggleNotes(true);
  editEl.value = noteFor(slideId());
  editEl.hidden = false;
  viewEl.hidden = true;
  document.body.classList.add('notes-editing');
  editEl.focus();
  const end = editEl.value.length;
  editEl.setSelectionRange(end, end);
}

function commitNote() {
  if (editEl.hidden) return;
  const id = slideId();
  setNote(id, editEl.value.trim());
  persist();
  editEl.hidden = true;
  viewEl.hidden = false;
  document.body.classList.remove('notes-editing');
  paintNote();
}

viewEl.addEventListener('click', startEdit);
viewEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startEdit(); }
});

// Autosave while typing, so nothing depends on remembering to close the editor.
editEl.addEventListener('input', () => {
  clearTimeout(saveTimer);
  stateEl.textContent = 'editing…';
  saveTimer = setTimeout(() => {
    setNote(slideId(), editEl.value.trim());
    persist();
  }, 600);
});
editEl.addEventListener('blur', commitNote);
editEl.addEventListener('keydown', e => {
  e.stopPropagation();                       // typing must never drive the deck
  if (e.key === 'Escape') { e.preventDefault(); commitNote(); viewEl.focus(); }
});

notesBtn.addEventListener('click', e => { e.stopPropagation(); gestured = true; toggleNotes(); });

/* export / import / clear */
document.getElementById('notesexport').addEventListener('click', () => {
  commitNote();
  const payload = {
    version: 1,
    savedAt: new Date().toISOString().slice(0, 10),
    deck: 'opi-and-the-quiet-ones',
    notes,
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `opi-notes-${payload.savedAt}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  flag(`exported ${Object.keys(notes).length} notes`);
});

document.getElementById('notesimport').addEventListener('click', () => fileEl.click());

fileEl.addEventListener('change', () => {
  const f = fileEl.files && fileEl.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    let incoming;
    try {
      const parsed = JSON.parse(r.result);
      incoming = parsed && parsed.notes ? parsed.notes : parsed;
    } catch { flag('that file is not valid JSON', true); return; }
    if (!incoming || typeof incoming !== 'object') { flag('no notes found in that file', true); return; }
    const n = Object.keys(incoming).length;
    const mine = Object.keys(notes).length;
    if (mine && !confirm(`Import ${n} notes over the ${mine} already here?\nAnything with the same screen is replaced.`)) return;
    notes = Object.assign({}, notes, incoming);
    persist();
    paintNote();
    flag(`imported ${n} notes`);
  };
  r.readAsText(f);
  fileEl.value = '';
});

document.getElementById('notesclear').addEventListener('click', () => {
  const id = slideId();
  if (!noteFor(id)) { flag('nothing to clear here'); return; }
  if (!confirm('Erase the notes on this screen? The others stay.')) return;
  setNote(id, '');          // "" and not delete, so a cleared seed stays cleared
  persist();
  if (!editEl.hidden) { editEl.hidden = true; viewEl.hidden = false; document.body.classList.remove('notes-editing'); }
  paintNote();
});

/* ── the seven-minute clock ──────────────────────────────────────────────
   Counts down from 7:00 and keeps counting once it passes zero, because the
   useful number after the alarm is how far over you are. */
// Seven minutes, unless the URL says otherwise: /?clock=5 for a five-minute slot.
const TARGET = (() => {
  const m = parseFloat(new URLSearchParams(location.search).get('clock'));
  return (m > 0 && m <= 120 ? m : 7) * 60 * 1000;
})();
const clockBtn  = document.getElementById('clock');
const clockTime = document.getElementById('clocktime');
const clockFill = document.getElementById('clockfill');

let started = null, elapsed = 0, ticking = null, rang = false;

const mmss = ms => {
  const t = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

function clockNow() { return elapsed + (started ? Date.now() - started : 0); }

function paintClock() {
  const ms = clockNow();
  const over = ms >= TARGET;
  clockTime.textContent = (over ? '+' : '') + mmss(over ? ms - TARGET : TARGET - ms);
  clockFill.style.width = Math.min(100, ms / TARGET * 100) + '%';
  clockBtn.classList.toggle('running', !!started);
  clockBtn.classList.toggle('over', over);
  if (over && !rang) { rang = true; ring(); }
}

function toggleClock() {
  if (started) { elapsed = clockNow(); started = null; clearInterval(ticking); ticking = null; }
  else { started = Date.now(); ticking = setInterval(paintClock, 250); unlockAudio(); }
  paintClock();
}

function resetClock() {
  if (ticking) clearInterval(ticking);
  started = null; ticking = null; elapsed = 0; rang = false;
  paintClock();
}

/* The alarm is synthesised rather than loaded: no asset, and no request that
   can fail on a festival wifi. Three rising beeps, then one long one. */
let audio = null;
function unlockAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!audio) audio = new AC();
  if (audio.state === 'suspended') audio.resume();
}

function ring() {
  unlockAudio();
  if (!audio) return;
  [[0, 880, 0.16], [0.28, 1046, 0.16], [0.56, 1318, 0.16], [0.92, 1046, 0.7]].forEach(([at, hz, dur]) => {
    const osc = audio.createOscillator(), gain = audio.createGain();
    const t = audio.currentTime + at;
    osc.type = 'sine';
    osc.frequency.value = hz;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  });
  document.body.classList.add('time-up');
  setTimeout(() => document.body.classList.remove('time-up'), 4000);
}

clockBtn.addEventListener('click', e => {
  e.stopPropagation();
  gestured = true;
  if (e.shiftKey) resetClock(); else toggleClock();
});

/* ── input ──────────────────────────────────────────── */
const KEYS_NEXT = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']);
const KEYS_PREV = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace']);

addEventListener('keydown', e => {
  if (e.target === editEl) return;                 // the editor owns its keys
  gestured = true;
  const k = e.key;
  if (k === 'n' || k === 'N') { e.preventDefault(); toggleNotes(); return; }
  if (k === 'e' || k === 'E') { e.preventDefault(); startEdit(); return; }
  if (k === 't') { e.preventDefault(); toggleClock(); return; }
  if (k === 'T') { e.preventDefault(); resetClock(); return; }
  if (k === 'Escape') { toggleNotes(false); return; }
  if (KEYS_NEXT.has(k)) { e.preventDefault(); go(1); }
  else if (KEYS_PREV.has(k)) { e.preventDefault(); go(-1); }
  else if (k === 'Home') { e.preventDefault(); show(0); }
  else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
});

prevBtn.addEventListener('click', () => { gestured = true; go(-1); });
nextBtn.addEventListener('click', () => { gestured = true; go(1); });

/* Anything that can genuinely scroll scrolls itself instead of turning the page:
   the notes panel, and on a narrow window the back-half screens that stack and
   overflow. Measured at event time, so on a laptop — where nothing overflows —
   the wheel still moves the deck. */
function scrolls(el) {
  if (el && el.closest && el.closest('.notespanel')) return true;
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    if (n.scrollHeight > n.clientHeight + 2) {
      const oy = getComputedStyle(n).overflowY;
      if (oy === 'auto' || oy === 'scroll') return true;
    }
  }
  return false;
}

let wheelLock = 0;
addEventListener('wheel', e => {
  gestured = true;
  if (scrolls(e.target)) return;
  const now = Date.now();
  if (now - wheelLock < 700 || Math.abs(e.deltaY) < 12) return;
  wheelLock = now;
  go(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

let touchY = null;
addEventListener('touchstart', e => {
  gestured = true;
  touchY = scrolls(e.target) ? null : e.touches[0].clientY;
}, { passive: true });
addEventListener('touchend', e => {
  if (touchY === null) return;
  const d = touchY - e.changedTouches[0].clientY;
  if (Math.abs(d) > 55) go(d > 0 ? 1 : -1);
  touchY = null;
}, { passive: true });

// Deep links: /#12 jumps straight to a slide, and editing the hash by hand works too.
addEventListener('hashchange', () => {
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= slides.length) show(n - 1);
});

// A note being typed when the tab closes is still a note.
addEventListener('beforeunload', commitNote);
addEventListener('visibilitychange', () => { if (document.hidden) commitNote(); });

/* ── boot ───────────────────────────────────────────── */
const start = parseInt(location.hash.slice(1), 10);
if (start >= 1 && start <= slides.length) {
  slides.forEach((s, k) => s.classList.toggle('is-on', k === start - 1));
  i = start - 1;
}
paint();
paintClock();
enter(slides[i]);
})();
