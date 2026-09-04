/* ==========================================================
   StanUGC — site logic
   ----------------------------------------------------------
   TO ADD/EDIT CONTENT, just change the arrays below.
   - VIDEOS: paste a YouTube video ID + a caption.
   - TRIPS:  name, location, blurb, and optional image file.
   ========================================================== */

/* ---- 1. VIDEOS -------------------------------------------
   The id is the part of a YouTube link after /shorts/ or ?v=
   e.g. youtube.com/shorts/L7Yf1K_uYgg  ->  id: "L7Yf1K_uYgg"
--------------------------------------------------------------*/
const VIDEOS = [
  { id: "L7Yf1K_uYgg", caption: "" },
  { id: "WBum-Vdbyyc", caption: "" },
  { id: "Uf8nhhJL2DM", caption: "" },
  { id: "EEwIqnhPjhM", caption: "" },
  { id: "la-4Up1MsY4", caption: "" },
];

/* ---- 2. TRIPS --------------------------------------------
   Add "image" to point at a file in images/, e.g.
   { name: "Snowdonia", location: "Wales", blurb: "...",
     image: "images/snowdonia.jpg" }
   Leave image out to use a colour placeholder.
--------------------------------------------------------------*/
const TRIPS = [
  { name: "Trip name", location: "Location", blurb: "One line about this trip — the conditions, the story, or the brand you shot for.", grad: "linear-gradient(160deg,#2f4a38,#6d8f5f)" },
  { name: "Trip name", location: "Location", blurb: "Swap these placeholders for your real adventures — just send me the details.", grad: "linear-gradient(160deg,#3a4a63,#8aa2b8)" },
  { name: "Trip name", location: "Location", blurb: "A photo makes each card pop; add one to images/ and reference it here.", grad: "linear-gradient(160deg,#6b4a2f,#d9a066)" },
];

/* ---------------------------------------------------------- */

function renderVideos() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;
  grid.innerHTML = VIDEOS.map((v, i) => `
    <div class="video-card">
      <div class="video-frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${v.id}"
          title="StanUGC video ${i + 1}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      ${v.caption ? `<div class="video-cap">${v.caption}</div>` : ""}
    </div>`).join("");
}

function renderTrips() {
  const grid = document.getElementById("tripGrid");
  if (!grid) return;
  grid.innerHTML = TRIPS.map((t) => `
    <article class="trip-card">
      ${t.image
        ? `<img src="${t.image}" alt="${t.name} — ${t.location}" loading="lazy" />`
        : `<span class="trip-bg" style="background:${t.grad || "linear-gradient(160deg,#2f4a38,#6d8f5f)"}"></span>`}
      <div class="trip-info">
        <div class="loc">${t.location}</div>
        <h3>${t.name}</h3>
        <p>${t.blurb}</p>
      </div>
    </article>`).join("");
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
  const sections = ["about", "trips", "work", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const linkFor = (id) => document.querySelector(`.nav-links a[href="#${id}"]`);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const link = linkFor(e.target.id);
      if (!link) return;
      if (e.isIntersecting) {
        document.querySelectorAll(".nav-links a").forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
}

document.addEventListener("DOMContentLoaded", () => {
  renderVideos();
  renderTrips();
  initNav();
  initReveal();
  initActiveNav();
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
});
