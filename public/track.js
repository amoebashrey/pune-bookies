/* ============================================================
   Pune Bookies — measurement, the polite kind.
   One module, named event constants, no cookies, no identity.
   Sends to self-hosted/cloud Umami when its script is present;
   otherwise every call is a no-op. Nothing here ever blocks UI.
   ============================================================ */

const EVENTS = {
  BOOKMARK_CLICK: 'bookmark_click',
  BRANDS_VIEW: 'brands_view',
  BRANDS_SCROLL_75: 'brands_scroll_75',
  TALK_TO_US_VIEW: 'talk_to_us_view',
  INQUIRY_SUBMITTED: 'inquiry_submitted',
  MAILTO_CLICK: 'mailto_click',
  IG_OUTBOUND: 'ig_outbound',
  MEDIA_KIT_CLICK: 'media_kit_click',
  CALENDAR_ADD: 'calendar_add',
};

const SCROLL_DEPTH_EVENT_AT = 0.75;   // brands_scroll_75

(function () {
  const send = (name, data) => {
    try {
      if (window.umami && typeof window.umami.track === 'function') {
        window.umami.track(name, data);
      }
    } catch (e) { /* analytics must never break the page */ }
  };

  // public hook for page modules (brands.js calls this on submit)
  window.pbTrack = send;

  // --- declarative: anything with data-track="event_name" -------
  document.addEventListener('click', (e) => {
    const el = e.target.closest && e.target.closest('[data-track]');
    if (el) send(el.dataset.track);
    const mail = e.target.closest && e.target.closest('a.obf-mail');
    if (mail) send(EVENTS.MAILTO_CLICK);
  }, { passive: true });

  // --- /brands page signals --------------------------------------
  const onBrands = location.pathname === '/brands' || location.pathname === '/brands/';
  if (!onBrands) return;

  send(EVENTS.BRANDS_VIEW);

  let fired75 = false;
  window.addEventListener('scroll', () => {
    if (fired75) return;
    const depth = (scrollY + innerHeight) / document.documentElement.scrollHeight;
    if (depth >= SCROLL_DEPTH_EVENT_AT) { fired75 = true; send(EVENTS.BRANDS_SCROLL_75); }
  }, { passive: true });

  const talk = document.getElementById('talk');
  if (talk && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { send(EVENTS.TALK_TO_US_VIEW); io.disconnect(); }
      });
    }, { threshold: 0.3 });
    io.observe(talk);
  }
})();
