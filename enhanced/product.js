/* Vigoraque — product detail pages: header, nav, reveals (progressive) */
(function () {
  'use strict';
  var docEl = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header solid-on-scroll
  var header = document.getElementById('top');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Language stub
  var langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      langBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      docEl.setAttribute('lang', btn.getAttribute('data-lang'));
    });
  });

  // Reveals — GSAP if available, otherwise show everything
  if (prefersReduced || !window.gsap) { docEl.classList.add('reveal-all'); return; }
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  // subtle hero image zoom-in
  gsap.from('.phero-bg', { scale: 1.12, duration: 1.4, ease: 'power2.out' });
  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
