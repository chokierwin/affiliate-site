"use client";

const SCRIPT_ID = "adsterra-social-bar";
const SCRIPT_SRC =
  "https://pl30169084.effectivecpmnetwork.com/ab/79/f2/ab79f2edf892c06fc67b75e888fd0380.js";

/**
 * Adsterra "Social Bar" ad. Instead of loading sitewide on every page visit
 * (which shows a full-page overlay to everyone, including people just
 * browsing), this is triggered on demand — specifically when someone clicks
 * a "Beli Sekarang" button. That way it only fires for visitors who've
 * already shown buying intent, and casual browsers never see it.
 *
 * Safe to call multiple times: the script is only ever injected once.
 */
export function loadSocialBarAd() {
  if (typeof window === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = SCRIPT_SRC;
  script.async = true;
  document.body.appendChild(script);
}
