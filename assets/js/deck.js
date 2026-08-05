/* ============================================================
   OPI AND THE QUIET ONES — deck runtime
   ← → space   move          N  presenter notes
   O           overview      T  rehearsal timer
   P           resume synopsis autoplay
   F           fullscreen    Esc close
   ============================================================ */
(function () {
  'use strict';

  var slides   = [].slice.call(document.querySelectorAll('.slide'));
  var progress = document.getElementById('progress');
  var chapEl   = document.getElementById('chap');
  var numEl    = document.getElementById('num');
  var overview = document.getElementById('overview');
  var ovGrid   = document.getElementById('ovGrid');
  var timerEl  = document.getElementById('timer');
  var tEl      = document.getElementById('tEl');
  var tTg      = document.getElementById('tTg');
  var body     = document.body;

  var i = 0;
  var budgets = slides.map(function (s) { return parseInt(s.dataset.budget || 20, 10); });
  var total   = budgets.reduce(function (a, b) { return a + b; }, 0);

  function mmss(s) {
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  /* ---------- navigation ---------- */
  function show(n, fromHash) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === i && slides[i].classList.contains('is-active')) return;
    slides[i].classList.remove('is-active');
    var from = i;
    i = n;
    slides[i].classList.add('is-active');

    progress.style.width = ((i + 1) / slides.length * 100) + '%';
    chapEl.textContent = slides[i].dataset.chapter || '';
    numEl.innerHTML = '<b>' + (i + 1) + '</b> / ' + slides.length;
    [].forEach.call(ovGrid.children, function (b, k) { b.classList.toggle('cur', k === i); });

    if (!fromHash) history.replaceState(null, '', '#/' + (i + 1));
    fit(slides[i]);
    slideshow.sync(n >= from ? 1 : -1);
    preload(i + 1);
  }

  /* Never let a slide clip on an unknown projector: if the content block is
     taller than the slide's box, scale it down instead of cropping it. */
  function fit(s) {
    var c = s && s.querySelector('.content');
    if (!c) return;
    c.style.transform = '';
    var cs = getComputedStyle(s);
    var avail = s.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var h = c.offsetHeight;
    if (h > avail && avail > 0) {
      c.style.transformOrigin = 'center center';
      c.style.transform = 'scale(' + Math.max(0.6, avail / h) + ')';
    }
  }

  function preload(n) {
    var s = slides[n];
    if (!s) return;
    [].forEach.call(s.querySelectorAll('img[loading="lazy"]'), function (img) { img.loading = 'eager'; });
  }

  function next() { if (i === synIdx && slideshow.next()) return; show(i + 1); }
  function prev() { if (i === synIdx && slideshow.prev()) return; show(i - 1); }

  /* ---------- synopsis slideshow ---------- */
  var syn    = document.getElementById('synopsis');
  var synIdx = slides.indexOf(syn);
  var slideshow = { sync: function () {}, next: function () { return false; }, prev: function () { return false; } };

  if (syn) {
    var figs    = [].slice.call(syn.querySelectorAll('.show figure'));
    var beatBox = syn.querySelector('.beats');
    var capBox  = syn.querySelector('.caption');
    var beatP   = syn.querySelector('.caption .beat');
    var learnP  = syn.querySelector('.caption .learn');
    var lines   = JSON.parse(document.getElementById('synopsis-beats').textContent);
    var dur     = parseInt(syn.dataset.beat || 8000, 10);
    var b = 0, auto = true, tid = null;

    lines.forEach(function () { beatBox.appendChild(document.createElement('i')); });
    syn.style.setProperty('--beat', dur + 'ms');

    function paint() {
      figs.forEach(function (f, k) { f.classList.toggle('on', k === b); });
      capBox.classList.add('swap');
      setTimeout(function () {
        beatP.textContent  = lines[b][0];
        learnP.textContent = lines[b][1];
        capBox.classList.remove('swap');
      }, 260);
      [].forEach.call(beatBox.children, function (el, k) {
        el.className = k < b ? 'done' : (k === b ? 'cur' + (auto ? '' : ' paused') : '');
        if (k === b) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }
      });
      var nxt = figs[b + 1] && figs[b + 1].querySelector('img');
      if (nxt) nxt.loading = 'eager';
    }

    function schedule() {
      clearTimeout(tid);
      if (!auto || b >= lines.length - 1) return;
      tid = setTimeout(function () { b++; paint(); schedule(); }, dur);
    }

    slideshow = {
      /* Entering from the left restarts the story at beat one and resumes
         autoplay; stepping back in from the right lands on the last beat. */
      sync: function (dir) {
        clearTimeout(tid);
        if (slides[i] !== syn) return;
        if (dir === 1) { b = 0; auto = true; }
        else if (dir === -1) { b = lines.length - 1; auto = false; }
        paint();
        schedule();
      },
      next: function () {
        if (b >= lines.length - 1) return false;
        auto = false; b++; paint(); clearTimeout(tid);
        return true;
      },
      prev: function () {
        if (b <= 0) return false;
        auto = false; b--; paint(); clearTimeout(tid);
        return true;
      },
      play: function () { if (slides[i] === syn) { auto = true; paint(); schedule(); } }
    };
  }

  /* ---------- overview ---------- */
  slides.forEach(function (s, k) {
    var h = s.querySelector('h1, h2');
    // slides are visibility:hidden, so innerText won't honour <br> — strip it by hand
    var tmp = document.createElement('div');
    tmp.innerHTML = (h ? h.innerHTML : '').replace(/<br\s*\/?>/gi, ' ');
    var label = s.dataset.label || tmp.textContent;
    var b = document.createElement('button');
    b.appendChild(Object.assign(document.createElement('span'), {
      className: 'i',
      textContent: ('0' + (k + 1)).slice(-2) + ' · ' + (s.dataset.chapter || '') + ' · ' + mmss(budgets[k])
    }));
    b.appendChild(document.createTextNode(label.replace(/\s+/g, ' ').trim().slice(0, 74)));
    b.addEventListener('click', function () { body.classList.remove('overview-on'); show(k); });
    ovGrid.appendChild(b);
  });
  document.querySelector('.overview h4').textContent =
    'Opi and the Quiet Ones — ' + slides.length + ' slides · ' + mmss(total) + ' target';

  /* ---------- rehearsal timer ---------- */
  var t0 = null, tick = null;
  function renderTimer() {
    var el = (Date.now() - t0) / 1000;
    var target = 0;
    for (var k = 0; k <= i; k++) target += budgets[k];
    tEl.textContent = mmss(el);
    tTg.textContent = '/ ' + mmss(total) + '   ·   slide ' + (i + 1) + ' should end at ' + mmss(target);
    timerEl.classList.toggle('over', el > target + 8);
  }
  function toggleTimer() {
    if (timerEl.classList.contains('on')) {
      timerEl.classList.remove('on'); clearInterval(tick); tick = null;
    } else {
      timerEl.classList.add('on'); t0 = Date.now(); renderTimer();
      tick = setInterval(renderTimer, 250);
    }
  }

  /* ---------- input ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); show(0); }
    else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
    else if (k === 'n' || k === 'N') { body.classList.toggle('notes-on'); }
    else if (k === 'o' || k === 'O') { body.classList.toggle('overview-on'); }
    else if (k === 't' || k === 'T') { toggleTimer(); }
    else if (k === 'p' || k === 'P') { if (slideshow.play) slideshow.play(); }
    else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(function () {});
    }
    else if (k === 'Escape') { body.classList.remove('overview-on'); body.classList.remove('notes-on'); }
    else return;
    body.classList.add('touched');
  });

  document.getElementById('zNext').addEventListener('click', function () { next(); body.classList.add('touched'); });
  document.getElementById('zPrev').addEventListener('click', function () { prev(); body.classList.add('touched'); });
  overview.addEventListener('click', function (e) { if (e.target === overview) body.classList.remove('overview-on'); });

  var tx = 0, ty = 0;
  document.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); body.classList.add('touched'); }
  }, { passive: true });

  window.addEventListener('hashchange', function () {
    var n = parseInt((location.hash.match(/#\/(\d+)/) || [])[1], 10);
    if (n) show(n - 1, true);
  });

  /* ---------- boot ---------- */
  setTimeout(function () { body.classList.add('touched'); }, 6000);

  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { fit(slides[i]); }, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(slides[i]); });

  var start = parseInt((location.hash.match(/#\/(\d+)/) || [])[1], 10) || 1;
  show(start - 1, true);
})();
