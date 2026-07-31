/**
 * Lazy media helpers — progressive enhancement for images/video.
 */

import { qsa } from "../utils/dom.js";

export function initMedia() {
  const images = qsa("img[data-src]");

  if (!("IntersectionObserver" in window)) {
    images.forEach((img) => {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const img = entry.target;
        const src = img.getAttribute("data-src");

        if (src) {
          img.src = src;
          img.removeAttribute("data-src");
        }

        observer.unobserve(img);
      });
    },
    { rootMargin: "200px 0px" }
  );

  images.forEach((img) => observer.observe(img));
}
