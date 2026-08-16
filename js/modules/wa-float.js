/**
 * Floating WhatsApp – pill with stacked label + rotating prompt.
 */

import { qs } from "../utils/dom.js";
import { SITE } from "../utils/constants.js";
import { prefersReducedMotion } from "../utils/dom.js";
import { mountInPageDock } from "./back-to-top.js";
const PHRASES = [
  "Let's work together",
  "Ask about a brief",
  "Need a website?",
  "Need a mobile app?",
  "Need a graphics designer?",
  "Building a system?",
  "Brand visuals?",
  "Available for hire",
];

const OPEN_MS = 5000;
const IDLE_MS = 16000;
const FIRST_DELAY_MS = 2500;

function buildWhatsAppUrl() {
  const text = encodeURIComponent("Hi Albert – I'd like to discuss a project.");
  const phone = (SITE.whatsapp || "").replace(/\D/g, "");

  if (phone.length >= 10) {
    return `https://wa.me/${phone}?text=${text}`;
  }

  const inWorkFolder = /\/work\//.test(window.location.pathname);
  return inWorkFolder ? "../contact.html" : "contact.html";
}

export function initWhatsAppFloat() {
  if (qs("[data-wa-float]")) {
    return;
  }

  const href = buildWhatsAppUrl();
  const isExternal = href.startsWith("http");

  const root = document.createElement("div");
  root.className = "wa-float";
  root.setAttribute("data-wa-float", "");

  root.innerHTML = `
    <a
      class="wa-float__chip"
      data-wa-chip
      href="${href}"
      ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <span class="wa-float__icon-wrap" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
          <path d="M16.75 13.96c.1-.17.18-.36.2-.55.04-.22-.02-.4-.16-.54l-.08-.07a5.3 5.3 0 0 0-.7-.4c-.2-.1-.41-.16-.55-.1-.14.05-.4.47-.55.63-.1.12-.21.13-.37.06a7.7 7.7 0 0 1-2.27-1.4 8.4 8.4 0 0 1-1.55-1.9c-.08-.14-.01-.22.06-.3.12-.14.27-.35.4-.53.1-.13.15-.24.1-.37-.05-.14-.48-1.15-.66-1.57-.17-.4-.35-.34-.48-.35h-.4c-.14 0-.37.05-.56.26-.2.22-.74.72-.74 1.76s.76 2.04.86 2.18c.1.14 1.5 2.28 3.63 3.2.5.22.9.35 1.2.45.51.16.97.14 1.34.08.41-.06 1.25-.51 1.43-1 .18-.5.18-.92.12-1.01Z"/>
          <path d="M12.04 2C6.5 2 2 6.48 2 12c0 1.9.53 3.67 1.45 5.2L2.1 21.9l4.84-1.27A9.94 9.94 0 0 0 12.04 22C17.58 22 22 17.52 22 12S17.58 2 12.04 2Zm0 18.13h-.01a8.17 8.17 0 0 1-4.16-1.14l-.3-.18-3.08.8.82-3-.2-.31A8.15 8.15 0 0 1 3.87 12c0-4.5 3.67-8.16 8.17-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.13-8.16 8.13Z"/>
        </svg>
      </span>
      <span class="wa-float__copy">
        <span class="wa-float__label">WhatsApp</span>
        <span class="wa-float__text" data-wa-copy>${PHRASES[0]}</span>
      </span>
    </a>
  `;

  mountInPageDock(root);
  const chip = qs("[data-wa-chip]", root);
  const copy = qs("[data-wa-copy]", root);

  if (!chip || !copy) {
    return;
  }

  let phraseIndex = 0;
  let cycleTimer = null;

  const clearCycle = () => {
    if (cycleTimer) {
      window.clearTimeout(cycleTimer);
      cycleTimer = null;
    }
  };

  const setPhrase = (index) => {
    phraseIndex = index;
    const phrase = PHRASES[phraseIndex];
    copy.classList.add("is-swap");
    window.setTimeout(() => {
      copy.textContent = phrase;
      chip.setAttribute("aria-label", `WhatsApp – ${phrase}`);
      chip.setAttribute("title", `WhatsApp – ${phrase}`);
      copy.classList.remove("is-swap");
    }, 180);
  };

  const scheduleNext = (delay) => {
    clearCycle();
    cycleTimer = window.setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      setPhrase(phraseIndex);
      scheduleNext(IDLE_MS);
    }, delay);
  };

  if (prefersReducedMotion()) {
    chip.classList.add("is-ready");
    return;
  }

  window.setTimeout(() => {
    chip.classList.add("is-ready");
  }, 400);

  scheduleNext(FIRST_DELAY_MS + OPEN_MS);

  chip.addEventListener("mouseenter", () => {
    clearCycle();
  });

  chip.addEventListener("mouseleave", () => {
    scheduleNext(IDLE_MS);
  });
}
