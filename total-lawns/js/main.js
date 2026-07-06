(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shrink ---------- */
  const header = document.getElementById("siteHeader");
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle("scrolled", window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll-reveal via IntersectionObserver ---------- */
  const revealTargets = document.querySelectorAll(".reveal-up, .reveal-word");
  if (revealTargets.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("in-view"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealTargets.forEach((el) => io.observe(el));
    }
  }

  /* Stagger the hero words a touch so they don't all land together */
  document.querySelectorAll(".hero-title .reveal-word").forEach((el, i) => {
    el.style.transitionDelay = `${i * 90}ms`;
  });

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll(".stat-num[data-count]");
  if (statNums.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (prefersReducedMotion || !target) {
        el.textContent = target;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const statIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      statNums.forEach((el) => statIo.observe(el));
    } else {
      statNums.forEach(animateCount);
    }
  }

  /* ---------- Accordion ---------- */
  const accordion = document.getElementById("accordion");
  if (accordion) {
    accordion.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        accordion.querySelectorAll(".accordion-trigger").forEach((t) => {
          t.setAttribute("aria-expanded", "false");
        });
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ---------- Contact form (front-end only, no backend) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const submitBtn = contactForm.querySelector(".btn-submit");
    const successMsg = contactForm.querySelector(".form-success");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
      window.setTimeout(() => {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        successMsg.classList.add("show");
        contactForm.reset();
      }, 900);
    });
  }

  /* ---------- Hero grass blades (procedural SVG, drawn once) ---------- */
  const bladeGroup = document.getElementById("bladeGroup");
  if (bladeGroup) {
    const width = 1440;
    const bladeCount = 60;
    let svg = "";
    for (let i = 0; i < bladeCount; i++) {
      const x = (i / bladeCount) * width + (Math.random() * 14 - 7);
      const h = 90 + Math.random() * 140;
      const lean = Math.random() * 24 - 12;
      const w = 6 + Math.random() * 6;
      svg += `<path d="M${x} 300 Q${x + lean} ${300 - h * 0.6} ${x + lean * 1.6} ${300 - h}" stroke-width="${w}" stroke="url(#bladeGrad)" fill="none" stroke-linecap="round"/>`;
    }
    bladeGroup.innerHTML = svg;
  }

  /* ---------- Set current year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Subtle card tilt on non-touch pointers ---------- */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".plan-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${py * -5}deg) rotateY(${px * 5}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
})();
