/**
 * Clients logo strip: two rows scroll in opposite directions, seamless infinite loop.
 */

import { qsa, qs } from "../utils/dom.js";

function prepareTrack(track) {
  const list = qs(".clients__list", track);
  if (!list) {
    return 0;
  }

  track.querySelectorAll(".clients__list[data-clone]").forEach((node) => node.remove());

  const marquee = track.closest(".clients__marquee");
  const minWidth = (marquee?.offsetWidth || window.innerWidth) * 2;
  let cloneIndex = 0;

  while (track.scrollWidth < minWidth) {
    const clone = list.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("data-clone", "true");
    clone.dataset.cloneIndex = String(cloneIndex++);
    track.appendChild(clone);
  }

  const firstClone = qs(".clients__list[data-clone]", track);
  if (!firstClone) {
    return list.scrollWidth;
  }

  const loopWidth = firstClone.offsetLeft - list.offsetLeft;
  return loopWidth > 0 ? loopWidth : list.scrollWidth;
}

function initSyncedMarquee(root) {
  const marquees = qsa(".clients__marquee", root);
  if (!marquees.length) {
    return;
  }

  const rows = marquees
    .map((marquee, index) => {
      const track = qs(".clients__track", marquee);
      if (!track) {
        return null;
      }

      return {
        track,
        loopWidth: 0,
        offset: 0,
        reverse: index % 2 === 1,
      };
    })
    .filter(Boolean);

  if (!rows.length) {
    return;
  }

  const measure = () => {
    rows.forEach((row) => {
      row.loopWidth = prepareTrack(row.track);
      if (row.loopWidth > 0) {
        row.offset %= row.loopWidth;
      }
    });
  };

  const apply = () => {
    rows.forEach((row) => {
      if (row.loopWidth <= 0) {
        row.track.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      const distance = row.offset;
      row.track.style.transform = row.reverse
        ? `translate3d(${distance - row.loopWidth}px, 0, 0)`
        : `translate3d(${-distance}px, 0, 0)`;
    });
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const speed = 36;
  let raf = 0;
  let running = false;
  let lastTs = 0;

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

    const delta = (speed * dt) / 1000;

    rows.forEach((row) => {
      row.offset += delta;
      if (row.loopWidth > 0 && row.offset >= row.loopWidth) {
        row.offset -= row.loopWidth;
      }
    });

    apply();
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (reduceMotion.matches) {
      stop();
      rows.forEach((row) => {
        row.offset = 0;
      });
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
      apply();
    },
    { passive: true }
  );

  reduceMotion.addEventListener("change", () => {
    stop();
    rows.forEach((row) => {
      row.offset = 0;
    });
    apply();
    start();
  });

  measure();
  apply();
  start();
}

export function initClientsMarquee() {
  qsa("[data-clients-marquee]").forEach(initSyncedMarquee);
}
