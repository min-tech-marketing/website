/* Mobile navigation toggle */
(function () {
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.focus();
    }
  });

  // Reset when resizing back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
})();

/* Glass header: transparent over the hero, frosted once scrolled */
(function () {
  var header = document.querySelector('.site-header');
  if (!header || !header.classList.contains('site-header--overlay')) return;

  var trigger = 40;
  var ticking = false;

  function update() {
    header.classList.toggle('is-stuck', window.scrollY > trigger);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
