/* ==========================================================
   StanUGC — site content + logic
   ----------------------------------------------------------
   TO EDIT CONTENT, change the data below.
   A YouTube "id" is the part of a link after /shorts/ or ?v=
   e.g. youtube.com/shorts/L7Yf1K_uYgg  ->  "L7Yf1K_uYgg"
   ========================================================== */

/* 1. INTRO VIDEO — the one where you talk to camera in the car */
const INTRO_ID = "L7Yf1K_uYgg";

/* 2. PLACES I'VE VISITED — recent travel/adventure clips */
const PLACES_VIDEOS = [
  { id: "XCZQV0GAcYA", caption: "Dolomites 📍" },
  { id: "b8mQyc4_dpg", caption: "Peak District 📍" },
  { id: "t3rXxNBLimA", caption: "Brecon Beacons 📍" },
  { id: "gU-g5Y__er8", caption: "North Wales 📍" },
];

/* 3. BRAND & PRODUCT WORK — the product-focused clips */
const WORK_VIDEOS = [
  { id: "20VkxN206jU", caption: "" },
  { id: "WBum-Vdbyyc", caption: "" },
  { id: "Uf8nhhJL2DM", caption: "" },
  { id: "EEwIqnhPjhM", caption: "" },
  { id: "la-4Up1MsY4", caption: "" },
];

/* 4. PHOTOS — files live in images/. Caption shows on hover. */
const PHOTOS = [
  { src: "images/summit-trig.jpeg",        caption: "Snowdon summit" },
  { src: "images/camping-lake.jpeg",       caption: "Wildcamping in Peak District" },
  { src: "images/sphinx-egypt.jpeg",       caption: "The Sphinx" },
  { src: "images/campsite-mountains.jpeg", caption: "Camping in Dolomites" },
];

/* ---------------------------------------------------------- */

/* Clean "lite" facade: a poster thumbnail + play button, no YouTube chrome
   at rest. The real player only loads on click (faster page, no uploader
   name/title showing while scrolling). */
const facade = (id, title) => `
  <button class="video-frame lite" data-id="${id}" type="button" aria-label="Play ${title}">
    <img class="poster" src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg"
      onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg'"
      alt="${title}" loading="lazy" />
    <span class="play-btn" aria-hidden="true"></span>
  </button>`;

function renderVideoGrid(elId, list, label) {
  const grid = document.getElementById(elId);
  if (!grid) return;
  grid.innerHTML = list.map((v, i) => `
    <div class="video-card">
      ${facade(v.id, v.caption || `${label} ${i + 1}`)}
      ${v.caption ? `<div class="video-cap">${v.caption}</div>` : ""}
    </div>`).join("");
}

function renderIntro() {
  const frame = document.getElementById("introFrame");
  if (frame) frame.innerHTML = facade(INTRO_ID, "Intro — meet Stan");
}

/* Swap a clicked poster for the actual autoplaying player */
function initLitePlayers() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".video-frame.lite");
    if (!btn) return;
    const id = btn.dataset.id;
    const wrap = document.createElement("div");
    wrap.className = "video-frame";
    wrap.innerHTML = `
      <iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    btn.replaceWith(wrap);
  });
}

function renderPhotos() {
  const grid = document.getElementById("photoGallery");
  if (!grid) return;
  grid.innerHTML = PHOTOS.map((p) => `
    <figure class="photo">
      <img src="${p.src}" alt="${p.caption}" loading="lazy" />
      <figcaption>${p.caption}</figcaption>
    </figure>`).join("");
}

/* ---- Mobile nav ---- */
function initNav() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach((el) => io.observe(el));
}

/* ---- Active nav link on scroll ---- */
function initActiveNav() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link && e.isIntersecting) {
        document.querySelectorAll(".nav-links a").forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["about", "places", "work", "contact"]
    .map((id) => document.getElementById(id))
    .forEach((s) => { if (s) io.observe(s); });
}

document.addEventListener("DOMContentLoaded", () => {
  renderIntro();
  renderVideoGrid("placesGrid", PLACES_VIDEOS, "Travel clip");
  renderVideoGrid("workGrid", WORK_VIDEOS, "Brand clip");
  renderPhotos();
  initLitePlayers();
  initNav();
  initReveal();
  initActiveNav();
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
});
