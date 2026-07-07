(function () {
  "use strict";

  // Mobile nav toggle
  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("navToggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".main-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Pulse-divider draw-in animation on scroll
  var dividers = document.querySelectorAll(".pulse-divider");
  if ("IntersectionObserver" in window && dividers.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    dividers.forEach(function (el) { io.observe(el); });
  } else {
    dividers.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Forms: lightweight client-side handling.
  // NOTE: these forms have no backend wired up yet. Point the <form action>
  // at a form service (e.g. Formspree, Netlify Forms) or your own endpoint
  // before launch — see README.md.
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("REPLACE_WITH") !== -1) {
        event.preventDefault();
        var success = form.parentElement.querySelector(".form-success");
        if (success) {
          success.classList.add("is-visible");
          success.setAttribute("tabindex", "-1");
          success.focus();
        }
        form.reset();
      }
    });
  });
})();
