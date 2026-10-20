/* BiolabNativo — interacciones (JS nativo, sin dependencias) */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- Navegación ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#navSheet a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Enlace activo según sección */
  const links = $$('.nav-links a');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Reveal al hacer scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Scroll: hero + manifiesto ---------- */
  const heroCard = $('#heroCard');
  const heroMedia = $('#heroMedia');
  const statement = $('#statement');
  const stmtWrap = $('#manifiesto');

  // Separa el manifiesto en palabras
  const hl = ['nativa.', 'flora'];
  const words = statement.textContent.trim().split(/\s+/).map(t => {
    const s = document.createElement('span');
    s.className = 'w' + (hl.includes(t.toLowerCase()) ? ' hl' : '');
    s.textContent = t;
    return s;
  });
  statement.textContent = '';
  words.forEach((w, i) => { statement.append(w); if (i < words.length - 1) statement.append(' '); });

  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    const vh = innerHeight;

    if (!reduceMotion && y < vh * 1.4) {
      const p = clamp(y / vh);
      heroCard.style.setProperty('--s', (1 - p * .07).toFixed(4));
      heroCard.style.setProperty('--o', (1 - p * 1.4).toFixed(3));
      heroMedia.style.setProperty('--py', (y * .18).toFixed(1) + 'px');
    }

    if (!reduceMotion) {
      const r = stmtWrap.getBoundingClientRect();
      const p = clamp((-r.top + vh * .15) / (r.height - vh * 1.05));
      const n = Math.round(p * words.length * 1.04);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Control segmentado (etapas) ---------- */
  const seg = $('#seg');
  const thumb = $('#segThumb');
  const tabs = $$('button', seg);
  const chapters = tabs.map(t => $(t.dataset.target));

  const moveThumb = tab => {
    thumb.style.width = tab.offsetWidth + 'px';
    thumb.style.transform = `translateX(${tab.offsetLeft}px)`;
    const target = tab.offsetLeft - (seg.clientWidth - tab.offsetWidth) / 2;
    if (seg.scrollWidth > seg.clientWidth) seg.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  const setActive = i => {
    tabs.forEach((t, k) => t.setAttribute('aria-selected', k === i));
    moveThumb(tabs[i]);
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => {
    chapters[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
  const chapterSpy = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) setActive(chapters.indexOf(en.target)); });
  }, { rootMargin: '-35% 0px -55% 0px' });
  chapters.forEach(c => chapterSpy.observe(c));
  addEventListener('resize', () => moveThumb(tabs.find(t => t.getAttribute('aria-selected') === 'true')));
  requestAnimationFrame(() => setActive(0));

  /* ---------- Carruseles ---------- */
  $$('.rail-wrap').forEach(wrap => {
    const rail = $('.rail', wrap);
    const [prev, next] = $$('.rail-btn', wrap);
    const update = () => {
      prev.disabled = rail.scrollLeft < 8;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    };
    [prev, next].forEach(b => b.addEventListener('click', () => {
      rail.scrollBy({ left: +b.dataset.dir * rail.clientWidth * .8, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
    rail.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    // Arrastrar con el mouse
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; rail.style.scrollSnapType = 'none'; }
      rail.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => { if (down) { down = false; rail.style.scrollSnapType = ''; } });
    rail.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    rail.addEventListener('dragstart', e => e.preventDefault());
    update();
  });

  /* ---------- Antes / Hoy ---------- */
  const compare = $('#compare');
  const range = $('.compare-range', compare);
  const setPos = v => compare.style.setProperty('--pos', v + '%');
  range.addEventListener('input', () => setPos(range.value));
  if (!reduceMotion) {
    // Pequeña demostración al entrar en pantalla
    const demo = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      demo.disconnect();
      const t0 = performance.now(), dur = 2600;
      const step = now => {
        const t = clamp((now - t0) / dur);
        if (range.matches(':active')) return;
        const v = 50 + Math.sin(t * Math.PI * 2) * 28 * (1 - t);
        range.value = v; setPos(v);
        if (t < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 500);
    }, { threshold: .6 });
    demo.observe(compare);
  }

  /* ---------- Visor de imágenes ---------- */
  const lb = $('#lb');
  const lbImg = $('img', lb);
  const lbCap = $('figcaption', lb);
  let group = [], idx = 0, lastFocus = null;

  const show = i => {
    idx = (i + group.length) % group.length;
    const src = group[idx];
    lbImg.style.opacity = 0;
    setTimeout(() => {
      lbImg.src = src.currentSrc || src.src;
      lbImg.alt = src.alt;
      lbCap.textContent = src.alt;
      lbImg.style.opacity = 1;
    }, 120);
  };
  const open = (img) => {
    const host = img.closest('[data-group]') || img.closest('.rail');
    group = $$('[data-lb]', host);
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lb.classList.add('show'));
    idx = group.indexOf(img);
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lbCap.textContent = img.alt;
    $('.lb-close', lb).focus();
  };
  const close = () => {
    lb.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; lbImg.removeAttribute('src'); }, 400);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  document.addEventListener('click', e => {
    const img = e.target.closest('img[data-lb]');
    if (img) open(img);
  });
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-nav.prev', lb).addEventListener('click', () => show(idx - 1));
  $('.lb-nav.next', lb).addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  // Deslizar en pantallas táctiles
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
