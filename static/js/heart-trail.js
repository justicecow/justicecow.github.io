// "Even more…" easter egg: each click spawns the NEXT floating "more" pill
// along a heart curve. Complete the heart to pop confetti.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var N = 24;                // points around the heart
  var palette = ['var(--jc-coral)', 'var(--jc-butter)', 'var(--jc-lime)', 'var(--jc-sky)', 'var(--jc-plum)'];
  var pills = [];
  var step = 0;
  var active = false;

  // Heart curve (parametric). t in [0, 2π]. Returns {x, y} in unit-ish range.
  function heartAt(t) {
    var x = 16 * Math.pow(Math.sin(t), 3);
    var y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: x, y: y };
  }

  function viewportCenter() {
    return { cx: window.innerWidth / 2, cy: window.innerHeight / 2 };
  }

  function scale() {
    // Heart fits ~32 units wide × 30 tall. Target ~45% of min(vw,vh).
    var target = Math.min(window.innerWidth, window.innerHeight) * 0.45;
    return target / 32;
  }

  function spawnPill(index) {
    // index 0..N-1 is the NEXT pill to place.
    // Space points by starting at the top dip and going around.
    var t = (index / N) * Math.PI * 2 - Math.PI / 2;
    var p = heartAt(t);
    var s = scale();
    var c = viewportCenter();
    var x = c.cx + p.x * s;
    var y = c.cy + p.y * s;

    var pill = document.createElement('button');
    pill.className = 'jc-heart-pill';
    pill.textContent = 'More';
    pill.style.setProperty('--hc', palette[index % palette.length]);
    pill.style.left = x + 'px';
    pill.style.top = y + 'px';
    pill.setAttribute('aria-label', 'More (' + (index + 1) + ' of ' + N + ')');

    pill.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      // Mark this pill as "used" (static dot), then place the next one.
      pill.classList.add('placed');
      pill.disabled = true;
      step += 1;
      if (step < N) {
        spawnPill(step);
      } else {
        complete();
      }
    });

    document.body.appendChild(pill);
    pills.push(pill);

    // Entrance animation
    pill.animate(
      [
        { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%,-50%) scale(1.2)', opacity: 1, offset: 0.6 },
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }
      ],
      { duration: 280, easing: 'cubic-bezier(.2,.8,.3,1.2)', fill: 'forwards' }
    );
  }

  function complete() {
    // Pulse the heart, then pop everything + confetti.
    pills.forEach(function (p, i) {
      setTimeout(function () {
        p.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1)' },
            { transform: 'translate(-50%,-50%) scale(1.6)', offset: 0.5 },
            { transform: 'translate(-50%,-50%) scale(0)' }
          ],
          { duration: 450, easing: 'cubic-bezier(.5,0,.75,.2)', fill: 'forwards' }
        );
      }, i * 20);
    });

    setTimeout(function () {
      pills.forEach(function (p) { p.remove(); });
      pills = [];
      step = 0;
      active = false;
      fireConfetti();
    }, 900);
  }

  function fireConfetti() {
    var n = 80;
    var container = document.createElement('div');
    container.className = 'jc-confetti';
    document.body.appendChild(container);

    for (var i = 0; i < n; i++) {
      var bit = document.createElement('span');
      bit.className = 'jc-confetti-bit';
      bit.style.setProperty('--cc', palette[i % palette.length]);
      bit.style.left = Math.random() * 100 + 'vw';
      bit.style.width = (8 + Math.random() * 8) + 'px';
      bit.style.height = bit.style.width;
      container.appendChild(bit);

      var duration = 2200 + Math.random() * 1800;
      var delay = Math.random() * 400;
      var drift = (Math.random() - 0.5) * 160;
      var spin = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720);

      bit.animate(
        [
          { transform: 'translate(0,-20px) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + drift + 'px,' + (window.innerHeight + 40) + 'px) rotate(' + spin + 'deg)', opacity: 1, offset: 0.9 },
          { transform: 'translate(' + drift + 'px,' + (window.innerHeight + 40) + 'px) rotate(' + spin + 'deg)', opacity: 0 }
        ],
        { duration: duration, delay: delay, easing: 'cubic-bezier(.25,.46,.45,.94)', fill: 'forwards' }
      );
    }

    setTimeout(function () { container.remove(); }, 4500);
  }

  document.addEventListener('click', function (e) {
    var trig = e.target.closest && e.target.closest('.jc-heart-trigger');
    if (!trig) return;
    e.preventDefault();
    if (active) return;
    active = true;
    step = 0;
    // Close the dropdown cleanly
    try {
      var dd = trig.closest('.dropdown');
      var toggle = dd && dd.querySelector('[data-bs-toggle="dropdown"]');
      if (toggle && window.bootstrap && window.bootstrap.Dropdown) {
        var instance = window.bootstrap.Dropdown.getInstance(toggle) || new window.bootstrap.Dropdown(toggle);
        instance.hide();
      }
    } catch (err) { /* noop */ }
    spawnPill(0);
  });
})();
