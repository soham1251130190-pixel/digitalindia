document.addEventListener("DOMContentLoaded", () => {
  setupCurrentYear();
  setupMobileNav();
  setupNavbarOnScroll();
  setupScrollReveal();
  setupCounters();
  setupBackToTop();
});

function setupCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function setupMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("primary-nav");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

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
  handleScroll();
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window) || revealElements.length === 0) {
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

    const duration = 1600;
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
    animateCounters();
  }
}

function easeOutQuad(t) {
  return t * (2 - t);
}

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
  toggleVisibility();
}
