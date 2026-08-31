(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        nav.classList.remove("is-open");
      }
    });

    // Close menu when clicking outside of nav and toggle button
    document.addEventListener("click", function (event) {
      var isClickInsideNav = nav.contains(event.target);
      var isClickOnToggle = toggle.contains(event.target);

      if (!isClickInsideNav && !isClickOnToggle) {
        if (toggle.getAttribute("aria-expanded") === "true") {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
          nav.classList.remove("is-open");
        }
      }
    });
  }

  var triggers = document.querySelectorAll(".accordion-trigger");
  Array.prototype.forEach.call(triggers, function (trigger) {
    trigger.addEventListener("click", function () {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;
      var open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Handle desktop vs mobile email links
  var emailLinks = document.querySelectorAll("a[href^='mailto:']");
  Array.prototype.forEach.call(emailLinks, function (link) {
    link.addEventListener("click", function (event) {
      // Desktop (> 768px): prevent mailto and open Gmail web compose
      if (window.innerWidth > 768) {
        event.preventDefault();
        window.location.href = "https://mail.google.com/mail/?view=cm&fs=1&to=alimansoorqadirghumro@gmail.com";
      }
      // Mobile (<= 768px): let mailto: link work normally
    });
  });
})();
