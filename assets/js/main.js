/* Mobile navigation toggle */
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('nav-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close after choosing a link, so the page can scroll to its section
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset when resizing back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1060) setOpen(false);
  });
})();

/* Header: transparent over the hero, frosted once scrolled */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var ticking = false;

  function update() {
    header.classList.toggle('is-stuck', window.scrollY > 24);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* Highlight the main nav link for the section in view */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  // Watch every section, so the highlight clears over the hero and contact block
  var sections = document.querySelectorAll('main section[id]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  Array.prototype.forEach.call(sections, function (s) { observer.observe(s); });
})();

/* HubSpot contact form: tick the matching "I'm Interested In" option from ?topic= or from the button that was clicked */
(function () {
  var TOPICS = {
    buyback: 'Join the Buy Back Program - I have plastic scrap to sell',
    recycling: 'Advanced Recycling Services',
    destruction: 'Plastic Waste Destruction',
    custom: 'Custom Materials Recovery & Product Design Services',
    careers: 'Careers',
    general: 'Other'
  };
  var form = null;
  var pending = new URLSearchParams(window.location.search).get('topic');
  var autoTicked = null;

  function choose(key) {
    pending = key;
    if (!form || !TOPICS[key]) return;
    var box = form.querySelector('input[name="service_interested_in_mintech"][value="' + TOPICS[key] + '"]');
    // click() rather than setting .checked, so HubSpot's own form state updates too
    if (autoTicked && autoTicked !== box && autoTicked.checked) autoTicked.click();
    if (box && !box.checked) box.click();
    autoTicked = box;
  }

  // Called from the hbspt.forms.create onFormReady callback in index.html
  window.mtContactFormReady = function (f) {
    form = f && f.querySelector ? f : (f && f[0]) || document.querySelector('#hubspot-contact-form form');
    if (pending) choose(pending);
  };

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-topic]');
    if (link) choose(link.getAttribute('data-topic'));
  });
})();

/* Case study infographic: count the numbers up, pop in the cars and fill the ring once it scrolls into view */
(function () {
  var panel = document.querySelector('.impact');
  if (!panel || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var counters = Array.prototype.slice.call(panel.querySelectorAll('[data-count]'));
  var cars = panel.querySelectorAll('.impact__cars svg');
  Array.prototype.forEach.call(cars, function (c, i) { c.style.transitionDelay = (0.4 + i * 0.08) + 's'; });
  panel.classList.add('impact--animate');

  function format(n, el) { return n.toLocaleString('en-CA') + (el.textContent.indexOf('%') > -1 ? '%' : ''); }

  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    panel.classList.add('is-visible');
    counters.forEach(function (el) {
      var target = +el.getAttribute('data-count'), start = null, dur = 1400;
      function step(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(Math.round(target * eased), el);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.35 });
  observer.observe(panel);
})();

document.querySelectorAll('#year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
