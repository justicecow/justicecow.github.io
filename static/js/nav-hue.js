// Slowly shift the navbar hue as you scroll.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  function tick() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var pct = Math.min(1, Math.max(0, window.scrollY / max));
    // Start at coral-ish (hue 350) and cycle a full 360° across one page of scroll.
    var hue = (350 + pct * 360) % 360;
    root.style.setProperty('--nav-hue', hue.toFixed(1));
  }
  tick();
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
})();
