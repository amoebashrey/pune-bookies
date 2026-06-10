/* ============================================================
   Pune Bookies — motion layer
   ============================================================
   #1 ARRIVAL SEQUENCE (this file currently builds only this).

   Every timing lives in ARRIVAL below, in milliseconds.
   Tune the feel by changing one number — nothing else references
   these values directly.
   ============================================================ */

// ---- Arrival timings (ms) ----------------------------------
const ARRIVAL = {
  CANOPY_START:    200,   // first watercolour wash begins
  CANOPY_STAGGER:  150,   // gap between each of the 4 canopy layers
  CANOPY_DUR:      1100,  // how long each wash takes to bleed in

  STRUCTURE_START: 1000,  // trunk, branches, specks, sloth, ground
  STRUCTURE_DUR:   900,

  PUNE_START:      2200,  // "Pune" inks on
  PUNE_DUR:        600,
  BOOKIES_START:   2800,  // "Bookies" a beat later
  BOOKIES_DUR:     400,

  TAGLINE_START:   3200,
  TAGLINE_DUR:     800,

  META_START:      3600,  // stats line + scroll cue settle in last
  META_DUR:        700,
};

const ARRIVAL_EASE = 'cubic-bezier(0.2, 0.6, 0.2, 1)';
const INK_BLUR     = 4;   // px — wet-ink start blur on the wordmark

// ---- Petal drift (#2) --------------------------------------
const PETALS = {
  MIN: 5,  MAX: 8,                          // how many onscreen at once
  FALL_MIN: 8000,  FALL_MAX: 15000,         // ms for one petal to cross the viewport
  SIZE_MIN: 9,     SIZE_MAX: 18,            // px
  SWAY_AMP_MIN: 18, SWAY_AMP_MAX: 55,       // px — horizontal sine sway
  SWAY_FREQ_MIN: 0.18, SWAY_FREQ_MAX: 0.42, // sway cycles per second
  SPIN_MIN: 12, SPIN_MAX: 40,               // deg per second (sign randomised)
  OPACITY_MIN: 0.35, OPACITY_MAX: 0.7,
  COLORS: ['#c8553d', '#d97863', '#e8a89a'],// gulmohar red → soft → faint
  Z_INDEX: 1,                               // behind content (main is z-index:2)
};

// ---- Next-Sunday countdown (#3) ----------------------------
const COUNTDOWN = {
  IST_OFFSET_MIN: 5 * 60 + 30,  // IST is UTC+5:30
  GATHER_HOUR: 8,               // Sunday gathering starts 08:00 IST
  ROLL_HOUR: 10,                // "Today" holds until 10:00 IST, then rolls forward
  TICK_MS: 1000,                // recompute every second
};

// ---- Smooth scroll (#4, Lenis) -----------------------------
const LENIS = {
  DURATION: 1.2,                          // seconds — page-turn weight, not iPhone flick
  EASING: (t) => 1 - Math.pow(1 - t, 3),  // easeOutCubic — slower, weighted settle
};

// ------------------------------------------------------------

(function () {
  const root = document.documentElement;

  // The inline <head> gate decides 'running' vs 'done'. We only drive
  // the bloom when it asked us to; everything else is already settled.
  if (root.getAttribute('data-arrival') !== 'running') return;

  if (window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }

  // Mark the session so repeat loads skip the bloom.
  try { sessionStorage.setItem('pb_arrival_seen', '1'); } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // --- hand back to the resting state -----------------------
  function finish() {
    root.setAttribute('data-arrival', 'done');
    // Ensure the hero's own scroll-reveal is settled so nothing snaps.
    const inner = document.querySelector('.hero .hero-inner');
    if (inner) inner.classList.add('reveal', 'visible');
  }

  function endTime(a) {
    const t = a.effect.getComputedTiming();
    return (t.delay || 0) + (t.activeDuration || 0);
  }

  // --- the sequence -----------------------------------------
  function run() {
    const svg      = document.querySelector('.hero-illustration svg');
    const canopies = svg ? [...svg.querySelectorAll('ellipse')]
                              .filter(e => /canopy/.test(e.getAttribute('fill') || '')) : [];
    const ground   = svg ? svg.querySelector('ellipse[fill="url(#ground)"]') : null;
    const groups   = svg ? [...svg.querySelectorAll('g')] : [];
    const pune     = document.querySelector('.hero-wordmark .pune');
    const bookies  = document.querySelector('.hero-wordmark .bookies');
    const tagline  = document.querySelector('.hero-tagline');
    const meta     = document.querySelector('.hero-meta');
    const cue      = document.querySelector('.scroll-cue');

    const anims = [];

    // fade an element up to a target opacity, holding it there afterwards
    const fadeTo = (el, to, start, dur) => {
      if (!el) return;
      anims.push(el.animate(
        [{ opacity: 0 }, { opacity: to }],
        { delay: start, duration: dur, easing: ARRIVAL_EASE, fill: 'forwards' }
      ));
    };

    // 1) Canopy washes bleed in, layer by layer (riding the SVG
    //    #watercolour displacement filter for painterly edges).
    canopies.forEach((el, i) => {
      const to = parseFloat(el.getAttribute('opacity')) || 1;
      fadeTo(el, to, ARRIVAL.CANOPY_START + i * ARRIVAL.CANOPY_STAGGER, ARRIVAL.CANOPY_DUR);
    });

    // 2) Ground shadow + structure (trunk, branches, specks, sloth)
    const groundTo = ground ? (parseFloat(ground.getAttribute('opacity')) || 1) : 1;
    fadeTo(ground, groundTo, ARRIVAL.STRUCTURE_START, ARRIVAL.STRUCTURE_DUR);
    groups.forEach(g => fadeTo(g, 1, ARRIVAL.STRUCTURE_START, ARRIVAL.STRUCTURE_DUR));

    // 3 + 4) Wordmark inks on — wet bleed, sharpening left→right.
    const inkOn = (el, start, dur) => {
      if (!el) return;
      anims.push(el.animate(
        [
          { opacity: 0,   filter: `blur(${INK_BLUR}px)`,       clipPath: 'inset(0 100% 0 0)' },
          { opacity: 0.6, filter: `blur(${INK_BLUR * 0.4}px)`, clipPath: 'inset(0 30% 0 0)', offset: 0.6 },
          { opacity: 1,   filter: 'blur(0px)',                 clipPath: 'inset(0 0 0 0)' }
        ],
        { delay: start, duration: dur, easing: ARRIVAL_EASE, fill: 'forwards' }
      ));
    };
    inkOn(pune,    ARRIVAL.PUNE_START,    ARRIVAL.PUNE_DUR);
    inkOn(bookies, ARRIVAL.BOOKIES_START, ARRIVAL.BOOKIES_DUR);

    // 5) Tagline fades up last-but-one.
    if (tagline) anims.push(tagline.animate(
      [{ opacity: 0, transform: 'translateY(8px)' },
       { opacity: 1, transform: 'translateY(0)' }],
      { delay: ARRIVAL.TAGLINE_START, duration: ARRIVAL.TAGLINE_DUR, easing: ARRIVAL_EASE, fill: 'forwards' }
    ));

    // 6) Stats line settles; scroll cue's existing float holds until now.
    fadeTo(meta, 1, ARRIVAL.META_START, ARRIVAL.META_DUR);
    if (cue) cue.style.animationDelay = ARRIVAL.META_START + 'ms';

    // When the last thing settles, hand off to the resting state.
    const last = anims.slice().sort((a, b) => endTime(b) - endTime(a))[0];
    if (last) last.addEventListener('finish', finish);
    else finish();
  }
})();


/* ============================================================
   #2 PETAL DRIFT — continuous gulmohar petals behind content.
   Spawns above the viewport, sways on a sine, despawns below.
   Pauses when the tab is hidden. Nothing under reduced-motion.
   ============================================================ */
(function () {
  const root = document.documentElement;

  if (window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const petalSVG = (color) =>
    '<svg viewBox="0 0 20 28" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M10 0 C16 8 18 19 10 28 C2 19 4 8 10 0 Z" fill="' + color + '"/>' +
    '</svg>';

  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText =
    'position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:' + PETALS.Z_INDEX + ';';

  let vw = window.innerWidth, vh = window.innerHeight;

  // Configure (or reconfigure, on respawn) a single petal.
  function reset(p, initial) {
    p.size  = rand(PETALS.SIZE_MIN, PETALS.SIZE_MAX);
    p.color = pick(PETALS.COLORS);
    p.x0    = rand(-0.05, 1.05) * vw;                         // base column
    p.fall  = rand(PETALS.FALL_MIN, PETALS.FALL_MAX) / 1000;  // seconds to cross
    p.speed = (vh + p.size * 2) / p.fall;                     // px/sec downward
    p.amp   = rand(PETALS.SWAY_AMP_MIN, PETALS.SWAY_AMP_MAX);
    p.freq  = rand(PETALS.SWAY_FREQ_MIN, PETALS.SWAY_FREQ_MAX);
    p.phase = rand(0, Math.PI * 2);
    p.spin  = rand(PETALS.SPIN_MIN, PETALS.SPIN_MAX) * (Math.random() < 0.5 ? -1 : 1);
    p.rot   = rand(0, 360);
    p.age   = 0;
    // First batch is spread through the viewport; respawns enter from just above.
    p.y     = initial ? rand(-p.size, vh) : -p.size * 2;
    p.el.style.width = p.el.style.height = p.size + 'px';
    p.el.style.opacity = rand(PETALS.OPACITY_MIN, PETALS.OPACITY_MAX);
    p.el.innerHTML = petalSVG(p.color);
  }

  const petals = [];
  const count = PETALS.MIN + Math.round(Math.random() * (PETALS.MAX - PETALS.MIN));
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;top:0;left:0;will-change:transform;';
    const p = { el };
    reset(p, true);
    petals.push(p);
    layer.appendChild(el);
  }

  let last = 0, running = false, rafId = 0;

  function frame(now) {
    if (!running) return;
    if (!last) last = now;
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.1) dt = 0.1;  // clamp jank / tab-switch catch-up
    for (const p of petals) {
      p.age += dt;
      p.y   += p.speed * dt;
      p.rot += p.spin * dt;
      if (p.y > vh + p.size * 2) reset(p, false);
      const sway = p.amp * Math.sin(p.age * p.freq * Math.PI * 2 + p.phase);
      p.el.style.transform =
        'translate3d(' + (p.x0 + sway).toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,0) rotate(' + p.rot.toFixed(1) + 'deg)';
    }
    rafId = requestAnimationFrame(frame);
  }

  function start() { if (running) return; running = true; last = 0; rafId = requestAnimationFrame(frame); }
  function stop()  { running = false; cancelAnimationFrame(rafId); }

  // Pause when the tab is hidden (Page Visibility API).
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
  window.addEventListener('resize', () => {
    vw = window.innerWidth; vh = window.innerHeight;
  }, { passive: true });

  // Hold petals until the arrival bloom has settled on first load.
  function mount() { document.body.appendChild(layer); if (!document.hidden) start(); }
  function whenSettled(cb) {
    if (root.getAttribute('data-arrival') !== 'running') { cb(); return; }
    const id = setInterval(() => {
      if (root.getAttribute('data-arrival') !== 'running') { clearInterval(id); cb(); }
    }, 150);
  }
  const boot = () => whenSettled(mount);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();


/* ============================================================
   #3 NEXT-SUNDAY COUNTDOWN — a quiet line under the hero.
   Next Sunday 08:00 IST. On Sunday before 10:00 IST shows
   "today"; after that it rolls to the following Sunday.
   ============================================================ */
(function () {
  const OFFSET_MS = COUNTDOWN.IST_OFFSET_MIN * 60 * 1000;

  function build() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const el = document.createElement('div');
    el.id = 'next-sunday';
    el.setAttribute('aria-live', 'off');
    el.style.cssText =
      'text-align:center;font-family:"Fraunces",serif;' +
      'font-variation-settings:"SOFT" 100,"opsz" 14;' +
      'font-size:0.95rem;letter-spacing:0.01em;color:var(--ink);' +
      'position:relative;z-index:2;margin:-2.5rem auto 0;padding:0 1.5rem 1rem;';
    hero.insertAdjacentElement('afterend', el);

    const plural = (n, word) => n + ' ' + word + (n === 1 ? '' : 's');

    function tick() {
      // Shift into IST so getUTC* fields read as IST wall-clock.
      const ist = new Date(Date.now() + OFFSET_MS);
      const day = ist.getUTCDay();          // 0 = Sunday
      const hour = ist.getUTCHours();

      let daysUntil = (7 - day) % 7;
      if (daysUntil === 0) {
        if (hour < COUNTDOWN.ROLL_HOUR) { el.textContent = 'Next Sunday — today'; return; }
        daysUntil = 7;                       // Sunday past 10:00 → next week
      }

      const target = new Date(ist);
      target.setUTCDate(target.getUTCDate() + daysUntil);
      target.setUTCHours(COUNTDOWN.GATHER_HOUR, 0, 0, 0);

      let diff = Math.max(0, target.getTime() - ist.getTime());
      const days = Math.floor(diff / 86400000); diff -= days * 86400000;
      const hrs  = Math.floor(diff / 3600000);  diff -= hrs * 3600000;
      const mins = Math.floor(diff / 60000);

      el.textContent = 'Next Sunday — ' +
        plural(days, 'day') + ', ' + plural(hrs, 'hour') + ', ' + plural(mins, 'minute');
    }

    tick();
    setInterval(tick, COUNTDOWN.TICK_MS);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();


/* ============================================================
   #4 SMOOTH SCROLL (Lenis) — page-turn weight.
   Skipped entirely under reduced-motion (native scroll).
   ============================================================ */
(function () {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    duration: LENIS.DURATION,
    easing: LENIS.EASING,
    smoothWheel: true,
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Keep in-page anchor links smooth (CSS smooth-scroll is now off under Lenis).
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0 });
  });
})();
