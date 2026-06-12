/* ============================================================
   Pune Bookies — /brands page behaviours
   Count-up numerals, heading underline draws, the single petal
   signature moment, the floating quiet CTA, and the inquiry form.
   Everything else on this page deliberately does NOT move.
   ============================================================ */

// ---- Evidence layer: named-constant placeholders -------------
// FILL THESE with real Instagram-insights values, then remove the
// visible .stats-note in brands.html. Strings render as-is;
// numbers get the count-up.
const BRANDS_STATS = {
  READERS_PER_SUNDAY: 250,          // real
  IG_FOLLOWERS: 43900,              // real
  SUNDAYS_HELD: 120,                // [PLACEHOLDER] count from the first Sunday of 2024
  ENGAGEMENT_RATE: 4.8,             // [PLACEHOLDER] %
  AVG_REEL_VIEWS: 38000,            // [PLACEHOLDER]
  WHATSAPP_MEMBERS: 2100,           // [PLACEHOLDER]
  AUDIENCE_AGE_RANGE: '18–34',      // [PLACEHOLDER] string, rendered as-is
  AUDIENCE_GENDER_SPLIT: '65 / 35', // [PLACEHOLDER] women / men
  CITY_SPLIT: '78 / 22',            // [PLACEHOLDER] Pune / beyond
};

// ---- Count-up ------------------------------------------------
const COUNTUP = {
  DURATION_MS: 1200,
  EASING: (t) => 1 - Math.pow(1 - t, 3),   // easeOutCubic
  THRESHOLD: 0.6,                          // how much of the stat must be visible
};

// ---- Signature petal moment ---------------------------------
const PETAL_MOMENT = {
  COUNT: 3,
  PARALLAX: [0.12, 0.2, 0.16],   // px of drift per px of scroll, per petal
  SIZE: [16, 11, 13],            // px
  X: [0.18, 0.55, 0.82],         // fraction of section width
  Y: [0.25, 0.6, 0.4],           // fraction of section height (resting point)
  ROT: [-24, 14, -8],            // deg
  OPACITY: [0.5, 0.4, 0.45],
  COLORS: ['#c8553d', '#d97863', '#e8a89a'],
};

// ---- Floating quiet CTA -------------------------------------
const QUIET_CTA = {
  SHOW_AT: 0.6,                  // fraction of page scrolled
  DISMISS_KEY: 'pb_cta_dismissed',
};

const REDUCE = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- count-up numerals --------------------------------------- */
(function () {
  const stats = document.querySelectorAll('.stat-num[data-stat]');
  if (!stats.length) return;

  const fmt = new Intl.NumberFormat('en-IN');

  function render(el, key, value) {
    // keep any .unit suffix (e.g. % or +) the markup carries
    const unit = el.querySelector('.unit');
    const text = typeof value === 'number'
      ? (Number.isInteger(value) ? fmt.format(value) : value.toFixed(1))
      : String(value);
    if (unit) {
      el.textContent = text;
      el.appendChild(unit);
    } else {
      el.textContent = text;
    }
  }

  stats.forEach((el) => {
    const key = el.dataset.stat;
    const value = BRANDS_STATS[key];
    if (value === undefined) return;          // markup fallback stays
    if (typeof value !== 'number' || REDUCE) {
      render(el, key, value);                 // instant under reduced-motion
      return;
    }
    // hold at 0 until visible, then count up
    render(el, key, 0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(el);
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min(1, (now - t0) / COUNTUP.DURATION_MS);
          render(el, key, value < 10 ? +(value * COUNTUP.EASING(p)).toFixed(1)
                                     : Math.round(value * COUNTUP.EASING(p)));
          if (p < 1) requestAnimationFrame(tick);
          else render(el, key, value);
        })(t0);
      });
    }, { threshold: COUNTUP.THRESHOLD });
    io.observe(el);
  });

  // string stats (ranges, splits) render as-is
  document.querySelectorAll('.val[data-stat]').forEach((el) => {
    const v = BRANDS_STATS[el.dataset.stat];
    if (v !== undefined) el.textContent = String(v);
  });
})();

/* ---- heading underline draws --------------------------------- */
(function () {
  const rules = document.querySelectorAll('.h-rule');
  if (!rules.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.9 });
  rules.forEach((r) => io.observe(r));
})();

/* ---- the signature moment: petals over the numbers ----------- */
(function () {
  if (REDUCE) return;
  const layer = document.querySelector('.brands-numbers .petal-moment');
  const section = document.querySelector('.brands-numbers');
  if (!layer || !section) return;

  const P = PETAL_MOMENT;
  const petalSVG = (color) =>
    '<svg viewBox="0 0 20 28" width="100%" height="100%"><path d="M10 0 C16 8 18 19 10 28 C2 19 4 8 10 0 Z" fill="' + color + '"/></svg>';

  const petals = [];
  for (let i = 0; i < P.COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'pm-petal';
    el.style.width = P.SIZE[i] + 'px';
    el.style.height = (P.SIZE[i] * 1.4) + 'px';
    el.style.left = (P.X[i] * 100) + '%';
    el.style.top = (P.Y[i] * 100) + '%';
    el.style.opacity = P.OPACITY[i];
    el.innerHTML = petalSVG(P.COLORS[i % P.COLORS.length]);
    layer.appendChild(el);
    petals.push(el);
  }

  let ticking = false;
  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    // progress: -1 (below viewport) … +1 (above); 0 when centred
    const progress = -(rect.top + rect.height / 2 - innerHeight / 2);
    petals.forEach((el, i) => {
      const dy = progress * P.PARALLAX[i];
      el.style.transform = 'translate3d(0,' + dy.toFixed(1) + 'px,0) rotate(' + P.ROT[i] + 'deg)';
    });
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* ---- floating quiet CTA --------------------------------------- */
(function () {
  const bar = document.getElementById('quiet-cta');
  if (!bar) return;

  let dismissed = false;
  try { dismissed = sessionStorage.getItem(QUIET_CTA.DISMISS_KEY) === '1'; } catch (e) {}
  if (dismissed) return;

  bar.hidden = false;
  let shown = false;
  let typingGuard = false;   // never over a mobile keyboard

  document.addEventListener('focusin', (e) => {
    if (e.target.matches('input, textarea')) { typingGuard = true; bar.classList.remove('shown'); }
  });
  document.addEventListener('focusout', () => { typingGuard = false; });

  function onScroll() {
    const doc = document.documentElement;
    const depth = (scrollY + innerHeight) / doc.scrollHeight;
    const want = depth > QUIET_CTA.SHOW_AT && !typingGuard;
    if (want !== shown) {
      shown = want;
      bar.classList.toggle('shown', want);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  bar.querySelector('.qc-close').addEventListener('click', () => {
    bar.classList.remove('shown');
    try { sessionStorage.setItem(QUIET_CTA.DISMISS_KEY, '1'); } catch (e) {}
    setTimeout(() => { bar.hidden = true; }, 400);
  });

  // arriving at the talk section retires the bar for the visit
  const talk = document.getElementById('talk');
  if (talk) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) bar.classList.remove('shown'); });
    }, { threshold: 0.2 }).observe(talk);
  }
})();

/* ---- inquiry form --------------------------------------------- */
(function () {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  const status = form.querySelector('.inquiry-status');
  const submit = form.querySelector('.inquiry-submit');
  const openedAt = Date.now();   // minimum-time spam trap (validated server-side)

  const FALLBACK =
    'That didn’t go through — email us directly: shreyasjadhav531@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // native validity first, quietly
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      name: form.name.value.trim(),
      brand: form.brand.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      website: form.website.value,          // honeypot — must be empty
      elapsedMs: Date.now() - openedAt,     // min-time trap
    };

    submit.disabled = true;
    status.className = 'inquiry-status';
    status.textContent = 'sending…';

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.reset();
      status.className = 'inquiry-status ok';
      status.textContent = 'Sent. We’ll write back soon.';
      if (window.pbTrack) window.pbTrack('inquiry_submitted');
    } catch (err) {
      status.className = 'inquiry-status err';
      status.textContent = FALLBACK;
      submit.disabled = false;
    }
  });
})();
