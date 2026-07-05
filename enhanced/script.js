/* Vigoraque — ENHANCED: GSAP-choreographed motion + core UX.
   Progressive enhancement: if GSAP is missing or reduced-motion is on,
   the page renders fully with all content visible. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     1. Core UX — always runs, no dependencies
     ===================================================== */

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header solid-on-scroll
  var header = document.getElementById('top');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile navigation
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

  // Language switch (visual stub — no translations yet)
  var langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      langBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      docEl.setAttribute('lang', btn.getAttribute('data-lang'));
      // TODO: wire up real EN/中文 translations here.
    });
  });

  // Scroll-spy active nav link
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

  // Contact form: validation + Formspree submit
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
    if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; } else setError(name, '');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.value.trim())) { setError(email, 'Enter a valid email address.'); ok = false; } else setError(email, '');
    if (!message.value.trim()) { setError(message, 'Tell us what you need.'); ok = false; } else setError(message, '');
    return ok;
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = ''; status.className = 'form-status';
      if (!validate()) { status.textContent = 'Please fix the highlighted fields.'; status.classList.add('err'); return; }
      if (form.action.indexOf('REPLACE_ME') !== -1) {
        status.textContent = 'Form looks good! Add your Formspree ID (see README) to start receiving inquiries.';
        status.classList.add('ok'); return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      var original = submitBtn.textContent;
      submitBtn.disabled = true; submitBtn.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.ok) { form.reset(); status.textContent = 'Thanks — your inquiry has been sent. We’ll be in touch shortly.'; status.classList.add('ok'); }
          else return res.json().then(function (data) { throw new Error(data && data.errors ? data.errors.map(function (x) { return x.message; }).join(', ') : 'Submission failed.'); });
        })
        .catch(function (err) { status.textContent = err.message || 'Something went wrong. Please email us directly.'; status.classList.add('err'); })
        .finally(function () { submitBtn.disabled = false; submitBtn.textContent = original; });
    });
    form.addEventListener('input', function (e) {
      if (e.target.closest('.field.invalid')) setError(e.target, '');
    });
  }

  /* =====================================================
     2. Split hero headline into masked words (for motion)
     ===================================================== */
  var heroTitle = document.querySelector('[data-split]');
  if (heroTitle) {
    var words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.textContent = '';
    words.forEach(function (w, i) {
      var mask = document.createElement('span');
      mask.className = 'word-mask';
      var inner = document.createElement('span');
      inner.className = 'word';
      inner.textContent = w;
      mask.appendChild(inner);
      heroTitle.appendChild(mask);
      if (i < words.length - 1) heroTitle.appendChild(document.createTextNode(' '));
    });
  }

  /* =====================================================
     3. Fallback: reveal everything if we can't animate
     ===================================================== */
  function revealAll() { docEl.classList.add('reveal-all'); }

  if (prefersReduced || !window.gsap) {
    revealAll();
    return; // core UX above already wired; skip all motion
  }

  /* =====================================================
     4. GSAP choreography
     ===================================================== */
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  // Counters (shared by stats + bento)
  function runCounter(el) {
    if (el.getAttribute('data-plain') === 'true') return;
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.6, ease: 'power2.out',
      onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; },
      onComplete: function () { el.textContent = target + suffix; }
    });
  }

  // Hero intro timeline (runs on load, once)
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-bg', { scale: 1.14, duration: 1.6, ease: 'power2.out' }, 0)
    .fromTo('[data-hero="eyebrow"]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.15)
    .fromTo('.hero-title .word', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.25)
    .fromTo('[data-hero="lead"]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.7)
    .fromTo('[data-hero="cta"]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.9)
    .to('[data-hero="scroll"]', { opacity: 1, duration: 0.6 }, 1.1);

  // Magnetic CTA (desktop pointer only)
  var cta = document.getElementById('magnetic-cta');
  var ctaInner = cta ? cta.querySelector('span') : null;
  if (cta && ctaInner && window.matchMedia('(pointer:fine)').matches) {
    var xTo = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power3' });
    var yTo = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power3' });
    var ixTo = gsap.quickTo(ctaInner, 'x', { duration: 0.5, ease: 'power3' });
    var iyTo = gsap.quickTo(ctaInner, 'y', { duration: 0.5, ease: 'power3' });
    cta.addEventListener('mousemove', function (e) {
      var r = cta.getBoundingClientRect();
      var mx = e.clientX - (r.left + r.width / 2);
      var my = e.clientY - (r.top + r.height / 2);
      xTo(mx * 0.35); yTo(my * 0.45);
      ixTo(mx * 0.18); iyTo(my * 0.22);
    });
    cta.addEventListener('mouseleave', function () {
      xTo(0); yTo(0); ixTo(0); iyTo(0);
    });
  }

  // Marquee infinite loop
  var mTrack = document.getElementById('marquee-track');
  if (mTrack) {
    // duplicate content so the loop is seamless
    mTrack.innerHTML += mTrack.innerHTML;
    var loop = gsap.to(mTrack, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
    mTrack.parentElement.addEventListener('mouseenter', function () { loop.timeScale(0.25); });
    mTrack.parentElement.addEventListener('mouseleave', function () { loop.timeScale(1); });
  }

  // Responsive contexts
  var mm = gsap.matchMedia();

  // --- Shared (all sizes): reveals, parallax, counters ---
  mm.add('(min-width: 1px)', function () {
    // Batched scroll reveals
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Counters on scroll
    gsap.utils.toArray('[data-count]').forEach(function (el) {
      window.ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () { runCounter(el); } });
    });

    // Hero background parallax on scroll
    gsap.to('.hero-bg', {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // About image parallax
    var aImg = document.querySelector('[data-parallax-img]');
    if (aImg) {
      gsap.fromTo(aImg, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: aImg, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    // Floating hero hex follows the pointer subtly
    var hex = document.querySelector('[data-float]');
    if (hex && window.matchMedia('(pointer:fine)').matches) {
      var hxTo = gsap.quickTo(hex, 'x', { duration: 1, ease: 'power2' });
      var hyTo = gsap.quickTo(hex, 'y', { duration: 1, ease: 'power2' });
      window.addEventListener('mousemove', function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5) * 60;
        var cy = (e.clientY / window.innerHeight - 0.5) * 60;
        hxTo(cx); hyTo(cy);
      });
    }
  });

  // --- Desktop only: pinned horizontal product showcase ---
  mm.add('(min-width: 901px)', function () {
    var showcase = document.querySelector('.showcase');
    var track = document.getElementById('showcase-track');
    var viewport = document.querySelector('.showcase-viewport');
    if (!showcase || !track || !viewport) return;

    showcase.classList.add('is-horizontal');

    var st = gsap.to(track, {
      x: function () { return -(track.scrollWidth - viewport.clientWidth); },
      ease: 'none',
      scrollTrigger: {
        trigger: showcase,
        start: 'top top',
        end: function () { return '+=' + (track.scrollWidth - viewport.clientWidth); },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // cleanup when leaving this context (e.g. resize to mobile)
    return function () {
      showcase.classList.remove('is-horizontal');
      if (st.scrollTrigger) st.scrollTrigger.kill();
      st.kill();
      gsap.set(track, { clearProps: 'x' });
    };
  });

  // Recalculate after images load (heights shift → ScrollTrigger positions)
  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
