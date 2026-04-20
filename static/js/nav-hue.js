// Step through the JC palette as you scroll — discrete snaps, not continuous
// interpolation, so we never sit on an intermediate (non-palette) hue.
// The CSS 0.6s transition on .jc-navbar handles the quick cross-fade.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Palette hues (coral, butter, lime, sky, plum) — match tokens in style.css.
  var STOPS = [350, 50, 75, 195, 285];

  var root = document.documentElement;
  var last = -1;

  function tick() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var pct = Math.min(1, Math.max(0, window.scrollY / max));
    var idx = Math.min(STOPS.length - 1, Math.floor(pct * STOPS.length));
    if (idx !== last) {
      last = idx;
      root.style.setProperty('--nav-hue', STOPS[idx]);
    }
  }
  tick();
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
})();
