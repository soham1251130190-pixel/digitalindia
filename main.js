// main.js
// Handles navigation, smooth scrolling, animated counters, and scroll-based animations

document.addEventListener("DOMContentLoaded", () => {
  setupCurrentYear();
  setupMobileNav();
  // PERF: Smooth scrolling is handled by CSS (`scroll-behavior`) and `scroll-margin-top` offsets.
  // Keeping this in CSS avoids adding click listeners for every internal link.
  setupNavbarOnScroll();
  setupScrollReveal();
  setupCounters();
  setupBackToTop();
});

/**
 * Updates footer year automatically
 */
function setupCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Mobile navigation toggle
 */
function setupMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("primary-nav");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu when link is clicked
  navLinks.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/**
 * Adds a background + shadow to navbar after scrolling
 */
function setupNavbarOnScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  // Initial check
  handleScroll();
}

/**
 * Reveals elements with .reveal-on-scroll using IntersectionObserver
 */
function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window) || revealElements.length === 0) {
    // Fallback: show all
    revealElements.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * Count-up animation for stats cards
 */
function setupCounters() {
  const counters = document.querySelectorAll(".counter");
  if (counters.length === 0) return;

  const prefersReducedMotion =
    "matchMedia" in window && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const formatter =
    "Intl" in window && "NumberFormat" in Intl
      ? new Intl.NumberFormat("en-IN", {
          notation: "compact",
          maximumFractionDigits: 1,
        })
      : null;

  const formatNumber = (value) => (formatter ? formatter.format(value) : value.toLocaleString());

  const counterData = Array.from(counters).map((counter) => ({
    el: counter,
    target: Number(counter.getAttribute("data-target") || "0"),
  }));

  const setFinalValues = () => {
    counterData.forEach(({ el, target }) => {
      el.textContent = formatNumber(target);
    });
  };

  if (prefersReducedMotion) {
    setFinalValues();
    return;
  }

  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    const duration = 1600; // ms
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);

      counterData.forEach(({ el, target }) => {
        const currentValue = Math.floor(target * eased);
        el.textContent = formatNumber(currentValue);
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setFinalValues();
      }
    };

    requestAnimationFrame(step);
  };

  // Trigger counters when impact section is visible
  const impactSection = document.querySelector(".impact");
  if (!impactSection) {
    animateCounters();
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(impactSection);
  } else {
    // Fallback: animate on load
    animateCounters();
  }
}

/**
 * Easing function for smoother counter animation
 * @param {number} t - progress between 0 and 1
 * @returns {number}
 */
function easeOutQuad(t) {
  return t * (2 - t);
}

/**
 * Back to top button
 */
function setupBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top");
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 260) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  // Initialize state
  toggleVisibility();
}


