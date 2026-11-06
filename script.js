(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Loader
  window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('hide'), 700));

  // Year
  $('#year').textContent = new Date().getFullYear();

  // Theme toggle (remembered)
  const root = document.documentElement, tBtn = $('#themeToggle');
  const setTheme = t => {
    root.setAttribute('data-theme', t);
    tBtn.innerHTML = t === 'light' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  let saved = 'dark'; try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
  setTheme(saved);
  tBtn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));

  // Typing effect
  const words = ['Aspiring Software Developer', 'Java & Python Learner', 'Web Developer', 'Problem Solver', 'Cyber-Safety Researcher'];
  const el = $('#typing'); let w = 0, c = 0, del = false;
  (function type() {
    const word = words[w];
    el.textContent = word.slice(0, del ? --c : ++c);
    let delay = del ? 45 : 90;
    if (!del && c === word.length) { del = true; delay = 1500; }
    else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 400; }
    setTimeout(type, delay);
  })();

  // Navbar, progress, back-to-top, active link
  const nav = $('#mainNav'), bar = $('#scroll-progress'), top = $('#toTop');
  const links = $$('.nav-link'), sections = links.map(l => $(l.getAttribute('href')));
  const onScroll = () => {
    const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (y / h * 100) + '%';
    nav.classList.toggle('scrolled', y > 50);
    top.classList.toggle('show', y > 500);
    let idx = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop - 140 <= y) idx = i; });
    links.forEach((l, i) => l.classList.toggle('active', i === idx));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Close mobile menu on link click
  $$('#navMenu .nav-link').forEach(l => l.addEventListener('click', () => {
    const m = bootstrap.Collapse.getInstance($('#navMenu')); if (m) m.hide();
  }));

  // Scroll reveal + counters + skill bars
  const countUp = n => {
    const target = +n.dataset.target; let v = 0;
    const step = () => { v += Math.max(1, target / 40); if (v >= target) n.textContent = target + '+'; else { n.textContent = Math.floor(v); requestAnimationFrame(step); } };
    step();
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target; t.classList.add('in');
    $$('.fill', t).forEach(f => f.style.width = f.dataset.w + '%');
    $$('.counter', t).forEach(countUp);
    io.unobserve(t);
  }), { threshold: .15 });
  $$('[data-aos]').forEach((n, i) => { n.style.transitionDelay = (n.dataset.aosDelay || 0) + 'ms'; io.observe(n); });

  // 3D tilt on project cards
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Contact form -> opens email client
  const form = $('#contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    const n = $('#cName').value, em = $('#cEmail').value, s = $('#cSubject').value, m = $('#cMsg').value;
    location.href = `mailto:gaurijadhav2908@gmail.com?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(m + '\n\n— ' + n + ' (' + em + ')')}`;
    form.reset(); form.classList.remove('was-validated');
  });

  // Particle network background
  const cv = $('#particles'), ctx = cv.getContext('2d'); let P = [], mouse = { x: null, y: null };
  const resize = () => {
    cv.width = innerWidth; cv.height = innerHeight;
    P = Array.from({ length: Math.min(80, Math.floor(innerWidth / 18)) }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 2 + 1
    }));
  };
  resize(); addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  (function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    const light = root.getAttribute('data-theme') === 'light';
    const col = light ? '110,80,220' : '170,140,255';
    P.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > cv.width) p.vx *= -1;
      if (p.y < 0 || p.y > cv.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = `rgba(${col},.6)`; ctx.fill();
      for (let j = i + 1; j < P.length; j++) {
        const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) { ctx.strokeStyle = `rgba(${col},${.18 * (1 - d / 120)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      if (mouse.x !== null) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 150) { ctx.strokeStyle = `rgba(236,72,153,${.35 * (1 - d / 150)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
    });
    requestAnimationFrame(draw);
  })();
})();
