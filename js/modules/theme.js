/**
 * Light / dark theme toggle — default light, persist preference.
 */

import { qs } from "../utils/dom.js";

const STORAGE_KEY = "avm-theme";

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";

  if (next === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore quota / private mode */
  }

  const toggle = qs("[data-theme-toggle]");
  if (toggle) {
    const label = next === "dark" ? "Switch to light theme" : "Switch to dark theme";
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
  }
}

export function initTheme() {
  const toggle = qs("[data-theme-toggle]");
  if (!toggle) {
    return;
  }

  setTheme(getTheme());

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });
}
