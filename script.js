/* =========================================================
   JAGANNATH N — PORTFOLIO
   Vanilla JS — reusable, commented, no dependencies
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- Utility ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  document.documentElement.classList.toggle("no-motion", prefersReducedMotion);

  /* =========================================================
     1. LOADER
     ========================================================= */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    setTimeout(() => loader && loader.classList.add("done"), 900);
  });

  /* =========================================================
     2. THEME TOGGLE (persists in-memory only, per session)
     ========================================================= */
  const themeToggle = $("#themeToggle");
  let currentTheme = "dark";
  themeToggle && themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
  });

  /* =========================================================
     3. MOBILE MENU
     ========================================================= */
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  menuToggle && menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  $$(".mobile-menu a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("open");
  }));

  /* =========================================================
     4. NAV SCROLL STATE + SCROLL PROGRESS + SCROLLSPY + BACK TO TOP
     ========================================================= */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const backToTop = $("#backToTop");
  const spyLinks = $$("[data-spy]");
  const sections = spyLinks.map(l => document.querySelector(l.getAttribute("href"))).filter(Boolean);

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + "%";

    nav.classList.toggle("scrolled", scrollTop > 40);
    backToTop.style.opacity = scrollTop > 500 ? "1" : "0";

    // scrollspy
    let activeIdx = -1;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom > 140) activeIdx = i;
    });
    spyLinks.forEach((l, i) => l.classList.toggle("active", i === activeIdx));
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop && backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* =========================================================
     5. SCROLL REVEAL (IntersectionObserver)
     ========================================================= */
  const revealItems = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("in"));
  }

  /* =========================================================
     6. ANIMATED COUNTERS
     ========================================================= */
  const counters = $$(".stat-num");
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    const statsBlock = $("#heroStats");
    statsBlock && statsObserver.observe(statsBlock);
  }

  /* =========================================================
     7. ANIMATED SKILL BARS
     ========================================================= */
  const bars = $$(".bar-fill");
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.getAttribute("data-pct") + "%";
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(b => barObserver.observe(b));
  }

  /* =========================================================
     8. TYPING ANIMATION — rotating roles
     ========================================================= */
  const roles = [
    "ERP Functional Consultant",
    "Business Operations Analyst",
    "Data Analyst",
    "Cloud & Identity Support",
    "IT Systems Administrator",
    "Digital Transformation Enthusiast"
  ];
  const typedEl = $("#typedRole");
  if (typedEl && !prefersReducedMotion) {
    let roleIdx = 0, charIdx = 0, deleting = false;
    function typeTick() {
      const full = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        typedEl.textContent = full.slice(0, charIdx);
        if (charIdx === full.length) { deleting = true; setTimeout(typeTick, 1700); return; }
      } else {
        charIdx--;
        typedEl.textContent = full.slice(0, charIdx);
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
      }
      setTimeout(typeTick, deleting ? 32 : 55);
    }
    setTimeout(typeTick, 1400);
  }

  /* =========================================================
     9. CUSTOM CURSOR
     ========================================================= */
  if (!isTouch) {
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + "px"; dot.style.top = mouseY + "px";
    });
    function ringLoop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + "px"; ring.style.top = ringY + "px";
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    $$("a, button, [data-tilt]").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });
  }

  /* =========================================================
     10. MAGNETIC BUTTONS
     ========================================================= */
  if (!isTouch && !prefersReducedMotion) {
    $$(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* =========================================================
     11. CARD TILT
     ========================================================= */
  if (!isTouch && !prefersReducedMotion) {
    $$("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* =========================================================
     12. MOUSE PARALLAX ON HERO VISUAL
     ========================================================= */
  const heroVisual = $(".hero-visual");
  if (heroVisual && !isTouch && !prefersReducedMotion) {
    document.querySelector(".hero").addEventListener("mousemove", (e) => {
      const r = document.querySelector(".hero").getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroVisual.style.transform = `translate(${px * 14}px, ${py * 14}px)`;
    });
  }

  /* =========================================================
     13. EXPERIENCE TIMELINE — EXPANDABLE CARDS
     ========================================================= */
  $$(".ti-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".timeline-item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.querySelector("span").textContent = open ? "\u2212" : "+";
      btn.firstChild.textContent = open ? "Hide responsibilities " : "View responsibilities ";
    });
  });

  /* =========================================================
     14. CONTACT FORM VALIDATION + TOAST (no backend — front-end only)
     ========================================================= */
  const form = $("#contactForm");
  const toast = $("#toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
  }
  function setError(field, msg) {
    const row = form.querySelector(`#${field}`).closest(".form-row");
    row.classList.toggle("invalid", !!msg);
    row.querySelector(`[data-error="${field}"]`).textContent = msg || "";
  }
  form && form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name", form).value.trim();
    const email = $("#email", form).value.trim();
    const subject = $("#subject", form).value.trim();
    const message = $("#message", form).value.trim();
    let valid = true;

    if (name.length < 2) { setError("name", "Please enter your name."); valid = false; } else setError("name", "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Please enter a valid email."); valid = false; } else setError("email", "");
    if (subject.length < 3) { setError("subject", "Please add a short subject."); valid = false; } else setError("subject", "");
    if (message.length < 10) { setError("message", "Message should be at least 10 characters."); valid = false; } else setError("message", "");

    if (!valid) return;

    showToast("Message ready — opening your email client…");
    const mailto = `mailto:jagannath.infosec@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + "\n\n— " + name + " (" + email + ")")}`;
    setTimeout(() => { window.location.href = mailto; }, 900);
    form.reset();
  });

  /* =========================================================
     15. AMBIENT PARTICLE FIELD (canvas)
     ========================================================= */
  const canvas = $("#fieldCanvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4
      }));
    }
    window.addEventListener("resize", resize);
    resize();

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(139,147,171,0.35)";
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      // connective lines for nearby particles
      ctx.strokeStyle = "rgba(91,141,239,0.08)";
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* =========================================================
     16. FOOTER YEAR
     ========================================================= */
  const yearEl = $("#year");
  yearEl && (yearEl.textContent = new Date().getFullYear());

})();
