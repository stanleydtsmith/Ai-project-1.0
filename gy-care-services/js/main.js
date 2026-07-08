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

  // Contact/apply intent toggle: one form, two modes.
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var intentField = document.getElementById("intentField");
    var messageLabel = document.getElementById("messageLabel");
    var messageField = document.getElementById("message");
    var submitBtn = document.getElementById("submitBtn");
    var toggleBtns = document.querySelectorAll(".intent-btn");
    var copy = {
      staff: {
        messageLabel: "How can we help you?",
        messagePlaceholder: "Tell us about your staffing needs, or the role you're interested in",
        submitLabel: "Send Message"
      },
      apply: {
        messageLabel: "Brief description of your experience in healthcare",
        messagePlaceholder: "Tell us about your experience and qualifications",
        submitLabel: "Submit Application"
      }
    };

    function setIntent(intent) {
      intentField.value = intent;
      toggleBtns.forEach(function (btn) {
        var active = btn.getAttribute("data-intent") === intent;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
      contactForm.querySelectorAll("[data-intent-fields]").forEach(function (group) {
        var match = group.getAttribute("data-intent-fields") === intent;
        group.hidden = !match;
        group.querySelectorAll("input:not([type=checkbox]), select").forEach(function (el) {
          el.required = match;
        });
      });
      messageLabel.textContent = copy[intent].messageLabel;
      messageField.placeholder = copy[intent].messagePlaceholder;
      submitBtn.textContent = copy[intent].submitLabel;
    }

    setIntent("staff");

    toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setIntent(btn.getAttribute("data-intent"));
      });
    });

    var params = new URLSearchParams(window.location.search);
    if (params.get("intent") === "apply") {
      setIntent("apply");
    }
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
