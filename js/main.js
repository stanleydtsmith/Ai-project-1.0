document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("map");
  const ctx = canvas.getContext("2d");

  const view = { scale: 1, offsetX: 0, offsetY: 0 };
  let dpr = window.devicePixelRatio || 1;
  let cssWidth = 0, cssHeight = 0;

  function resize() {
    cssWidth = canvas.clientWidth;
    cssHeight = canvas.clientHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  }
  window.addEventListener("resize", resize);
  resize();

  // Equirectangular projection, lng/lat -> unscaled canvas pixels.
  function project(lat, lng) {
    const x = ((lng + 180) / 360) * cssWidth;
    const y = ((90 - lat) / 180) * cssHeight;
    return { x, y };
  }

  function toScreen(x, y) {
    return { x: x * view.scale + view.offsetX, y: y * view.scale + view.offsetY };
  }

  function projectScreen(lat, lng) {
    const p = project(lat, lng);
    return toScreen(p.x, p.y);
  }

  // --- Pan & zoom ---
  let dragging = false;
  let dragStart = null;
  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    dragStart = { x: e.clientX, y: e.clientY, offX: view.offsetX, offY: view.offsetY };
    canvas.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    view.offsetX = dragStart.offX + (e.clientX - dragStart.x);
    view.offsetY = dragStart.offY + (e.clientY - dragStart.y);
  });
  window.addEventListener("mouseup", () => {
    dragging = false;
    canvas.style.cursor = "grab";
  });
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const worldX = (mx - view.offsetX) / view.scale;
      const worldY = (my - view.offsetY) / view.scale;
      const factor = Math.exp(-e.deltaY * 0.0012);
      const newScale = Math.min(8, Math.max(1, view.scale * factor));
      view.offsetX = mx - worldX * newScale;
      view.offsetY = my - worldY * newScale;
      view.scale = newScale;
    },
    { passive: false }
  );
  canvas.style.cursor = "grab";

  // --- Static map drawing (ocean, graticule, landmasses, airport dots) ---
  function drawBaseMap() {
    ctx.fillStyle = "#0b0f14";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.strokeStyle = "rgba(79, 209, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let lng = -180; lng <= 180; lng += 30) {
      const a = projectScreen(90, lng);
      const b = projectScreen(-90, lng);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    for (let lat = -60; lat <= 90; lat += 30) {
      const a = projectScreen(lat, -180);
      const b = projectScreen(lat, 180);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    ctx.fillStyle = "#182634";
    ctx.strokeStyle = "#2a3f52";
    ctx.lineWidth = 1;
    WORLD_LANDMASSES.forEach((ring) => {
      ctx.beginPath();
      ring.forEach(([lng, lat], i) => {
        const p = projectScreen(lat, lng);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
    AIRPORTS.forEach((a) => {
      const p = projectScreen(a.lat, a.lng);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawPlane(x, y, bearingDeg) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((bearingDeg * Math.PI) / 180);
    ctx.fillStyle = "#ffd166";
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(4.5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-4.5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawFlights(now) {
    flightManager.tick(now);
    flightManager.active().forEach((flight) => {
      const cur = flight._current;
      if (!cur) return;

      // Trail
      ctx.strokeStyle = "rgba(79, 209, 255, 0.5)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      flight.trail.forEach((pt, i) => {
        const p = projectScreen(pt.lat, pt.lng);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      const screen = projectScreen(cur.lat, cur.lng);
      flight.lastScreen = screen;
      drawPlane(screen.x, screen.y, cur.bearingDeg);
    });
  }

  function frame(now) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawBaseMap();
    drawFlights(now);
    requestAnimationFrame(frame);
  }

  // --- Click hit-testing against currently rendered plane positions ---
  canvas.addEventListener("click", (e) => {
    if (dragMoved) { dragMoved = false; return; }
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best = null;
    let bestDist = 16; // px hit radius
    flightManager.active().forEach((flight) => {
      if (!flight.lastScreen) return;
      const dx = flight.lastScreen.x - mx;
      const dy = flight.lastScreen.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestDist) {
        bestDist = d;
        best = flight;
      }
    });
    if (best) game.openPanel(best);
  });

  // Distinguish drag-to-pan from a click.
  let dragMoved = false;
  canvas.addEventListener("mousedown", () => { dragMoved = false; });
  window.addEventListener("mousemove", (e) => {
    if (dragging) dragMoved = true;
  });

  const els = {
    panel: document.getElementById("guessPanel"),
    panelSubtitle: document.getElementById("panelSubtitle"),
    closeBtn: document.getElementById("closeBtn"),
    originInput: document.getElementById("originInput"),
    originList: document.getElementById("originList"),
    destInput: document.getElementById("destInput"),
    destList: document.getElementById("destList"),
    submitBtn: document.getElementById("submitBtn"),
    giveUpBtn: document.getElementById("giveUpBtn"),
    nextBtn: document.getElementById("nextBtn"),
    feedback: document.getElementById("feedback"),
    scoreEl: document.getElementById("score"),
    streakEl: document.getElementById("streak"),
    accuracyEl: document.getElementById("accuracy"),
  };

  const flightManager = new FlightManager(AIRPORTS, { maxConcurrent: 14 });
  const game = new Game(flightManager, els);

  requestAnimationFrame(frame);

  // How to play modal
  const howToPlayBtn = document.getElementById("howToPlayBtn");
  const howToPlayModal = document.getElementById("howToPlayModal");
  const closeHowTo = document.getElementById("closeHowTo");
  howToPlayBtn.addEventListener("click", () => howToPlayModal.classList.remove("hidden"));
  closeHowTo.addEventListener("click", () => howToPlayModal.classList.add("hidden"));
  howToPlayModal.addEventListener("click", (e) => {
    if (e.target === howToPlayModal) howToPlayModal.classList.add("hidden");
  });

  // Show instructions on first load.
  howToPlayModal.classList.remove("hidden");
});
