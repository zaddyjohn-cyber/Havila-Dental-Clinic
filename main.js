/* ============================================================
   HAVILA DENTAL CLINIC — Global JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll behaviour ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const heroEl = document.querySelector('.hero');

  const onScroll = () => {
    if (navbar.classList.contains('hero-dark')) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    } else {
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
      if (window.scrollY > 300) scrollBtn.classList.add('visible');
      else scrollBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Scroll-to-top ───────────────────────────────────────── */
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Mobile nav ──────────────────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('navClose');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => mobileNav.classList.add('open'));
    closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileNav.classList.remove('open'))
    );
  }

  /* ── Active nav link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Intersection Observer: entrance animations ──────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── Review Carousel ─────────────────────────────────────── */
  const track = document.getElementById('reviewTrack');
  const dots  = document.querySelectorAll('.dot');
  if (track && dots.length) {
    let current = 0;
    const cards = track.querySelectorAll('.review-card');
    const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const maxSlide = Math.max(0, cards.length - visibleCount);

    const goTo = (idx) => {
      current = Math.min(idx, maxSlide);
      const pct = (100 / visibleCount) * current;
      track.style.transform = `translateX(-${pct}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    goTo(0);

    // Auto-advance
    let timer = setInterval(() => goTo(current < maxSlide ? current + 1 : 0), 4500);
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo(current < maxSlide ? current + 1 : 0), 4500);
    });
  }

  /* ── Contact form ────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = '#4CAF50';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

});
