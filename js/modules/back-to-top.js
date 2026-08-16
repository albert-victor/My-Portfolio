/**
 * Floating back-to-top button – sits above WhatsApp in the page dock.
 */

import { qs } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/dom.js";

const SHOW_AFTER_PX = 420;

function ensurePageDock() {
  let dock = qs("[data-page-dock]");

  if (!dock) {
    dock = document.createElement("div");
    dock.className = "page-dock";
    dock.setAttribute("data-page-dock", "");
    document.body.appendChild(dock);
  }

  return dock;
}

export function initBackToTop() {
  if (qs("[data-back-to-top]")) {
    return;
  }

  const dock = ensurePageDock();
  const waFloat = qs("[data-wa-float]");

  if (waFloat && waFloat.parentElement !== dock) {
    dock.appendChild(waFloat);
  }

  const btn = document.createElement("a");
  btn.className = "back-to-top";
  btn.href = "#main";
  btn.setAttribute("data-back-to-top", "");
  btn.setAttribute("aria-label", "Back to top");
  btn.title = "Back to top";
  btn.innerHTML = `
    <svg class="back-to-top__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 19V5"></path>
      <path d="m5 12 7-7 7 7"></path>
    </svg>
  `;

  dock.insertBefore(btn, dock.firstChild);

  const toggle = () => {
    const show = window.scrollY > SHOW_AFTER_PX;
    btn.classList.toggle("is-visible", show);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });

  btn.addEventListener("click", (event) => {
    const target = qs("#main") || document.documentElement;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  });
}

/**
 * Call from wa-float after it creates its root so both share one dock.
 */
export function mountInPageDock(node) {
  ensurePageDock().appendChild(node);
}
