/* ============================================================
   HAVILA DENTAL CLINIC — Global JS (Dark Luxury Rebuild)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ───────────────────────────────────────── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.innerWidth > 768) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const animCursor = () => {
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animCursor);
    };
    animCursor();
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* ── Navbar ──────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 60);
    if (scrollTop) scrollTop.classList.toggle('visible', y > 320);
  }, { passive: true });

  if (scrollTop) scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile nav ──────────────────────────────────────────── */
  const toggle    = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn  = document.getElementById('navClose');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => mobileNav.classList.add('open'));
    closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  /* ── Active nav link ─────────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Intersection Observer: reveal animations ────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

  /* ── Animated counters ───────────────────────────────────── */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isFloat = el.dataset.float === 'true';
      const duration = 2200;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const val = eased * target;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── Testimonials carousel ───────────────────────────────── */
  const track = document.getElementById('testiTrack');
  const dotsEl = document.querySelectorAll('.testi-dot');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    const isMobile = window.innerWidth < 768;
    const perView = isMobile ? 1 : (window.innerWidth < 1024 ? 1 : 2);
    const max = Math.max(0, cards.length - perView);
    let cur = 0;

    const goTo = idx => {
      cur = Math.max(0, Math.min(idx, max));
      const w = track.parentElement.offsetWidth;
      const cardW = (w - (perView - 1) * 24) / perView;
      track.style.transform = `translateX(-${cur * (cardW + 24)}px)`;
      dotsEl.forEach((d, i) => d.classList.toggle('active', i === cur));
    };

    dotsEl.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(cur - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(cur + 1));

    goTo(0);
    let timer = setInterval(() => goTo(cur >= max ? 0 : cur + 1), 5000);
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo(cur >= max ? 0 : cur + 1), 5000);
    });

    // Touch / drag
    let startX = 0, dragging = false;
    track.addEventListener('mousedown',  e => { startX = e.clientX; dragging = true; });
    track.addEventListener('mouseup',    e => { if (!dragging) return; dragging = false; if (e.clientX - startX < -60) goTo(cur+1); else if (e.clientX - startX > 60) goTo(cur-1); });
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => { const dx = e.changedTouches[0].clientX - startX; if (dx < -50) goTo(cur+1); else if (dx > 50) goTo(cur-1); }, { passive: true });
  }

  /* ── Contact form ────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#1a3a1f';
      btn.style.borderColor = '#25D366';
      btn.style.color = '#25D366';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3800);
    });
  }

  /* ── Service list items: show/hide description ───────────── */
  document.querySelectorAll('.service-list-item').forEach(item => {
    const desc = item.querySelector('.svc-desc');
    if (!desc) return;
    desc.style.maxHeight = '0';
    desc.style.overflow = 'hidden';
    desc.style.opacity = '0';
    desc.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease';
    item.addEventListener('mouseenter', () => {
      desc.style.maxHeight = desc.scrollHeight + 'px';
      desc.style.opacity = '1';
      desc.style.marginTop = '0.5rem';
    });
    item.addEventListener('mouseleave', () => {
      desc.style.maxHeight = '0';
      desc.style.opacity = '0';
      desc.style.marginTop = '0';
    });
  });

});
