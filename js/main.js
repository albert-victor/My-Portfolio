/**
 * Application bootstrap — page behaviors load progressively.
 */

import { onReady, qs } from "./utils/dom.js";
import { initTheme } from "./modules/theme.js";
import { initNavigation } from "./modules/navigation.js";
import { initActiveNav } from "./modules/active-nav.js";
import { initResumeMenu } from "./modules/resume-menu.js";
import { initMotion } from "./modules/motion.js";
import { initMedia } from "./modules/media.js";
import { initWorkFilter } from "./modules/work-filter.js";
import { initContactForm } from "./modules/contact-form.js";
import { initWhatsAppFloat } from "./modules/wa-float.js";
import { initClientsMarquee } from "./modules/clients-marquee.js";

function initFooterYear() {
  const year = qs("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

function safe(label, fn) {
  try {
    fn();
  } catch (error) {
    console.error(`[AVM] ${label} failed`, error);
  }
}

function boot() {
  safe("theme", initTheme);
  safe("navigation", initNavigation);
  safe("active-nav", initActiveNav);
  safe("resume-menu", initResumeMenu);
  safe("motion", initMotion);
  safe("media", initMedia);
  safe("work-filter", initWorkFilter);
  safe("contact-form", initContactForm);
  safe("footer-year", initFooterYear);
  safe("wa-float", initWhatsAppFloat);
  safe("clients-marquee", initClientsMarquee);
}

onReady(boot);
