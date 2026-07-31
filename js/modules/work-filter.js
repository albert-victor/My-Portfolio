/**
 * Work page panel filters + graphics gallery filters.
 */

import { qs, qsa } from "../utils/dom.js";
import { DISCIPLINES } from "../utils/constants.js";

function initDisciplineFilter() {
  const root = qs("[data-work-filter]");

  if (!root) {
    return;
  }

  const buttons = qsa("[data-filter]", root);
  const panels = qsa("[data-work-panel]");
  const items = qsa("[data-discipline]");

  const applyFilter = (discipline) => {
    buttons.forEach((button) => {
      const isActive = button.getAttribute("data-filter") === discipline;
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (panels.length) {
      panels.forEach((panel) => {
        const key = panel.getAttribute("data-work-panel") || "";
        const match =
          discipline === DISCIPLINES.all
            ? key === "all"
            : key === discipline || key.split(/\s+/).includes(discipline);
        panel.classList.toggle("is-active", match);
      });

      // Prefer a dedicated panel; if none for "all", show all panels
      if (discipline === DISCIPLINES.all) {
        const allPanel = panels.find((p) => p.getAttribute("data-work-panel") === "all");
        if (!allPanel) {
          panels.forEach((panel) => panel.classList.add("is-active"));
        }
      }
    } else {
      items.forEach((item) => {
        const tags = (item.getAttribute("data-discipline") || "")
          .split(/\s+/)
          .filter(Boolean);
        const match =
          discipline === DISCIPLINES.all || tags.includes(discipline);
        item.hidden = !match;
      });
    }

    // Keep sticky bar in view without jumping to page top
    const bar = qs(".work-filters-bar");
    if (bar && window.scrollY > bar.offsetTop + 80) {
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height")
        ) || 72;
      const y = bar.getBoundingClientRect().top + window.scrollY - header - 8;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.getAttribute("data-filter") || DISCIPLINES.all;
      applyFilter(next);
      if (history.replaceState) {
        const url = new URL(window.location.href);
        if (next === DISCIPLINES.all) {
          url.hash = "";
        } else {
          url.hash = next;
        }
        history.replaceState(null, "", url);
      }
    });
  });

  const hash = (window.location.hash || "").replace("#", "");
  const initial =
    hash && Object.values(DISCIPLINES).includes(hash) ? hash : DISCIPLINES.all;
  applyFilter(initial);
}

function initGalleryFilter() {
  const root = qs("[data-gallery-filter]");

  if (!root) {
    return;
  }

  const buttons = qsa("[data-filter]", root);
  const items = qsa("[data-gallery-cat]");
  const bar = root.closest(".gallery-filters-bar") || root;

  const applyFilter = (category, returnToGallery = false) => {
    buttons.forEach((button) => {
      const isActive = button.getAttribute("data-filter") === category;
      button.setAttribute("aria-pressed", String(isActive));
    });

    items.forEach((item) => {
      const cat = item.getAttribute("data-gallery-cat") || "";
      item.hidden = !(category === "all" || cat === category);
    });

    if (returnToGallery) {
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
      const y = bar.getBoundingClientRect().top + window.scrollY - header - 8;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.getAttribute("data-filter") || "all", true);
    });
  });

  const hash = (window.location.hash || "").replace("#", "");
  const hashMap = {
    print: "print-designs",
    flyers: "church-flyers",
    social: "social-media",
    "social-media": "social-media",
    "church-flyers": "church-flyers",
    "print-designs": "print-designs",
  };
  applyFilter(hashMap[hash] || "all");
}

export function initWorkFilter() {
  initDisciplineFilter();
  initGalleryFilter();
}
