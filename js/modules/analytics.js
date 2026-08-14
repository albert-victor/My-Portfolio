/**
 * Privacy-friendly visit tracking – page views, referrers, search sources.
 */

import { ANALYTICS } from "../utils/analytics-config.js";

const SESSION_KEY = "avm-analytics-session";
const SESSION_TS_KEY = "avm-analytics-session-ts";

const SEARCH_ENGINES = [
  { id: "google", pattern: /google\./i, queryParam: "q" },
  { id: "bing", pattern: /bing\./i, queryParam: "q" },
  { id: "yahoo", pattern: /yahoo\./i, queryParam: "p" },
  { id: "duckduckgo", pattern: /duckduckgo\./i, queryParam: "q" },
  { id: "baidu", pattern: /baidu\./i, queryParam: "wd" },
];

function getDeviceType() {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function parseReferrer(referrer) {
  if (!referrer) {
    return { source: "direct", searchQuery: "" };
  }

  let url;
  try {
    url = new URL(referrer);
  } catch {
    return { source: "other", searchQuery: "" };
  }

  const host = url.hostname.replace(/^www\./, "");

  for (const engine of SEARCH_ENGINES) {
    if (engine.pattern.test(host)) {
      const q = url.searchParams.get(engine.queryParam) || "";
      return { source: engine.id, searchQuery: q.trim() };
    }
  }

  if (/facebook\.|fb\.|instagram\.|twitter\.|x\.com|linkedin\.|tiktok\./i.test(host)) {
    return { source: "social", searchQuery: "" };
  }

  return { source: "referral", searchQuery: "" };
}

function getOrCreateSession() {
  const timeoutMs = ANALYTICS.sessionTimeoutMin * 60 * 1000;
  const now = Date.now();

  let sessionId = "";
  let isNewSession = false;

  try {
    sessionId = sessionStorage.getItem(SESSION_KEY) || "";
    const lastTs = Number(sessionStorage.getItem(SESSION_TS_KEY) || 0);

    if (!sessionId || now - lastTs > timeoutMs) {
      sessionId = crypto.randomUUID?.() || `s-${now}-${Math.random().toString(36).slice(2, 9)}`;
      isNewSession = true;
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    sessionStorage.setItem(SESSION_TS_KEY, String(now));
  } catch {
    sessionId = `s-${now}`;
    isNewSession = true;
  }

  return { sessionId, isNewSession };
}

function loadGoatCounter(code) {
  if (document.querySelector(`script[data-goatcounter="${code}"]`)) return;

  window.goatcounter = { no_onload: true };

  const s = document.createElement("script");
  s.async = true;
  s.dataset.goatcounter = code;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", `https://${code}.goatcounter.com/count`);
  document.head.appendChild(s);

  if (window.goatcounter && typeof window.goatcounter.count === "function") {
    window.goatcounter.count();
  }
}

function loadGA4(id) {
  if (document.querySelector(`script[data-ga4="${id}"]`)) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  s.dataset.ga4 = id;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });
}

function sendToBackend(payload) {
  const url = resolveEndpoint(ANALYTICS.endpoint);
  if (!url) return;

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(url, blob)) return;
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

/** Resolve endpoint using the same base as main.js (root vs /work/ pages). */
function resolveEndpoint(endpoint) {
  if (!endpoint) return "";
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  const script = document.querySelector('script[src*="main.js"]');
  const src = script?.getAttribute("src") || "js/main.js";
  const prefix = src.startsWith("../") ? "../" : "";
  return `${prefix}${endpoint}`;
}

export function initAnalytics() {
  if (!ANALYTICS.enabled) return;

  const referrer = document.referrer || "";
  const { source, searchQuery } = parseReferrer(referrer);
  const { sessionId, isNewSession } = getOrCreateSession();

  const payload = {
    page: `${location.pathname}${location.search}`,
    title: document.title,
    referrer,
    source,
    searchQuery,
    sessionId,
    device: getDeviceType(),
    language: navigator.language?.slice(0, 10) || "",
    isNewSession,
  };

  sendToBackend(payload);

  if (ANALYTICS.goatCounter) {
    loadGoatCounter(ANALYTICS.goatCounter);
  }

  if (ANALYTICS.ga4Id) {
    loadGA4(ANALYTICS.ga4Id);
  }
}
