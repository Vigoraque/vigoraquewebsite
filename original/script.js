/* Vigoraque — industrial reskin: sticky header, mobile nav, scroll-spy,
   animated counters, language stub, contact form UX */
(function () {
  'use strict';

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header solid-on-scroll ---------- */
  var header = document.getElementById('top');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Language switch (visual stub — no translations yet) ---------- */
  var langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      langBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.documentElement.setAttribute('lang', btn.getAttribute('data-lang'));
      // TODO: wire up real EN/中文 translations here.
    });
  });

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  var sections = ['company', 'products', 'capabilities', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Animated counters (count up from 0, once) ---------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  function animateCount(el) {
    if (el.getAttribute('data-plain') === 'true') return; // e.g. "2001" — show as-is
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!reduce) animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { countObs.observe(c); });
  }

  /* ---------- Contact form: validation + Formspree submit ---------- */
  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');

  function setError(field, msg) {
    var wrap = field.closest('.field');
    var err = wrap ? wrap.querySelector('.field-error') : null;
    if (wrap) wrap.classList.toggle('invalid', !!msg);
    if (err) err.textContent = msg || '';
  }

  function validate() {
    var ok = true;
    var name = form.querySelector('#name');
    var email = form.querySelector('#email');
    var message = form.querySelector('#message');

    if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; }
    else setError(name, '');

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.value.trim())) { setError(email, 'Enter a valid email address.'); ok = false; }
    else setError(email, '');

    if (!message.value.trim()) { setError(message, 'Tell us what you need.'); ok = false; }
    else setError(message, '');

    return ok;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      if (!validate()) {
        status.textContent = 'Please fix the highlighted fields.';
        status.classList.add('err');
        return;
      }

      if (form.action.indexOf('REPLACE_ME') !== -1) {
        status.textContent = 'Form looks good! Add your Formspree ID (see README) to start receiving inquiries.';
        status.classList.add('ok');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.textContent = 'Thanks — your inquiry has been sent. We’ll be in touch shortly.';
            status.classList.add('ok');
          } else {
            return res.json().then(function (data) {
              throw new Error(data && data.errors ? data.errors.map(function (x) { return x.message; }).join(', ') : 'Submission failed.');
            });
          }
        })
        .catch(function (err) {
          status.textContent = err.message || 'Something went wrong. Please email us directly.';
          status.classList.add('err');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
        });
    });

    form.addEventListener('input', function (e) {
      if (e.target.closest('.field.invalid')) setError(e.target, '');
    });
  }
})();
