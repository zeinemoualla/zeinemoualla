/* =========================================================
   Zeine Moualla — interactions
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  /* ---------- Smooth scroll (Lenis) synced with ScrollTrigger ---------- */
  let lenis = null;
  if (!reduceMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      });
    });
  }

  /* ---------- Videos: play only while on screen ---------- */
  const videos = document.querySelectorAll('video[data-autoplay]');
  videos.forEach((v) => {
    const markReady = () => v.classList.add('is-ready');
    if (v.readyState >= 3) markReady();
    else v.addEventListener('canplay', markReady, { once: true });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (v.preload === 'none') v.preload = 'auto';
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  videos.forEach((v) => io.observe(v));

  /* ---------- YouTube: light thumbnail first, player only on click ---------- */
  document.querySelectorAll('[data-yt]').forEach((card) => {
    const id = card.dataset.yt;
    const frame = card.querySelector('.yt__frame');
    const img = card.querySelector('.yt__thumb');
    const fallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    img.addEventListener('error', () => { if (img.src !== fallback) img.src = fallback; });
    img.addEventListener('load', () => { if (img.naturalWidth <= 120 && img.src !== fallback) img.src = fallback; });
    img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

    frame.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = card.querySelector('.yt__title').textContent;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
      frame.style.cursor = 'default';
    }, { once: true });
  });

  /* ---------- Nav state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!hasGsap || reduceMotion) {
    // Film chapters become plain stacked videos — let them autoplay like the rest
    document.querySelectorAll('video[data-film]').forEach((v) => io.observe(v));
    // Static fallback: show the hero in its finished, full-bleed state
    const media = document.getElementById('heroMedia');
    if (media) {
      media.style.setProperty('--clip-top', '0px');
      media.style.setProperty('--clip-x', '0px');
      media.style.setProperty('--clip-bottom', '0px');
      media.style.setProperty('--clip-r', '0px');
      media.style.setProperty('--vid-scale', '1');
      media.style.setProperty('--shade', '1');
      document.querySelector('.hero__overlay').style.opacity = 1;
      document.querySelector('.hero__intro').style.display = 'none';
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero: load-in ---------- */
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('.hero__eyebrow', { y: 14, opacity: 0, duration: 1.2 }, 0.1)
    .from('.hero__title .line > span', { yPercent: 110, duration: 1.6 }, 0.15)
    .from('.hero__lead .line > span', { yPercent: 110, duration: 1.4 }, 0.35)
    .from('#heroMedia', { yPercent: 8, opacity: 0, duration: 1.8 }, 0.4)
    .from('.nav', { yPercent: -100, duration: 1.2 }, 0.2);

  /* ---------- Hero: scroll — card expands to full bleed ---------- */
  const media = document.getElementById('heroMedia');
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const start = isMobile
    ? { top: 50, x: 16, xUnit: 'px', bottom: 16, r: 20 }
    : { top: 52, x: 7, xUnit: 'vw', bottom: 5, r: 28 };

  const state = { p: 0 };
  const apply = () => {
    const p = state.p;
    const k = 1 - p;
    media.style.setProperty('--clip-top', `${start.top * k}vh`);
    media.style.setProperty('--clip-x', `${start.x * k}${start.xUnit}`);
    media.style.setProperty('--clip-bottom', `${start.bottom * k}${isMobile ? 'px' : 'vh'}`);
    media.style.setProperty('--clip-r', `${start.r * k}px`);
    media.style.setProperty('--vid-scale', `${1.18 - 0.18 * p}`);
  };
  apply();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
    },
  });
  tl.to('.hero__intro', { yPercent: -30, opacity: 0, ease: 'power1.in', duration: 0.22 }, 0)
    .to(state, { p: 1, ease: 'power2.inOut', duration: 0.6, onUpdate: apply }, 0)
    .to(media, { '--shade': 1, ease: 'none', duration: 0.3 }, 0.4)
    .fromTo('.hero__overlay', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.5)
    .to({}, { duration: 0.25 }); // hold the full-bleed frame before releasing

  /* ---------- Manifesto: words light up as you scroll ---------- */
  document.querySelectorAll('[data-words]').forEach((el) => {
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = part;
        words.push(span);
        frag.append(span);
      });
      node.replaceWith(frag);
    });

    const section = el.closest('section');
    const paint = (p) => {
      const lit = p * (words.length + 4);       // a few words of "glow" ahead
      words.forEach((w, i) => {
        const o = Math.min(1, Math.max(0.14, (lit - i) / 4));
        w.style.setProperty('--o', o.toFixed(3));
      });
    };
    paint(0);
    ScrollTrigger.create({
      trigger: section,
      start: 'top 35%',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => paint(self.progress),
    });
  });

  /* ---------- Film: pinned chapters wipe up over one another ---------- */
  const film = document.getElementById('film');
  if (film) {
    const panels = gsap.utils.toArray('.film__panel', film);
    const captions = gsap.utils.toArray('.film__caption', film);
    const bars = gsap.utils.toArray('.film__bars i', film);
    const count = film.querySelector('.film__count b');
    const filmVideos = panels.map((p) => p.querySelector('video'));
    const n = panels.length;
    let current = -1;

    const ftl = gsap.timeline({
      defaults: { ease: 'none' },
      // follow the (smoothed) timeline, not raw scroll, so counter + videos match what's on screen
      onUpdate: () => updateFilm(ftl.time() / ftl.duration()),
      scrollTrigger: {
        trigger: film,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onToggle: (self) => {
          if (!self.isActive) { filmVideos.forEach((v) => v.pause()); current = -1; }
          else updateFilm(ftl.time() / ftl.duration());
        },
      },
    });

    // Each chapter = 1 unit: hold, then the next panel wipes up from the bottom
    panels.forEach((panel, i) => {
      const vid = filmVideos[i];
      ftl.fromTo(vid, { '--s': 1.12 }, { '--s': 1, duration: 1 }, i);   // slow push-in per chapter
      if (i === 0) return;
      ftl.fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' },
                        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power2.inOut' }, i - 0.45)
         .to(captions[i - 1], { opacity: 0, y: -24, duration: 0.2 }, i - 0.45)
         .fromTo(captions[i], { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, i - 0.15);
    });

    function updateFilm(p) {
      const pos = p * n;                                  // 0 … n
      const idx = Math.min(n - 1, Math.floor(pos + 0.45)); // chapter showing on screen
      bars.forEach((b, i) => b.style.setProperty('--f', Math.min(1, Math.max(0, pos - i)).toFixed(3)));
      if (idx === current) return;
      current = idx;
      count.textContent = String(idx + 1).padStart(2, '0');
      filmVideos.forEach((v, i) => {
        if (i === idx || i === idx - 1) {                 // on screen, or still being covered
          v.preload = 'auto';
          v.play().catch(() => {});
        } else {
          v.pause();
          if (i === idx + 1 && v.readyState === 0) {      // warm up the next chapter
            v.preload = 'auto';
            v.load();
          }
        }
      });
    }
  }

  /* ---------- Generic fade-up reveals ---------- */
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  /* Nav turns dark over full-bleed media and dark sections */
  ['#film', '[data-nav="dark"]'].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top top+=56', end: 'bottom top+=56',
        toggleClass: { targets: nav, className: 'is-dark' },
      });
    });
  });
  ScrollTrigger.create({
    trigger: '#hero',
    start: () => `top+=${window.innerHeight * 0.55} top`,
    end: 'bottom top+=56',
    toggleClass: { targets: nav, className: 'is-dark' },
  });
})();
