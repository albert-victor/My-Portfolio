/**
 * Works mega dropdown + mobile nav toggle.
 */

import { qs, qsa } from "../utils/dom.js";

export function initNavigation() {
  const header = qs("[data-header]");
  const nav = qs("[data-nav]");
  const toggle = qs("[data-nav-toggle]");
  const links = qsa("[data-nav-link]", nav || document);
  const backdrop = qs("[data-nav-backdrop]", nav || document);
  const worksItem = qs("[data-works-menu]", nav || document);
  const worksTrigger = qs("[data-works-trigger]", nav || document);

  let worksCloseTimer = 0;
  const isDesktop = () => window.matchMedia("(min-width: 48.01rem)").matches;

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const setWorksOpen = (isOpen) => {
    if (!worksItem || !worksTrigger) {
      return;
    }
    window.clearTimeout(worksCloseTimer);
    worksItem.classList.toggle("is-open", isOpen);
    worksTrigger.setAttribute("aria-expanded", String(isOpen));
  };

  const scheduleWorksClose = (delay = 180) => {
    window.clearTimeout(worksCloseTimer);
    worksCloseTimer = window.setTimeout(() => setWorksOpen(false), delay);
  };

  const setOpen = (isOpen) => {
    if (!nav || !toggle) {
      return;
    }
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
    if (!isOpen) {
      setWorksOpen(false);
    }
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  if (worksTrigger && worksItem) {
    const mega = qs(".works-mega", worksItem);

    worksTrigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setWorksOpen(!worksItem.classList.contains("is-open"));
    });

    worksItem.addEventListener("mouseenter", () => {
      if (isDesktop()) {
        window.clearTimeout(worksCloseTimer);
        setWorksOpen(true);
      }
    });

    worksItem.addEventListener("mouseleave", () => {
      if (isDesktop()) {
        scheduleWorksClose(200);
      }
    });

    if (mega) {
      mega.addEventListener("mouseenter", () => {
        if (isDesktop()) {
          window.clearTimeout(worksCloseTimer);
        }
      });

      mega.addEventListener("mouseleave", () => {
        if (isDesktop()) {
          scheduleWorksClose(200);
        }
      });
    }

    qsa("[data-works-link]", worksItem).forEach((link) => {
      link.addEventListener("click", () => {
        setWorksOpen(false);
        setOpen(false);
      });
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => setOpen(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setWorksOpen(false);
      setOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!worksItem || worksItem.contains(event.target)) {
      return;
    }
    setWorksOpen(false);
  });
}
