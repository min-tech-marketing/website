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

/* Contact form: preselect the topic from ?topic= or from the link that was clicked */
(function () {
  var select = document.getElementById('topic');
  if (!select) return;

  function choose(value) {
    if (value && select.querySelector('option[value="' + value + '"]')) select.value = value;
  }

  choose(new URLSearchParams(window.location.search).get('topic'));

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-topic]');
    if (link) choose(link.getAttribute('data-topic'));
  });

  // Not wired to an inbox yet: keep the visitor on the page and say so
  var form = select.form;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var note = form.querySelector('.form-note');
    note.textContent = 'Thanks! This form is not connected to an inbox yet, so your message was not sent.';
  });
})();

document.querySelectorAll('#year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
