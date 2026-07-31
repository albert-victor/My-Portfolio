/**
 * Active nav state based on current path.
 */

import { qsa, qs } from "../utils/dom.js";

export function initActiveNav() {
  const path = (window.location.pathname || "").toLowerCase();
  const pathFile = (path.split("/").pop() || "index.html").toLowerCase();
  const links = qsa("[data-nav-link]");

  links.forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const hrefFile = href.split("/").pop() || "";

    let isMatch = false;

    if (hrefFile === "index.html" || hrefFile === "" || href === "./" || href === "/") {
      isMatch = pathFile === "index.html" || pathFile === "";
    } else {
      isMatch = pathFile === hrefFile;
    }

    if (isMatch) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const worksTrigger = qs("[data-works-trigger]");
  const worksLinks = qsa("[data-works-link]");
  const onWorksHub =
    path.includes("/work/") ||
    pathFile === "work.html" ||
    pathFile === "engineering.html" ||
    pathFile === "web.html" ||
    pathFile === "graphics.html";

  if (worksTrigger && onWorksHub) {
    worksTrigger.setAttribute("aria-current", "page");
  }

  worksLinks.forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const hrefFile = href.split("/").pop() || "";
    if (hrefFile && pathFile === hrefFile) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
