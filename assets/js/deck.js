(() => {
'use strict';

const slides  = [...document.querySelectorAll('.slide')];
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const chapter = document.getElementById('chapter');
const railFill = document.getElementById('railfill');
const teaser  = document.getElementById('teaser');
const soundBtn = document.getElementById('sound');

let i = 0;
// Browsers only allow sound after the viewer has interacted with the page.
// Presenters reach the teaser by pressing a key, so by then we have consent.
let gestured = false;
let fromHash = false;

/* ── navigation ─────────────────────────────────────── */
function show(n) {
  n = Math.max(0, Math.min(slides.length - 1, n));
  if (n === i && slides[n].classList.contains('is-on')) return;
  leave(slides[i]);
  i = n;
  slides.forEach((s, k) => s.classList.toggle('is-on', k === n));
  enter(slides[n]);
  paint();
  fromHash = true;                       // our own write — don't let hashchange bounce it back
  location.hash = String(n + 1);
}

function paint() {
  chapter.textContent = slides[i].dataset.chapter || '';
  railFill.style.width = ((i + 1) / slides.length * 100) + '%';
  prevBtn.disabled = i === 0;
  nextBtn.disabled = i === slides.length - 1;
}

const go = d => show(i + d);

/* ── per-slide behaviour ────────────────────────────── */
function enter(s) {
  s.querySelectorAll('video[data-loop]').forEach(v => { v.currentTime = 0; v.play().catch(() => {}); });
  if (s.hasAttribute('data-teaser')) playTeaser();
  if (s.hasAttribute('data-story')) startStory(s);
}

function leave(s) {
  s.querySelectorAll('video').forEach(v => v.pause());
  if (s.hasAttribute('data-story')) stopStory();
}

/* ── teaser ─────────────────────────────────────────── */
function playTeaser() {
  if (!teaser) return;
  teaser.currentTime = 0;
  teaser.muted = !gestured;
  teaser.play().catch(() => { teaser.muted = true; teaser.play().catch(() => {}); });
  paintSound();
}

function paintSound() {
  if (!soundBtn || !teaser) return;
  const on = !teaser.muted;
  soundBtn.classList.toggle('on', on);
  soundBtn.firstElementChild.textContent = on ? 'sound on' : 'sound off';
}

if (soundBtn) soundBtn.addEventListener('click', e => {
  e.stopPropagation();
  teaser.muted = !teaser.muted;
  if (!teaser.muted && teaser.paused) teaser.play().catch(() => {});
  paintSound();
});

/* ── story slideshow ────────────────────────────────── */
const show_ = document.getElementById('show');
const frames = show_ ? [...show_.children] : [];
let storyAt = 0, storyTimer = null;

// Seconds per image, read from --beat so the pacing lives in one place.
function beat() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--beat').trim();
  const n = parseFloat(v) || 2;
  return /ms$/.test(v) ? n : n * 1000;
}

function startStory() {
  if (!frames.length) return;
  stopStory();
  frames.forEach((f, k) => f.classList.toggle('on', k === storyAt));
  storyTimer = setInterval(() => {
    frames[storyAt].classList.remove('on');
    storyAt = (storyAt + 1) % frames.length;   // loops for as long as he keeps talking
    frames[storyAt].classList.add('on');
  }, beat());
}

function stopStory() {
  if (storyTimer) { clearInterval(storyTimer); storyTimer = null; }
}

/* ── synopsis panel ─────────────────────────────────── */
const eye = document.getElementById('eye');
const synopsis = document.getElementById('synopsis');
if (eye && synopsis) eye.addEventListener('click', e => {
  e.stopPropagation();
  const open = eye.getAttribute('aria-expanded') === 'true';
  eye.setAttribute('aria-expanded', String(!open));
  synopsis.hidden = open;
});

/* ── input ──────────────────────────────────────────── */
const KEYS_NEXT = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']);
const KEYS_PREV = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace']);

addEventListener('keydown', e => {
  gestured = true;
  if (KEYS_NEXT.has(e.key)) { e.preventDefault(); go(1); }
  else if (KEYS_PREV.has(e.key)) { e.preventDefault(); go(-1); }
  else if (e.key === 'Home') { e.preventDefault(); show(0); }
  else if (e.key === 'End') { e.preventDefault(); show(slides.length - 1); }
});

prevBtn.addEventListener('click', () => { gestured = true; go(-1); });
nextBtn.addEventListener('click', () => { gestured = true; go(1); });

let wheelLock = 0;
addEventListener('wheel', e => {
  gestured = true;
  const now = Date.now();
  if (now - wheelLock < 700 || Math.abs(e.deltaY) < 12) return;
  wheelLock = now;
  go(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

let touchY = null;
addEventListener('touchstart', e => { gestured = true; touchY = e.touches[0].clientY; }, { passive: true });
addEventListener('touchend', e => {
  if (touchY === null) return;
  const d = touchY - e.changedTouches[0].clientY;
  if (Math.abs(d) > 55) go(d > 0 ? 1 : -1);
  touchY = null;
}, { passive: true });

// Deep links: /#12 jumps straight to a slide, and editing the hash by hand works too.
addEventListener('hashchange', () => {
  if (fromHash) { fromHash = false; return; }
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= slides.length) show(n - 1);
});

/* ── boot ───────────────────────────────────────────── */
const start = parseInt(location.hash.slice(1), 10);
if (start >= 1 && start <= slides.length) {
  slides.forEach((s, k) => s.classList.toggle('is-on', k === start - 1));
  i = start - 1;
}
paint();
enter(slides[i]);
})();
