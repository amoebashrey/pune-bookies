/* ============================================================
   Pune Bookies — motion layer
   ============================================================
   The first-visit ARRIVAL SEQUENCE (hero bloom) has been removed;
   the hero now renders in its settled state immediately. The
   remaining layers below are unaffected.
   ============================================================ */

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

// ---- Next-Sunday countdown / library date stamp (#3) -------
// Layout/visual CSS lives in styles.css (#next-sunday); the SVG
// wash geometry stays here because this module builds the SVG.
const COUNTDOWN = {
  IST_OFFSET_MIN: 5 * 60 + 30,  // IST is UTC+5:30
  GATHER_HOUR: 8,               // Sunday gathering starts 08:00 IST
  ROLL_HOUR: 10,                // "happening now" holds until 10:00 IST, then rolls forward
  TICK_MS: 1000,                // recompute every second
  STAMP_W: 220,                 // px — watercolour wash width
  STAMP_H: 120,                 // px — watercolour wash height
  WASH_BASE_FREQ: 0.02,         // feTurbulence baseFrequency for organic edges
  WASH_DISPLACE: 8,             // feDisplacementMap scale
  WASH_COLOR: '#c8553d',        // gulmohar
  WHERE_LINE: 'the spot drops Saturday, 4:05 PM — WhatsApp & Instagram',
};

// ---- Smooth scroll (#4, Lenis) -----------------------------
const LENIS = {
  DURATION: 1.2,                          // seconds — page-turn weight, not iPhone flick
  EASING: (t) => 1 - Math.pow(1 - t, 3),  // easeOutCubic — slower, weighted settle
};

// ---- Site-wide atmosphere ----------------------------------
const ATMOSPHERE = {
  GRAIN_OPACITY:     0.03,   // 3% paper grain, sits below content
  GRAIN_BASE_FREQ:   0.85,   // feTurbulence baseFrequency
  SELECTION:         'rgba(200, 85, 61, 0.22)',  // faded gulmohar text selection
  SCROLLBAR_W:       6,      // px
  SCROLLBAR_RGB:     '31, 22, 17',  // --ink
  SCROLLBAR_ACTIVE:  0.4,    // thumb alpha when active
  SCROLLBAR_IDLE:    0.1,    // thumb alpha after idle
  SCROLLBAR_IDLE_MS: 1000,   // idle delay before fading
  SCROLLBAR_FADE_MS: 400,    // fade transition
  BLEED_SIZE:        24,     // px — click-bleed diameter
  BLEED_DURATION:    600,    // ms
  BLEED_SCALE_FROM:  0.3,
  BLEED_SCALE_TO:    1.6,
  BLEED_OPACITY:     0.4,    // peak opacity
};

/* ============================================================
   #2 PETAL DRIFT — continuous gulmohar petals behind content.
   Spawns above the viewport, sways on a sine, despawns below.
   Pauses when the tab is hidden. Nothing under reduced-motion.
   ============================================================ */
(function () {
  const root = document.documentElement;

  if (window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Pages can opt out of the ambient drift (e.g. /brands keeps its
  // petals for one signature moment only): <body data-petals="off">
  if (document.body && document.body.dataset.petals === 'off') return;

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

  // Mount once the document marks itself settled (data-arrival="done").
  // With the arrival bloom removed this resolves immediately.
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
   #3 NEXT GATHERING — a "library date stamp" under the hero.
   Three lines (eyebrow · date · countdown) on a soft gulmohar
   watercolour wash, very slightly askew. Next Sunday 08:00 IST;
   on Sunday before 10:00 IST it reads "happening now".
   IST math is unchanged from the original.
   ============================================================ */
(function () {
  const C = COUNTDOWN;
  const OFFSET_MS = C.IST_OFFSET_MIN * 60 * 1000;

  // Date line uses en-GB ("Sunday, 15 June"). timeZone:UTC because our
  // `target` carries the IST wall-clock in its UTC fields (see below).
  const dateFmt = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
  });

  function build() {
    // The container is static HTML (space pre-reserved → no layout
    // shift); this module only fills it. Homepage only.
    const el = document.getElementById('next-sunday');
    if (!el) return;

    el.innerHTML =
      `<svg class="ds-wash" viewBox="0 0 ${C.STAMP_W} ${C.STAMP_H}" aria-hidden="true">
         <defs>
           <filter id="ds-wash-edge" x="-25%" y="-35%" width="150%" height="170%">
             <feTurbulence type="fractalNoise" baseFrequency="${C.WASH_BASE_FREQ}" numOctaves="2" seed="4" result="n"/>
             <feDisplacementMap in="SourceGraphic" in2="n" scale="${C.WASH_DISPLACE}"/>
           </filter>
         </defs>
         <ellipse cx="${C.STAMP_W / 2}" cy="${C.STAMP_H / 2}" rx="${C.STAMP_W / 2 - 14}" ry="${C.STAMP_H / 2 - 14}"
                  fill="${C.WASH_COLOR}" filter="url(#ds-wash-edge)"/>
       </svg>
       <div class="ds-inner">
         <div class="ds-eyebrow">next gathering</div>
         <div class="ds-date">
           <svg class="ds-petal" viewBox="0 0 20 28" aria-hidden="true"><path d="M10 0 C16 8 18 19 10 28 C2 19 4 8 10 0 Z" fill="${C.WASH_COLOR}"/></svg>
           <span class="ds-date-text"></span>
         </div>
         <div class="ds-count"></div>
         <div class="ds-where">${C.WHERE_LINE}</div>
         <a class="ds-cal" href="/sunday.ics" data-track="calendar_add">add to calendar</a>
       </div>`;

    const dateText  = el.querySelector('.ds-date-text');
    const countText = el.querySelector('.ds-count');
    const plural = (n, word) => n + ' ' + word + (n === 1 ? '' : 's');

    function tick() {
      // Shift into IST so getUTC* fields read as IST wall-clock.
      const ist = new Date(Date.now() + OFFSET_MS);
      const day = ist.getUTCDay();          // 0 = Sunday
      const hour = ist.getUTCHours();

      let daysUntil = (7 - day) % 7;
      let happeningNow = false;
      if (daysUntil === 0) {
        if (hour >= C.GATHER_HOUR && hour < C.ROLL_HOUR) {
          happeningNow = true;                        // Sunday, 08:00–10:00 only
        } else if (hour >= C.ROLL_HOUR) {
          daysUntil = 7;                              // Sunday past 10:00 → next week
        }
        // Sunday before 08:00 → fall through: count down to this morning
      }

      const target = new Date(ist);
      target.setUTCDate(target.getUTCDate() + daysUntil);
      target.setUTCHours(C.GATHER_HOUR, 0, 0, 0);

      // Build "Sunday, 15 June" from parts — guarantees the comma cross-browser.
      const p = dateFmt.formatToParts(target);
      const part = (t) => (p.find((x) => x.type === t) || {}).value || '';
      dateText.textContent = `${part('weekday')}, ${part('day')} ${part('month')}`;

      if (happeningNow) {
        countText.textContent = 'happening now, under a tree.';
        return;
      }

      let diff = Math.max(0, target.getTime() - ist.getTime());
      const days = Math.floor(diff / 86400000); diff -= days * 86400000;
      const hrs  = Math.floor(diff / 3600000);  diff -= hrs * 3600000;
      const mins = Math.floor(diff / 60000);
      countText.textContent =
        plural(days, 'day') + ', ' + plural(hrs, 'hour') + ', ' + plural(mins, 'minute');
    }

    tick();
    setInterval(tick, C.TICK_MS);
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
    // keyboard/SR users should land where the page scrolled
    if (typeof target.focus === 'function') target.focus({ preventScroll: true });
  });
})();


/* ============================================================
   SITE-WIDE ATMOSPHERE — loads on every page that includes this file.
     3a paper grain  ·  3b faded selection  ·  3c ink-thin scrollbar
     ·  3d click-bleed watercolour.
   Only the click-bleed is gated on reduced-motion; the rest are static.
   ============================================================ */
(function () {
  const A = ATMOSPHERE;
  const reduce = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 3a + 3b + 3c: inject the static CSS (grain, selection, scrollbar) ---
  const grainSVG =
    "data:image/svg+xml;utf8," +
    "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='" + A.GRAIN_BASE_FREQ +
        "' numOctaves='2' stitchTiles='stitch'/>" +
        "<feColorMatrix type='saturate' values='0'/></filter>" +
      "<rect width='100%' height='100%' filter='url(%23n)'/>" +
    "</svg>";

  const css = `
    /* 3a — paper grain: fixed, below content (main is z-index:2) */
    html::before {
      content: ''; position: fixed; inset: 0; pointer-events: none;
      z-index: 1; opacity: ${A.GRAIN_OPACITY}; mix-blend-mode: multiply;
      background-image: url("${grainSVG}");
    }
    /* 3b — faded gulmohar selection */
    ::selection { background: ${A.SELECTION}; color: inherit; }
    /* 3c — ink-thin scrollbar */
    html { scrollbar-width: thin; scrollbar-color: rgba(${A.SCROLLBAR_RGB}, ${A.SCROLLBAR_ACTIVE}) transparent; transition: scrollbar-color ${A.SCROLLBAR_FADE_MS}ms; }
    html.pb-sb-idle { scrollbar-color: rgba(${A.SCROLLBAR_RGB}, ${A.SCROLLBAR_IDLE}) transparent; }
    ::-webkit-scrollbar { width: ${A.SCROLLBAR_W}px; height: ${A.SCROLLBAR_W}px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: rgba(${A.SCROLLBAR_RGB}, ${A.SCROLLBAR_ACTIVE});
      border-radius: ${A.SCROLLBAR_W / 2}px;
      transition: background ${A.SCROLLBAR_FADE_MS}ms;
    }
    html.pb-sb-idle::-webkit-scrollbar-thumb { background: rgba(${A.SCROLLBAR_RGB}, ${A.SCROLLBAR_IDLE}); }
  `;
  const style = document.createElement('style');
  style.id = 'pb-atmosphere';
  style.textContent = css;
  document.head.appendChild(style);

  // --- 3c behaviour: fade the scrollbar to idle after inactivity ---
  if (!reduce) {
    const root = document.documentElement;
    let idleTimer = 0;
    const wake = () => {
      root.classList.remove('pb-sb-idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => root.classList.add('pb-sb-idle'), A.SCROLLBAR_IDLE_MS);
    };
    ['scroll', 'wheel', 'touchmove', 'pointermove'].forEach(
      ev => window.addEventListener(ev, wake, { passive: true })
    );
    idleTimer = setTimeout(() => root.classList.add('pb-sb-idle'), A.SCROLLBAR_IDLE_MS);
  }

  // --- 3d: click-bleed watercolour bloom (skipped under reduced-motion) ---
  if (!reduce) {
    document.addEventListener('click', (e) => {
      // bleed belongs to the paper, not to the controls
      if (e.target.closest && e.target.closest('a, button, input, textarea, select, label, summary')) return;
      const drop = document.createElement('span');
      drop.setAttribute('aria-hidden', 'true');
      drop.style.cssText =
        'position:fixed;pointer-events:none;z-index:99;border-radius:50%;' +
        'width:' + A.BLEED_SIZE + 'px;height:' + A.BLEED_SIZE + 'px;' +
        'left:' + (e.clientX - A.BLEED_SIZE / 2) + 'px;' +
        'top:'  + (e.clientY - A.BLEED_SIZE / 2) + 'px;' +
        'background:radial-gradient(circle, rgba(200,85,61,' + A.BLEED_OPACITY +
          ') 0%, rgba(200,85,61,0) 70%);';
      document.body.appendChild(drop);
      const anim = drop.animate(
        [
          { transform: 'scale(' + A.BLEED_SCALE_FROM + ')', opacity: A.BLEED_OPACITY },
          { transform: 'scale(' + A.BLEED_SCALE_TO + ')',   opacity: 0 }
        ],
        { duration: A.BLEED_DURATION, easing: 'cubic-bezier(0.2, 0.6, 0.2, 1)' }
      );
      anim.addEventListener('finish', () => drop.remove());
    }, { passive: true });
  }
})();


/* ============================================================
   CONTACT — assemble mailto: links at runtime so plaintext
   addresses never sit in the HTML for scrapers. The visible
   text is entity-encoded in the markup (renders normally);
   this swaps the dead href for the real one.
   ============================================================ */
(function () {
  function arm() {
    document.querySelectorAll('a.obf-mail[data-u][data-d]').forEach((a) => {
      a.setAttribute('href', 'mailto:' + a.dataset.u + '@' + a.dataset.d);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm);
  else arm();
})();


/* ============================================================
   NAVBAR — condensed state on scroll + mobile "menu" toggle.
   Works on every page that includes this file.
   ============================================================ */
(function () {
  const NAV_SCROLL_THRESHOLD = 80;   // px scrolled before the bar condenses

  const header = document.querySelector('header.top');
  if (!header) return;

  // condense the bar once the page has scrolled past the threshold
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > NAV_SCROLL_THRESHOLD);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile: "menu" text trigger slides the link stack open/closed
  const toggle = header.querySelector('.nav-toggle');
  const links  = header.querySelector('.nav-links');
  if (toggle && links) {
    const close = () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }
})();
