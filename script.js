/* ==================================================================
   FRIENDSHIP DAY — SCRIPT (fixed)
   Vanilla JS only. Organised by section. Search for "SECTION N" to
   jump to the logic that powers each part of the page.
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     LOADING SCREEN
     FIX: the CSS hides #loadingScreen via the ".is-hidden" class —
     the old code was adding ".hidden", which doesn't exist in the
     stylesheet, so the overlay never went away and blocked the page.
     ================================================================ */
  const loadingScreen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => loadingScreen.classList.add('is-hidden'), 500);
  });
  // Fallback in case 'load' already fired or assets are slow
  setTimeout(() => loadingScreen.classList.add('is-hidden'), 2500);

  /* ================================================================
     REUSABLE: photo tile builder
     Every tile points at a real photo file in an "images" folder next
     to index.html. Which file shows where is controlled entirely by
     the timelinePhotos / galleryPhotos arrays further down — just
     edit those arrays, no need to touch this function.
     Drop your photos into images/ using the filenames listed in those
     arrays; any filename that isn't there yet keeps showing the soft
     placeholder tile instead of a broken image.
     ================================================================ */
  const TILE_PAIRS = [
    ['#E8DDD0', '#C7B299'],
    ['#F6F1EB', '#C7B299'],
    ['#C7B299', '#5A4B3C'],
    ['#E8DDD0', '#5A4B3C'],
    ['#F6F1EB', '#E8DDD0'],
  ];
  const LEAF_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4C11 4 4 11 4 20C13 20 20 13 20 4Z" stroke="white" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M20 4L8 16" stroke="white" stroke-width="1.1" stroke-linecap="round"/>
  </svg>`;

  // photoFile is a filename inside images/, e.g. "first_meet.jpg".
  // If omitted, falls back to a placeholder tile only.
  function makeTile(index, photoFile) {
    const [a, b] = TILE_PAIRS[index % TILE_PAIRS.length];
    const el = document.createElement('div');
    el.className = 'ph-tile';
    el.style.setProperty('--tile-a', a);
    el.style.setProperty('--tile-b', b);

    function showPlaceholder() {
      el.innerHTML = LEAF_ICON;
    }

    if (photoFile) {
      const img = document.createElement('img');
      img.src = `images/${photoFile}`;
      img.alt = '';
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;';
      img.addEventListener('error', () => {
        // this file hasn't been added to images/ yet — show the placeholder instead
        img.remove();
        showPlaceholder();
      }, { once: true });
      el.appendChild(img);
    } else {
      showPlaceholder();
    }
    return el;
  }

  /* ================================================================
     SECTION 1 — PARTICLES (hero canvas)
     ================================================================ */
  (function particles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particlesArr;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    function makeParticles() {
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particlesArr = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        o: Math.random() * 0.4 + 0.15,
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#5A4B3C';
      particlesArr.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    resize(); makeParticles(); tick();
    window.addEventListener('resize', () => { resize(); makeParticles(); });
  })();

  /* ================================================================
     CURSOR GLOW
     ================================================================ */
  (function cursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    if (window.matchMedia('(hover: none)').matches) return;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
  })();

  /* ================================================================
     AMBIENT LAYER — floating leaves, fireflies, occasional butterflies
     ================================================================ */
  (function ambient() {
    const layer = document.getElementById('ambientLayer');
    if (!layer) return;

    function spawnLeaf() {
      const el = document.createElement('div');
      el.className = 'ambient-item leaf';
      const size = 10 + Math.random() * 10;
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-20px';
      el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#C7B299"><path d="M20 4C11 4 4 11 4 20C13 20 20 13 20 4Z"/></svg>`;
      layer.appendChild(el);
      const duration = 9000 + Math.random() * 6000;
      const drift = (Math.random() - 0.5) * 160;
      el.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
        { transform: `translate(${drift * 0.3}px, 40vh) rotate(120deg)`, opacity: .8, offset: .15 },
        { transform: `translate(${drift}px, 105vh) rotate(320deg)`, opacity: 0 },
      ], { duration, easing: 'ease-in' });
      setTimeout(() => el.remove(), duration);
    }

    function spawnFirefly() {
      const el = document.createElement('div');
      el.className = 'ambient-item firefly';
      const x = Math.random() * 100, y = 60 + Math.random() * 40;
      el.style.left = x + 'vw'; el.style.top = y + 'vh';
      layer.appendChild(el);
      const duration = 6000 + Math.random() * 4000;
      el.animate([
        { transform: 'translate(0,0)', opacity: 0 },
        { transform: `translate(${(Math.random()-0.5)*80}px, ${(Math.random()-0.5)*80}px)`, opacity: 1, offset: .5 },
        { transform: `translate(${(Math.random()-0.5)*120}px, ${(Math.random()-0.5)*120}px)`, opacity: 0 },
      ], { duration, easing: 'ease-in-out' });
      setTimeout(() => el.remove(), duration);
    }

    function spawnButterfly() {
      const el = document.createElement('div');
      el.className = 'ambient-item butterfly';
      el.style.left = '-30px';
      el.style.top = (20 + Math.random() * 50) + 'vh';
      el.innerHTML = `<svg width="20" height="16" viewBox="0 0 20 16"><path d="M10 8C10 8 6 0 2 2C-1 3.5 2 9 10 8Z" fill="#5A4B3C" opacity=".75"/><path d="M10 8C10 8 14 0 18 2C21 3.5 18 9 10 8Z" fill="#5A4B3C" opacity=".75"/></svg>`;
      layer.appendChild(el);
      const duration = 8000 + Math.random() * 3000;
      el.animate([
        { transform: 'translate(0,0)', offset: 0 },
        { transform: `translate(30vw, -30px)`, offset: .3 },
        { transform: `translate(65vw, 20px)`, offset: .6 },
        { transform: `translate(115vw, -10px)`, offset: 1 },
      ], { duration, easing: 'ease-in-out' });
      setTimeout(() => el.remove(), duration);
    }

    setInterval(spawnLeaf, 2200);
    setInterval(spawnFirefly, 1400);
    setInterval(spawnButterfly, 9000);
    spawnLeaf(); spawnFirefly();
  })();

  /* ================================================================
     BEGIN BUTTON + SCROLL NAV
     ================================================================ */
  const beginBtn = document.getElementById('beginBtn');
  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const navButtons = Array.from(document.querySelectorAll('.scroll-nav button'));
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navButtons.forEach(b => b.classList.toggle('active', b.dataset.target === entry.target.id));
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section').forEach(s => navObserver.observe(s));

  /* ================================================================
     GENERIC SCROLL-REVEAL
     NOTE: the CSS toggles visibility using the ".in-view" class,
     so that's the class this observer must add.
     ================================================================ */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  function observeReveal(el) { revealObserver.observe(el); }
  document.querySelectorAll('.reveal').forEach(observeReveal);

  /* ================================================================
     SECTION 2 — OUR STORY (timeline)
     Timeline photo mapping — change these filenames whenever you want.
     Each entry is the photo shown for the matching card in storyData
     below, in order.
     ================================================================ */
  const timelinePhotos = [
    '1.jpg',
    '2.jpg',
    '5.jpg',
    '7.jpg',
    '11.jpg',
    '3.jpg',
    '6.jpg',
  ];

  const storyData = [
    {
      date: "2022",
      title: "The First Photo Together",
      text: "A random picture during college that quietly became the first page of one of the most important friendships in my life. Neither of us knew how much this friendship would grow.",
      sticker: "📸"
    },
    {
      date: "College Days",
      title: "Our First Class Bunk",
      text: "Skipping one lecture somehow gave us memories that lasted far longer than any class ever could. Looking back, I'd still make the same choice.",
      sticker: "🎒"
    },
    {
      date: "College Days",
      title: "Coffee Became Our Thing",
      text: "Some of our deepest conversations started with 'Let's grab a coffee.' Somehow every cup came with stories, laughter, life updates, and endless discussions.",
      sticker: "☕"
    },
    {
      date: "Before Bengaluru",
      title: "One Last Meet Before I Left",
      text: "Before I moved to Bengaluru, we met one last time. It didn't feel like goodbye—just a promise that distance wouldn't change what we'd built.",
      sticker: "🚆"
    },
    {
      date: "Bengaluru",
      title: "Meeting Again",
      text: "A completely different city, different jobs, different routines—but somehow it still felt like college again the moment we met.",
      sticker: "🏙️"
    },
    {
      date: "Bengaluru Days",
      title: "Exploring a New City Together",
      text: "From random cafés to long walks and unplanned adventures, Bengaluru slowly became another place filled with memories because you were there.",
      sticker: "🌇"
    },
    {
      date: "Birthdays",
      title: "Celebrating Every Year",
      text: "Whether it was my birthday or yours, the celebrations were never about the cake. They were about making time for each other, no matter how busy life became.",
      sticker: "🎂"
    },
  ];
  const timelineEl = document.getElementById('timeline');
  storyData.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    const thumb = document.createElement('div');
    thumb.className = 'timeline-thumb';
    thumb.appendChild(makeTile(i, timelinePhotos[i]));
    const card = document.createElement('div');
    card.className = 'timeline-card';
    // FIX: storyData items store the paragraph in `text`, not `desc`.
    card.innerHTML = `
      <p class="timeline-date">${item.date}</p>
      <h3 class="timeline-title">${item.title}</h3>
      <p class="timeline-desc">${item.text}</p>`;
    card.prepend(thumb);
    el.appendChild(card);
    timelineEl.appendChild(el);
    observeReveal(el);
  });

  /* ================================================================
     SECTION 3 — MEMORY GALLERY + LIGHTBOX
     Gallery photo mapping — each entry lines up with the caption at
     the same position in galleryCaptions below. Edit filenames here
     to change which photo shows for which caption.
     ================================================================ */
  const galleryPhotos = [
    '0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg',
    '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg',
    '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg'
  ];

  const galleryCaptions = [
    "our very first picture 📸",
    "the legendary class bunk 🎒",
    "birthday memories 🎂",
    "your birthday smile 🎉",
    "coffee therapy ☕",
    "the day you came home 🏡",
    "before I left for Bengaluru 🚆",
    "meeting again in Kolkata 🌆",
    "our first Bengaluru meetup 🏙️",
    "city adventures 🌇",
    "celebrating you 🎈",
    "random plans that became memories 💛",
    "Ujo day 🍜",
    "another birthday together 🎂"
  ];
  const masonryEl = document.getElementById('masonry');
  const heights = ['4/5', '1/1', '3/4', '5/4', '4/3'];
  galleryCaptions.forEach((cap, i) => {
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.style.aspectRatio = heights[i % heights.length];
    const tile = makeTile(i, galleryPhotos[i]);
    item.appendChild(tile);
    const caption = document.createElement('p');
    caption.className = 'masonry-caption';
    caption.textContent = cap;
    item.appendChild(caption);
    item.addEventListener('click', () => openLightbox(i));
    masonryEl.appendChild(item);
    observeReveal(item);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let lightboxIndex = 0;

  function openLightbox(i) {
    lightboxIndex = i;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function renderLightbox() {
    lightboxImage.innerHTML = '';
    lightboxImage.appendChild(makeTile(lightboxIndex, galleryPhotos[lightboxIndex]));
    lightboxCaption.textContent = galleryCaptions[lightboxIndex];
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % galleryCaptions.length; renderLightbox();
  });
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + galleryCaptions.length) % galleryCaptions.length; renderLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
  });

  /* ================================================================
     SECTION 4 — THINGS I LIKE ABOUT YOU
     ================================================================ */
  const qualities = [
    { icon: "😊", title: "Your Smile", text: "It somehow makes every difficult day feel a little lighter." },
    { icon: "💛", title: "Your Kind Heart", text: "You care deeply about people, even when you pretend you don't." },
    { icon: "☕", title: "The Way You Listen", text: "You never try to fix everything. Sometimes you simply stay, and that's enough." },
    { icon: "🌻", title: "Your Strength", text: "You've handled more than most people know, yet you still choose kindness." },
    { icon: "😂", title: "Your Laugh", text: "It's impossible not to laugh along when you're laughing." },
    { icon: "🎭", title: "Your Chaotic Energy", text: "Every ordinary plan somehow becomes an adventure around you." },
    { icon: "🧠", title: "Your Perspective", text: "You have a way of making complicated things suddenly make sense." },
    { icon: "🪨", title: "Your Loyalty", text: "You've always shown up for the people who matter to you." },
    { icon: "🤍", title: "Your Support", text: "Through heartbreaks, doubts, and difficult days—you've always been there." },
    { icon: "✨", title: "Being You", text: "Honestly... I think my favourite thing about you is simply that you're you." }
  ];
  const qualitiesGrid = document.getElementById('qualitiesGrid');
  qualities.forEach(q => {
    const card = document.createElement('div');
    card.className = 'quality-card';
    // FIX: qualities items store the paragraph in `text`, not `desc`.
    card.innerHTML = `
      <span class="quality-icon">${q.icon}</span>
      <h3 class="quality-title">${q.title}</h3>
      <p class="quality-desc">${q.text}</p>`;
    qualitiesGrid.appendChild(card);
    observeReveal(card);
  });

  /* ================================================================
     SECTION 5 — A LETTER (typing animation on reveal)
     ================================================================ */
  const letterText = `Happy Friendship Day.

It's funny how some of the most important people in our lives don't arrive with some dramatic moment. Sometimes they simply become part of your everyday life until one day you realise you can't imagine your story without them.

College gave me a degree, memories, and many people. But one of the best things it gave me was you.

We've celebrated birthdays, bunked classes, spent countless evenings over coffee, and somehow managed to turn ordinary days into memories worth keeping.

Life changed. We graduated. We moved to different places. We started our careers. We went through heartbreaks, questioned ourselves, and had days when things didn't make sense.

Yet somehow, through all of it, we kept showing up for each other.

I don't think friendship is measured by how often we meet or text. I think it's measured by knowing that whenever life becomes overwhelming, there's someone who'll always pick up where the last conversation ended.

Thank you for every conversation, every laugh, every coffee, every birthday, every random plan, and every moment you reminded me that I was never alone.

I genuinely hope life gives us many more cities to explore, birthdays to celebrate, coffees to share, and stories to laugh about years from now.

No matter where life takes us next, I'll always be grateful that one random day in college introduced me to one of my favourite people.

Happy Friendship Day. 🤍`;

  const letterSection = document.getElementById('letter');
  const letterBody = document.getElementById('letterBody');
  let letterTyped = false;

  function typeLetter() {
    if (letterTyped) return;
    letterTyped = true;
    const caret = document.createElement('span');
    caret.className = 'cursor-caret';
    let i = 0;
    const speed = 14; // ms per character — quick but readable
    function step() {
      if (i <= letterText.length) {
        letterBody.textContent = letterText.slice(0, i);
        letterBody.appendChild(caret);
        i += 2;
        requestAnimationFrame(() => setTimeout(step, speed));
      } else {
        caret.remove();
      }
    }
    step();
  }
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { typeLetter(); obs.disconnect(); }
    });
  }, { threshold: 0.3 }).observe(letterSection);

  /* ================================================================
     SECTION 6 — LITTLE THINGS
     ================================================================ */
  const littleThings = [
    { label: "What reminds me of you?", body: "Coffee shops, random selfies, rainy evenings, birthday cakes, Bengaluru streets, and every place where good conversations happen." },
    { label: "My favourite memory", body: "Honestly? I don't think it's just one. It's every ordinary day that quietly became unforgettable because you were there." },
    { label: "Something I'll never forget", body: "How we stood by each other through heartbreaks and difficult phases without ever needing to ask for help." },
    { label: "The funniest moment", body: "You already know which one. Some stories are too legendary to ever write down." },
    { label: "The best thing about our friendship", body: "No matter how much time passes, every conversation feels like we paused it yesterday." },
    { label: "One promise", body: "No matter where life takes us next, let's never stop making new memories together." }
  ];
  const littleGrid = document.getElementById('littleThingsGrid');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalText = document.getElementById('modalText');

  littleThings.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'little-thing-btn';
    btn.innerHTML = `<span>${item.label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.addEventListener('click', () => {
      modalEyebrow.textContent = item.label;
      // FIX: littleThings items store the paragraph in `body`, not `text`.
      modalText.textContent = item.body;
      modalOverlay.classList.add('open');
    });
    littleGrid.appendChild(btn);
  });
  document.getElementById('modalClose').addEventListener('click', () => modalOverlay.classList.remove('open'));
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('open'); });

  /* ================================================================
     SECTION 7 — NATURE PARALLAX
     ================================================================ */
  const natureBg = document.getElementById('natureBg');
  const natureSection = document.getElementById('nature');
  window.addEventListener('scroll', () => {
    const rect = natureSection.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom > 0 && rect.top < vh) {
      const progress = (vh - rect.top) / (vh + rect.height); // 0 -> 1
      natureBg.style.transform = `translateY(${(progress - 0.5) * 60}px) scale(1.08)`;
    }
  }, { passive: true });

  /* ================================================================
     SECTION 9 — PICK OUR NEXT ADVENTURE
     ================================================================ */
  const advActivity = document.getElementById('advActivity');
  const customRow = document.getElementById('customActivityRow');
  advActivity.addEventListener('change', () => {
    customRow.hidden = advActivity.value !== 'Custom';
  });

  const adventureForm = document.getElementById('adventureForm');
  const formStatus = document.getElementById('formStatus');
  const adventureLog = document.getElementById('adventureLog');
  const adventureLogList = document.getElementById('adventureLogList');
  const STORAGE_KEY = 'friendshipDay.adventures';

  // NOTE: this uses localStorage, which is per-browser/per-device only.
  // Plans saved by someone else on their own device will never show up
  // here — see the note at the end of this file for how to make this
  // (and the message wall below) actually shared between visitors.
  function loadAdventures() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveAdventures(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  function renderAdventureLog() {
    const list = loadAdventures();
    adventureLog.hidden = list.length === 0;
    adventureLogList.innerHTML = '';
    list.forEach((plan, i) => {
      const row = document.createElement('div');
      row.className = 'adventure-log-item';
      row.innerHTML = `
        <span><strong>${plan.activity}</strong> \u2014 ${plan.date} at ${plan.time}${plan.location ? ' \u00b7 ' + plan.location : ''}</span>
        <button class="log-remove" aria-label="Remove">&times;</button>`;
      row.querySelector('.log-remove').addEventListener('click', () => {
        const updated = loadAdventures();
        updated.splice(i, 1);
        saveAdventures(updated);
        renderAdventureLog();
      });
      adventureLogList.appendChild(row);
    });
  }
  renderAdventureLog();

  adventureForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adventureForm).entries());
    const activity = data.activity === 'Custom' ? (data.customActivity || 'Custom plan') : data.activity;

    const payload = {
      name: data.name,
      activity,
      date: data.date,
      time: data.time,
      location: data.location || '',
      notes: data.notes || '',
      submittedAt: new Date().toISOString(),
    };

    const list = loadAdventures();
    list.unshift(payload);
    saveAdventures(list);
    renderAdventureLog();

    console.log('Adventure payload ready for API:', payload);

    formStatus.textContent = `Saved. ${payload.activity} on ${payload.date} at ${payload.time} \u2014 looking forward to it.`;
    adventureForm.reset();
    customRow.hidden = true;
    setTimeout(() => { formStatus.textContent = ''; }, 6000);
  });

  /* ================================================================
     SECTION 10 — MESSAGE WALL
     Same localStorage caveat as the adventure planner above.
     ================================================================ */
  const wallForm = document.getElementById('wallForm');
  const stickyWall = document.getElementById('stickyWall');
  const WALL_KEY = 'friendshipDay.wallMessages';

  function loadWall() {
    try { return JSON.parse(localStorage.getItem(WALL_KEY)) || []; }
    catch { return []; }
  }
  function saveWall(list) { localStorage.setItem(WALL_KEY, JSON.stringify(list)); }

  function renderWall() {
    const list = loadWall();
    stickyWall.innerHTML = '';
    if (list.length === 0) {
      stickyWall.innerHTML = '<p class="wall-empty">No notes yet. Be the first to leave one.</p>';
      return;
    }
    list.forEach(note => {
      const el = document.createElement('div');
      el.className = 'sticky-note';
      el.style.setProperty('--r', (Math.random() * 5 - 2.5) + 'deg');
      el.innerHTML = `
        <span class="note-emoji">${note.emoji}</span>
        <p class="note-msg">${note.message}</p>
        <p class="note-name">\u2014 ${note.name}</p>`;
      stickyWall.appendChild(el);
    });
  }
  renderWall();

  wallForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(wallForm).entries());
    const note = {
      name: escapeHTML(data.wallName),
      message: escapeHTML(data.wallMessage),
      emoji: data.wallEmoji,
    };
    const list = loadWall();
    list.unshift(note);
    saveWall(list);
    renderWall();
    wallForm.reset();
  });

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ================================================================
     SECTION 11 — MUSIC PLAYER
     ================================================================ */
  const musicPlayer = document.getElementById('musicPlayer');
  const musicToggle = document.getElementById('musicToggle');
  const musicAudio = document.getElementById('musicAudio');
  const musicVolume = document.getElementById('musicVolume');
  const iconPlay = document.getElementById('musicIconPlay');
  const iconPause = document.getElementById('musicIconPause');

  musicAudio.volume = musicVolume.value / 100;
  musicVolume.addEventListener('input', () => { musicAudio.volume = musicVolume.value / 100; });

  musicToggle.addEventListener('click', () => {
    if (musicAudio.paused) {
      musicAudio.play().catch(() => {
        // No audio source has been provided yet — drop an mp3 at
        // audio/friend.mp3 to enable playback.
        formStatusFallback();
      });
      musicPlayer.classList.add('playing');
      iconPlay.style.display = 'none';
      iconPause.style.display = 'inline';
    } else {
      musicAudio.pause();
      musicPlayer.classList.remove('playing');
      iconPlay.style.display = 'inline';
      iconPause.style.display = 'none';
    }
  });
  function formStatusFallback() {
    musicPlayer.classList.remove('playing');
    iconPlay.style.display = 'inline';
    iconPause.style.display = 'none';
  }

  /* ================================================================
     SECTION 12 — ENDING STARS
     ================================================================ */
  const endingStars = document.getElementById('endingStars');
  for (let i = 0; i < 90; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 3) + 's';
    endingStars.appendChild(star);
  }

});

/* ================================================================
   A NOTE ON THE MESSAGE WALL & ADVENTURE PLANNER
   Both features currently save to localStorage, which lives only in
   the browser of whoever filled out the form. That means a note or
   plan someone else adds on their own phone/laptop will never show up
   for you, and vice versa — there's no shared backend yet. To make
   these truly shared, swap loadWall/saveWall and
   loadAdventures/saveAdventures for calls to a small shared datastore
   (Firebase, Supabase, a Google Sheet via Apps Script, or an email via
   EmailJS) instead of localStorage.
   ================================================================ */