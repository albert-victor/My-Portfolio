/**
 * Resume dropdown — pick Software Engineering, Web, or Graphics CV.
 */

import { qs, qsa } from "../utils/dom.js";

export function initResumeMenu() {
  const menus = qsa("[data-resume-menu]");

  menus.forEach((menu) => {
    const trigger = qs("[data-resume-trigger]", menu);
    const panel = qs("[data-resume-panel]", menu);

    if (!trigger || !panel) {
      return;
    }

    const setOpen = (isOpen) => {
      menu.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
    };

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!menu.classList.contains("is-open"));
    });

    document.addEventListener("click", (event) => {
      if (!menu.classList.contains("is-open")) {
        return;
      }
      if (!menu.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });
  });
}
