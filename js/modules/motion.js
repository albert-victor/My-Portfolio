/**
 * Global scroll reveal – calm directions, respects reduced motion.
 */

import { qsa, prefersReducedMotion } from "../utils/dom.js";

function collectRevealTargets() {
  const explicit = qsa("[data-reveal]");
  const auto = qsa(
    [
      "main > section:not(.hero)",
      "main .cta-band",
      ".hero__identity > *",
      ".spec-card",
      ".work-grid__item",
      ".work-section",
      ".case-section",
      ".about-principles__item",
      ".about-timeline__item",
      ".services-list__item",
      ".service-card",
      ".stack-item",
      ".eng-card",
      ".field-story__item",
      ".gallery-item",
      ".project-teaser",
      ".clients__intro",
      ".clients__marquee",
      ".testimonials__intro",
      ".section-header",
      ".contact-atelier__hero",
      ".contact-dock__card",
      ".contact-brief__rail",
      ".contact-brief__form",
    ].join(", ")
  );

  const seen = new Set();
  const targets = [];

  [...explicit, ...auto].forEach((el) => {
    if (seen.has(el) || el.closest("[data-reveal-skip]")) {
      return;
    }
    // Prefer leaf cards over wrapping sections when both match.
    // Never leave a section stuck at opacity:0 from data-reveal while children animate.
    if (
      el.matches("main > section") &&
      el.querySelector(
        ".spec-card, .project-teaser, .field-card, .gallery-item, .stack-item, .service-card, .clients__intro"
      )
    ) {
      el.removeAttribute("data-reveal");
      el.classList.remove("is-revealed");
      return;
    }
    seen.add(el);
    targets.push(el);
  });

  return targets;
}

function assignDirections(targets) {
  targets.forEach((el, i) => {
    const current = el.getAttribute("data-reveal");
    if (current === "left" || current === "right" || current === "up") {
      return;
    }

    if (
      el.matches(
        ".spec-card, .eng-card, .field-card, .gallery-item, .project-teaser, .work-grid__item, .service-card, .stack-item"
      )
    ) {
      el.setAttribute("data-reveal", "up");
      return;
    }

    if (el.matches(".clients__marquee, .clients__intro, .section-header, .testimonials__intro")) {
      el.setAttribute("data-reveal", "up");
      return;
    }

    const from = i % 3 === 0 ? "up" : i % 3 === 1 ? "left" : "right";
    el.setAttribute("data-reveal", from);
  });
}

export function initMotion() {
  const targets = collectRevealTargets();

  if (!targets.length) {
    return;
  }

  targets.forEach((el) => {
    if (!el.hasAttribute("data-reveal")) {
      el.setAttribute("data-reveal", "up");
    }
  });

  assignDirections(targets);

  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  targets.forEach((el) => observer.observe(el));

  // Reveal anything already in view on first paint
  window.requestAnimationFrame(() => {
    targets.forEach((el) => {
      if (el.classList.contains("is-revealed")) {
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 40) {
        el.classList.add("is-revealed");
        observer.unobserve(el);
      }
    });
  });
}
