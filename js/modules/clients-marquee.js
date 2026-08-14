/**
 * Clients logo strip: elegant, seamless continuous loop.
 * Clones the list once so the motion never visibly jumps or bounces.
 */

import { qs } from "../utils/dom.js";

export function initClientsMarquee() {
  const root = qs("[data-clients-marquee]");
  if (!root) {
    return;
  }

  const track = qs(".clients__track", root);
  const list = qs(".clients__list", root);
  if (!track || !list) {
    return;
  }

  // Reset any previous clones, then add exactly one mirror copy for a seamless wrap.
  track.querySelectorAll(".clients__list[data-clone]").forEach((node) => node.remove());
  const clone = list.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("data-clone", "true");
  track.appendChild(clone);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const speed = 40; // px per second – calm, premium pace
  let raf = 0;
  let running = false;
  let offset = 0;
  let lastTs = 0;
  let loopWidth = 0;

  const measure = () => {
    // Exact repeat distance = where the clone begins minus where the list begins
    // (this naturally includes the flex gap between the two lists).
    loopWidth = clone.offsetLeft - list.offsetLeft;
    if (loopWidth <= 0) {
      loopWidth = list.scrollWidth;
    }
  };

  const apply = () => {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const stop = () => {
    running = false;
    lastTs = 0;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const tick = (ts) => {
    if (!running) {
      return;
    }
    if (!lastTs) {
      lastTs = ts;
    }
    const dt = Math.min(40, ts - lastTs);
    lastTs = ts;

    offset += (speed * dt) / 1000;
    if (loopWidth > 0 && offset >= loopWidth) {
      // Seamless wrap: the clone is now exactly where the original was.
      offset -= loopWidth;
    }
    apply();
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (reduceMotion.matches) {
      stop();
      offset = 0;
      apply();
      return;
    }
    if (running) {
      return;
    }
    running = true;
    lastTs = 0;
    raf = requestAnimationFrame(tick);
  };

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  window.addEventListener(
    "resize",
    () => {
      measure();
      if (loopWidth > 0) {
        offset %= loopWidth;
      }
      apply();
    },
    { passive: true }
  );

  reduceMotion.addEventListener("change", () => {
    stop();
    offset = 0;
    apply();
    start();
  });

  measure();
  apply();
  start();
}
