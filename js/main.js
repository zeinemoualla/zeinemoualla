/* =========================================================
   Zeine Moualla · interactions
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  /* ---------- Smooth scroll (Lenis) synced with ScrollTrigger ---------- */
  let lenis = null;
  if (!reduceMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    if (hasGsap) {
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

  /* ---------- Slots: one or more clips playing back to back in the same frame ---------- */
  const PREFIX = '3D Designer, unreal engine developer, Zeine Moualla-';
  const FADE = 0.9;                       // seconds of cross-dissolve between clips
  const toUrl = (p) => p.replace('~', PREFIX).split('/').map(encodeURIComponent).join('/');

  class Slot {
    constructor(el) {
      this.el = el;
      this.list = JSON.parse(el.dataset.playlist).map(toUrl);
      this.i = 0;
      this.active = false;
      this.switching = false;
      this.vids = [0, 1].map(() => {
        const v = document.createElement('video');
        v.muted = true;
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.setAttribute('aria-hidden', 'true');
        v.preload = 'none';
        el.appendChild(v);
        return v;
      });
      this.cur = this.vids[0];
      this.cur.classList.add('is-on');
      this.setSrc(this.cur, this.list[0]);
      if (this.list.length === 1) {
        this.cur.loop = true;
        this.vids[1].remove();
        this.vids.length = 1;
      } else {
        this.vids.forEach((v) => {
          v.addEventListener('timeupdate', () => {
            if (v === this.cur && v.duration && v.duration - v.currentTime < FADE) this.next();
          });
          v.addEventListener('ended', () => { if (v === this.cur) this.next(); });
        });
      }
      this.vids.forEach((v) => v.addEventListener('playing', () => el.classList.add('is-ready'), { once: true }));
      if (el.hasAttribute('data-eager')) this.warm();
    }
    setSrc(v, src) {
      if (v.dataset.src === src) return;
      v.dataset.src = src;
      v.src = src;
    }
    warm() {
      if (this.cur.preload !== 'auto') { this.cur.preload = 'auto'; this.cur.load(); }
    }
    prepNext() {
      if (this.list.length < 2) return;
      const nxt = this.vids.find((v) => v !== this.cur);
      const src = this.list[(this.i + 1) % this.list.length];
      if (nxt.dataset.src !== src) { nxt.preload = 'auto'; this.setSrc(nxt, src); nxt.load(); }
    }
    next() {
      if (this.switching || this.list.length < 2) return;
      this.switching = true;
      this.i = (this.i + 1) % this.list.length;
      const old = this.cur;
      const nxt = this.vids.find((v) => v !== old);
      this.setSrc(nxt, this.list[this.i]);
      nxt.preload = 'auto';
      try { nxt.currentTime = 0; } catch (e) { /* not loaded yet */ }
      const swap = () => {
        this.cur = nxt;
        old.classList.replace('is-on', 'is-leaving');   // stays visible underneath
        nxt.classList.add('is-on');                      // fades in on top
        setTimeout(() => {
          old.classList.remove('is-leaving');
          old.pause();
          this.switching = false;
          this.prepNext();
        }, FADE * 1000 + 50);
      };
      if (this.active) {
        // if the next clip can't start, keep the current one looping and try again later
        nxt.play().then(swap).catch(() => {
          this.switching = false;
          this.i = (this.i - 1 + this.list.length) % this.list.length;
          if (old.paused) this.kick();
        });
      } else {
        swap();
      }
    }
    play() {
      if (this.active) return;
      this.active = true;
      this.warm();
      this.kick();
      setTimeout(() => this.active && this.prepNext(), 1200);
    }
    // Start the current clip; if the browser refuses (still loading, interrupted), retry
    kick(tries = 0) {
      const v = this.cur;
      v.play().catch(() => {
        if (!this.active || tries > 8) return;
        const retry = () => { if (this.active && v === this.cur && v.paused) this.kick(tries + 1); };
        v.addEventListener('canplay', retry, { once: true });
        setTimeout(retry, 1200);
      });
    }
    pause() {
      this.active = false;
      this.vids.forEach((v) => v.pause());
    }
  }

  const slots = new Map();
  document.querySelectorAll('.slot[data-playlist]').forEach((el) => slots.set(el, new Slot(el)));
  const slotOf = (el) => slots.get(el);

  // Slots play only while on screen (film chapters are driven by the scroll timeline instead)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const s = slotOf(target);
      if (isIntersecting) s.play(); else s.pause();
    });
  }, { rootMargin: '150px 0px', threshold: 0.01 });
  slots.forEach((s, el) => { if (!el.hasAttribute('data-manual')) io.observe(el); });

  // Browsers pause muted videos in hidden tabs; resume the ones that should be playing on return
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    slots.forEach((s) => { if (s.active && s.cur.paused) s.kick(); });
  });

  /* ---------- Teaser: quick cuts through the best shots, a short white flash at every cut.
     Two video elements take turns: one is on screen while the other loads the next shot. ---------- */
  const teaser = document.getElementById('teaser');
  if (teaser) {
    const SHOT_MS = 1500;
    const shots = JSON.parse(teaser.dataset.shots).map((s) => ({ src: toUrl(s.src), at: +s.at || 0 }));
    const [va, vb] = teaser.querySelectorAll('.teaser__shot');
    const flash = teaser.querySelector('.teaser__flash');
    let onScreen = null, waiting = va, next = 0, timer = 0, running = false;

    // load a shot into a (hidden) video and park it on its start frame; resolves when ready to show
    const prepare = (v, shot) => new Promise((resolve) => {
      const park = () => {
        v.currentTime = Math.min(shot.at, Math.max(0, (v.duration || 5) - SHOT_MS / 1000 - 0.1));
        v.addEventListener('seeked', () => resolve(v), { once: true });
      };
      if (v.dataset.src === shot.src && v.readyState >= 1) park();
      else {
        v.dataset.src = shot.src;
        v.src = shot.src;
        v.addEventListener('loadedmetadata', park, { once: true });
        v.load();
      }
    });

    let ready = prepare(va, shots[0]);
    const cut = async () => {
      if (!running) return;
      const v = await ready;                       // wait if the next shot is still loading
      if (!running) return;
      v.play().catch(() => {});
      v.classList.remove('is-on'); void v.offsetWidth; v.classList.add('is-on');   // restart the push-in
      if (onScreen) { onScreen.classList.remove('is-on'); onScreen.pause(); }
      if (reduceMotion) { v.loop = true; return; } // no flashing cuts for reduced motion: loop the first shot
      if (onScreen) { flash.classList.remove('is-flash'); void flash.offsetWidth; flash.classList.add('is-flash'); }
      onScreen = v;
      waiting = v === va ? vb : va;
      next = (next + 1) % shots.length;
      ready = prepare(waiting, shots[next]);       // load the following shot while this one plays
      timer = setTimeout(cut, SHOT_MS);
    };
    // run only while the teaser is on screen
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; if (onScreen) onScreen.play().catch(() => {}); timer = setTimeout(cut, onScreen ? SHOT_MS : 0); }
      else if (!e.isIntersecting && running) { running = false; clearTimeout(timer); if (onScreen) onScreen.pause(); }
    }).observe(teaser);
  }

  /* ---------- Molecule (fallback without scroll animation): when in view, the video plays once,
     then iteration 3 fades in and stays. With scroll animation, see "Molecule: scroll-driven" below. ---------- */
  const mol = document.getElementById('molecule');
  if (mol && (!hasGsap || reduceMotion)) {
    const molVideo = mol.querySelector('.mol__video');
    const molImage = mol.querySelector('.mol__frame--image');
    molVideo.addEventListener('ended', () => molImage.classList.add('is-shown'));
    new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.5) {
        if (!molImage.classList.contains('is-shown') && molVideo.paused) molVideo.play().catch(() => {});
      } else if (!entry.isIntersecting) {
        // fully out of view: reset, so the sequence plays again next time
        molVideo.pause();
        molVideo.currentTime = 0;
        molImage.classList.remove('is-shown');
      }
    }, { threshold: [0, 0.5] }).observe(mol);
  }

  /* ---------- Wave (fallback without scroll animation): both clips simply loop in their columns ---------- */
  const wave = document.getElementById('wave');
  if (wave && (!hasGsap || reduceMotion)) {
    wave.querySelectorAll('.wave__clip').forEach((v) => { v.loop = true; v.play().catch(() => {}); });
  }

  /* ---------- Scroll sequences (fallback without scroll animation): clips play back to back on a loop ---------- */
  if (!hasGsap || reduceMotion) {
    document.querySelectorAll('[data-seq]').forEach((sec) => {
      const clips = [...sec.querySelectorAll('.seq__clip')];
      const label = sec.querySelector('.seq__clipname');
      let i = 0;
      const show = (k) => {
        clips.forEach((v, j) => { v.style.opacity = j === k ? 1 : 0; if (j !== k) v.pause(); });
        clips[k].preload = 'auto';
        clips[k].currentTime = 0;
        clips[k].play().catch(() => {});
        if (label) label.textContent = clips[k].dataset.label || '';
      };
      clips.forEach((v) => v.addEventListener('ended', () => { i = (i + 1) % clips.length; show(i); }));
      show(0);
    });
  }

  /* ---------- YouTube: thumbnail first, full-screen player on click ---------- */
  const player = document.getElementById('player');
  if (player) {
  const stage = player.querySelector('.player__stage');
  let lastTrigger = null;

  function openPlayer(id, title, trigger) {
    lastTrigger = trigger;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&fs=1`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    stage.replaceChildren(iframe);
    player.hidden = false;
    document.documentElement.classList.add('player-open');
    if (lenis) lenis.stop();
    slots.forEach((s) => s.pause());
    // Full screen by default (where the browser allows it); Esc leaves full screen and closes
    if (player.requestFullscreen) player.requestFullscreen().catch(() => {});
    player.querySelector('.player__close').focus({ preventScroll: true });
  }

  function closePlayer() {
    if (player.hidden) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    stage.replaceChildren();               // removing the iframe stops the video
    player.hidden = true;
    document.documentElement.classList.remove('player-open');
    if (lenis) lenis.start();
    io.takeRecords();
    slots.forEach((s, el) => {             // resume on-screen slots
      if (el.hasAttribute('data-manual')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) s.play();
    });
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  player.querySelector('.player__close').addEventListener('click', closePlayer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePlayer(); });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !player.hidden) closePlayer();
  });

  document.querySelectorAll('[data-yt]').forEach((card) => {
    const id = card.dataset.yt;
    const frame = card.querySelector('.yt__frame');
    const img = card.querySelector('.yt__thumb');
    const fallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    img.addEventListener('error', () => { if (img.src !== fallback) img.src = fallback; });
    img.addEventListener('load', () => { if (img.naturalWidth <= 120 && img.src !== fallback) img.src = fallback; });
    img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    frame.addEventListener('click', () => openPlayer(id, card.querySelector('.yt__title').textContent, frame));
  });
  } // end player

  /* ---------- Visitor statistics: record which sections each visit reaches (GoatCounter events).
     The site is one long page, so this shows how far people get. Sent once per section per visit;
     does nothing on localhost or if GoatCounter is blocked. ---------- */
  const SECTION_NAMES = {
    teaser: 'Teaser', hero: 'Hero', manifesto: 'Manifesto', work: 'Museum of Contemporary Art',
    molecule: 'Molecule', wave: 'Wave', petals: 'Three Petals', 'interiors-a': 'Interiors',
    'interiors-b': 'Hotel lobby', 'interiors-c': 'Hotel bedroom', films: 'Films', about: 'About', contact: 'Contact',
  };
  if (!/^(localhost|127\.)/.test(location.hostname)) {
    const seen = new Set();
    const send = (id, tries = 0) => {
      if (seen.has(id)) return;
      if (!window.goatcounter || !window.goatcounter.count) {      // counter script still loading: try again shortly
        if (tries < 20) setTimeout(() => send(id, tries + 1), 500);
        return;
      }
      seen.add(id);
      window.goatcounter.count({ path: `section/${id}`, title: SECTION_NAMES[id], event: true });
    };
    // a section counts as "reached" once it crosses the middle of the screen (works for tall, pinned sections too)
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) send(e.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    Object.keys(SECTION_NAMES).forEach((id) => { const el = document.getElementById(id); if (el) sio.observe(el); });
  }

  /* ---------- Tools strip: write the list twice so the loop is seamless ---------- */
  document.querySelectorAll('.tools__track').forEach((track) => {
    if (reduceMotion) return;
    [...track.children].forEach((li) => {
      const copy = li.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  });

  /* ---------- Nav state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // No top bar while the teaser is on screen; it slides in once you scroll past it
  if (teaser) {
    new IntersectionObserver(([e]) => nav.classList.toggle('is-hidden', e.isIntersecting),
      { rootMargin: `-${nav.offsetHeight || 56}px 0px 0px 0px` }).observe(teaser);
  }

  if (!hasGsap || reduceMotion) {
    // Film chapters become plain stacked videos, so let them play like the rest
    slots.forEach((s, el) => { if (el.hasAttribute('data-manual')) io.observe(el); });
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

  if (document.getElementById('heroMedia')) {
  /* ---------- Hero: load-in ---------- */
  // With the teaser in front, the hero's intro plays when you reach it (and the top bar is handled
  // by the teaser); without it, the intro plays on page load as before
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: !!teaser });
  intro
    .from('.hero__eyebrow', { y: 14, opacity: 0, duration: 1.2 }, 0.1)
    .from('.hero__title .line > span', { yPercent: 110, duration: 1.6 }, 0.15)
    .from('.hero__lead .line > span', { yPercent: 110, duration: 1.4 }, 0.35)
    .from('#heroMedia', { yPercent: 8, opacity: 0, duration: 1.8 }, 0.4);
  if (teaser) ScrollTrigger.create({ trigger: '#hero', start: 'top 75%', once: true, onEnter: () => intro.play() });
  else intro.from('.nav', { yPercent: -100, duration: 1.2 }, 0.2);

  /* ---------- Hero: scroll, card expands to full bleed ---------- */
  const media = document.getElementById('heroMedia');
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const start = isMobile
    ? { x: 16, xUnit: 'px', bottom: 16, r: 20 }
    : { x: 7, xUnit: 'vw', bottom: 5, r: 28 };

  // The video frame starts just below the headline, so the text never sits on the video
  const introEl = document.querySelector('.hero__intro');
  let topPx = 0;
  const measure = () => { topPx = introEl.offsetTop + introEl.offsetHeight + (isMobile ? 24 : 40); };
  measure();

  const state = { p: 0 };
  const apply = () => {
    const p = state.p;
    const k = 1 - p;
    media.style.setProperty('--clip-top', `${topPx * k}px`);
    media.style.setProperty('--clip-x', `${start.x * k}${start.xUnit}`);
    media.style.setProperty('--clip-bottom', `${start.bottom * k}${isMobile ? 'px' : 'vh'}`);
    media.style.setProperty('--clip-r', `${start.r * k}px`);
    media.style.setProperty('--vid-scale', `${1.18 - 0.18 * p}`);
  };
  apply();
  window.addEventListener('resize', () => { measure(); apply(); });
  document.fonts && document.fonts.ready.then(() => { measure(); apply(); });   // headline size changes once fonts load

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

  ScrollTrigger.create({                       // nav turns dark over the full-bleed hero video
    trigger: '#hero',
    start: () => `top+=${window.innerHeight * 0.55} top`,
    end: 'bottom top+=56',
    toggleClass: { targets: nav, className: 'is-dark' },
  });
  } // end hero

  /* ---------- Manifesto: words light up as you scroll ---------- */
  // Split a block of text into one span per word (kept as a function so the language switch can re-split)
  const splitWords = (el) => {
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
    return words;
  };

  document.querySelectorAll('[data-words]').forEach((el) => {
    let words = splitWords(el);
    let progress = 0;
    const section = el.closest('section');
    const paint = (p) => {
      progress = p;
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
    // used by the language switch (js/i18n.js): swap the text, re-split, keep the current glow
    el.zmSetText = (html) => { el.innerHTML = html; words = splitWords(el); paint(progress); };
  });

  /* ---------- Sketch to system: full-screen sketches back to back, refined strip slides left on top ---------- */
  const sketch = document.getElementById('sketch');
  if (sketch) {
    const frames = gsap.utils.toArray('.sketch__img', sketch);
    const pics = frames.map((f) => f.querySelector('img'));
    const fade = sketch.querySelector('.sketch__fade');
    const track = sketch.querySelector('.sketch__track');
    const loopImg = track.querySelector('img');
    const n = frames.length;

    const stl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sketch, start: 'top top', end: 'bottom bottom',
        scrub: 0.8, invalidateOnRefresh: true,
      },
    });

    // Timeline (in scroll "units"):
    //   0    → 0.8   sketch 1 starts on its top part and moves to reveal the lower part (slight zoom)
    //   0.8  → 1.1   hold on the lower part of sketch 1
    //   1.1  → 1.4   sketch 2 dissolves in; the strip starts sliding in from the right
    //   1.1  → 2.5   sketch 2 zooms a little and drifts right
    //   2.2  → 2.5   sketch 3 dissolves in, then zooms and drifts until the end (3.6)
    const SWITCH = [1.1, 2.2];            // when sketch 2 and sketch 3 arrive
    const END = 3.6;
    const XFADE = 0.3;

    // First sketch starts on its top part (top edge just below the top bar), then moves to reveal
    // the lower part. The zoom grows from the bottom edge so the bottom is fully shown at the end.
    const navH = () => document.getElementById('nav')?.offsetHeight || 0;
    gsap.set(pics[0], { transformOrigin: '50% 100%' });
    stl.fromTo(pics[0], { scale: 1, y: navH, objectPosition: '50% 0%' },
                        { scale: 1.04, y: 0, objectPosition: '50% 100%', duration: 0.8, ease: 'power1.inOut' }, 0)
       .to({}, { duration: SWITCH[0] - 0.8 }, 0.8);      // hold on the lower part

    SWITCH.forEach((t, k) => {
      const i = k + 1;
      const until = (SWITCH[k + 1] ?? END - XFADE) + XFADE;
      stl.to(frames[i - 1], { opacity: 0, duration: XFADE, ease: 'power1.inOut' }, t)
         .fromTo(frames[i], { opacity: 0 }, { opacity: 1, duration: XFADE, ease: 'power1.inOut' }, t)
         .fromTo(pics[i], { scale: 1.02, xPercent: 0 }, { scale: 1.12, xPercent: 4, duration: until - t }, t);
    });

    // Refined solution: off-screen during the first sketch. As the second sketch appears it slides in
    // from the right edge and keeps sliding left until the end (two copies side by side, so it never runs out).
    const STRIP_IN = SWITCH[0];
    stl.fromTo(fade, { opacity: 0 }, { opacity: 1, duration: 0.35 }, STRIP_IN)
       .fromTo(track, { x: () => window.innerWidth },
                      { x: () => -loopImg.getBoundingClientRect().width * 0.85, duration: END - STRIP_IN }, STRIP_IN);
  }

  /* ---------- Molecule: scroll-driven. The section holds; scrolling plays the video forward (and back),
     then fades in iteration 3. You can't scroll past without going through both. ---------- */
  // Keeps a paused video on a given point (0 = first frame, 1 = last frame). Seeks only when the target
  // changes, and never stacks seeks faster than the browser can show them.
  const scrubber = (video) => {
    let wanted = 0, busy = false;
    video.pause();
    const go = () => {
      if (busy || Math.abs(video.currentTime - wanted) < 0.01) return;
      busy = true;
      video.currentTime = wanted;
    };
    video.addEventListener('seeked', () => { busy = false; go(); });
    return (p) => {
      const d = video.duration || +video.dataset.dur || 5;
      wanted = p * Math.max(0, d - 0.05);
      go();
    };
  };

  if (mol) {
    mol.classList.add('mol--scrub');
    const molFrame = mol.querySelector('.mol__frame--image');
    const setMol = scrubber(mol.querySelector('.mol__video'));

    const scrub = { p: 0 };
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: mol, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    })
      // 0 → 1: the video plays with the scroll, first frame to last
      .to(scrub, { p: 1, duration: 1, onUpdate: () => setMol(scrub.p) }, 0)
      // 1 → 1.35: iteration 3 fades in and settles
      .fromTo(molFrame, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.inOut' }, 1)
      .fromTo(molFrame.querySelector('img'), { scale: 1.03 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 1)
      // 1.35 → 1.6: hold on iteration 3 before the page moves on
      .to({}, { duration: 0.25 }, 1.35);
  }

  /* ---------- Wave: scroll-driven. Three columns (text with its own clip | clip 1 | clip 2). The section
     holds; the scroll plays all three clips together, first frame to last. You can't scroll past
     without going through them. ---------- */
  if (wave) {
    wave.classList.add('wave--scrub');
    const sets = [...wave.querySelectorAll('.wave__clip')].map(scrubber);
    const bar = wave.querySelector('.wave__progress i');
    const p = { v: 0 };
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: wave, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    })
      .to(p, { v: 1, duration: 1, onUpdate: () => { sets.forEach((set) => set(p.v)); bar.style.setProperty('--f', p.v.toFixed(3)); } })
      .to({}, { duration: 0.15 });   // short hold on the last frames before the page moves on
  }

  /* ---------- Scroll sequences (data-seq): the section holds; the scroll plays each clip in turn,
     dissolving into the next. You can't scroll past without going through all of them. ---------- */
  document.querySelectorAll('[data-seq]').forEach((sec) => {
    sec.classList.add('seq--scrub');
    const clips = [...sec.querySelectorAll('.seq__clip')];
    const bars = [...sec.querySelectorAll('.seq__bars i')];
    const durs = clips.map((v) => +v.dataset.dur || 5);
    const sets = clips.map(scrubber);
    const XF = 0.5;                                   // length of the dissolve between clips
    const starts = durs.map((d, i) => durs.slice(0, i).reduce((a, b) => a + b, 0));

    let current = -1;
    const stl = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: () => {
        const t = stl.time();
        let k = 0;
        starts.forEach((s, i) => { if (t >= s) k = i; });
        if (k !== current) {
          current = k;
          // load the next clip ahead of time
          if (clips[k + 1] && clips[k + 1].preload !== 'auto') { clips[k + 1].preload = 'auto'; clips[k + 1].load(); }
        }
      },
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });

    clips.forEach((v, i) => {
      const p = { v: 0 };
      stl.to(p, { v: 1, duration: durs[i], onUpdate: () => { sets[i](p.v); if (bars[i]) bars[i].style.setProperty('--f', p.v.toFixed(3)); } }, starts[i]);
      if (i > 0) stl.fromTo(v, { opacity: 0 }, { opacity: 1, duration: XF, ease: 'power1.inOut' }, starts[i]);
    });

    // Clip titles: the name of the clip that's playing shows under the main title and dissolves into
    // the next name when the clip changes (consecutive clips of the same space share one name)
    const clipName = sec.querySelector('.seq__clipname');
    if (clipName) {
      const groups = [];
      clips.forEach((v, i) => {
        const name = v.dataset.label || '';
        if (!groups.length || groups[groups.length - 1].name !== name) groups.push({ name, at: starts[i] });
      });
      clipName.replaceChildren(...groups.map((g) => Object.assign(document.createElement('span'), { textContent: g.name })));
      const spans = [...clipName.children];
      groups.forEach((g, k) => {
        if (k === 0) return;
        stl.fromTo(spans[k - 1], { opacity: 1 }, { opacity: 0, duration: XF, ease: 'power1.inOut', immediateRender: false }, g.at)
           .fromTo(spans[k], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: XF, ease: 'power2.out' }, g.at);
      });
    }

    // After the first clip the details fade out and fold away; only the titles stay
    const details = sec.querySelector('.seq__details');
    if (details && clips.length > 1) {
      stl.fromTo(details, { opacity: 1, height: () => details.scrollHeight },
                          { opacity: 0, height: 0, duration: XF * 1.4, ease: 'power2.inOut' }, starts[1]);
    }
    stl.to({}, { duration: 1 });   // short hold on the last clip before the page moves on
  });

  /* ---------- Film: pinned chapters wipe up over one another ---------- */
  const film = document.getElementById('film');
  if (film) {
    const panels = gsap.utils.toArray('.film__panel', film);
    const captions = gsap.utils.toArray('.film__caption', film);
    const bars = gsap.utils.toArray('.film__bars i', film);
    const count = film.querySelector('.film__count b');
    const filmSlotEls = panels.map((p) => p.querySelector('.slot'));
    const filmSlots = filmSlotEls.map(slotOf);
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
          if (!self.isActive) { filmSlots.forEach((s) => s.pause()); current = -1; }
          else updateFilm(ftl.time() / ftl.duration());
        },
      },
    });

    // Each chapter = 1 unit: hold, then the next panel wipes up from the bottom
    panels.forEach((panel, i) => {
      ftl.fromTo(filmSlotEls[i], { '--s': 1.12 }, { '--s': 1, duration: 1 }, i);   // slow push-in per chapter
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
      filmSlots.forEach((s, i) => {
        if (i === idx || i === idx - 1) s.play();         // on screen, or still being covered
        else {
          s.pause();
          if (i === idx + 1) s.warm();                    // get the next chapter ready
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
  // Fonts and images load late and change the page height; recalculate scroll positions when they do
  let refreshTimer = 0;
  const refreshSoon = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200); };
  window.addEventListener('load', refreshSoon);
  if (document.fonts) document.fonts.ready.then(refreshSoon);
  let lastHeight = document.body.scrollHeight;
  new ResizeObserver(() => {
    const h = document.body.scrollHeight;
    if (Math.abs(h - lastHeight) > 2) { lastHeight = h; refreshSoon(); }
  }).observe(document.body);
})();
