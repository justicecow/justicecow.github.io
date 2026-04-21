// Click a sparkle → pixelated shooting star flies off in a random direction.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var COLORS = ['#ff4560', '#ffd93d', '#b8e24a', '#46c7f0', '#8a1fcf'];

  document.addEventListener('click', function (e) {
    var sparkle = e.target.closest && e.target.closest('.sparkle');
    if (!sparkle) return;
    shoot(sparkle);
  });

  function shoot(sparkle) {
    var r = sparkle.getBoundingClientRect();
    var startX = r.left + r.width / 2;
    var startY = r.top + r.height / 2;

    var dir = Math.random() * Math.PI * 2;
    var dist = Math.max(window.innerWidth, window.innerHeight) * 1.3;
    var rotDeg = (dir * 180 / Math.PI).toFixed(2);

    var color = COLORS[Math.floor(Math.random() * COLORS.length)];

    var star = document.createElement('div');
    star.className = 'jc-shooting-star';
    star.style.left = startX + 'px';
    star.style.top = startY + 'px';
    star.style.setProperty('--sc', color);
    document.body.appendChild(star);

    var keyframes = [
      { transform: 'translate(-50%,-50%) rotate(' + rotDeg + 'deg) translateX(0) scale(0.2)', opacity: 0.5 },
      { transform: 'translate(-50%,-50%) rotate(' + rotDeg + 'deg) translateX(' + (dist * 0.35) + 'px) scale(1.2)', opacity: 1, offset: 0.4 },
      { transform: 'translate(-50%,-50%) rotate(' + rotDeg + 'deg) translateX(' + (dist * 0.75) + 'px) scale(4)', opacity: 1, offset: 0.8 },
      { transform: 'translate(-50%,-50%) rotate(' + rotDeg + 'deg) translateX(' + dist + 'px) scale(9)', opacity: 0 }
    ];
    var anim = star.animate(keyframes, {
      duration: 3500 + Math.random() * 800,
      easing: 'cubic-bezier(.55, 0, .85, .25)'
    });
    anim.onfinish = function () { star.remove(); };
  }
})();
