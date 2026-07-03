"use client";

import Script from "next/script";

/**
 * Adsterra "Social Bar" ad — a small sitewide floating unit (not tied to a
 * specific spot on the page). Loaded with Next.js's `lazyOnload` strategy so
 * it's fetched after the page has become interactive, keeping it out of the
 * critical rendering path (protects Core Web Vitals).
 *
 * Mount this once, near the root layout — it should not be repeated on every
 * page.
 */
export default function SocialBarAd() {
  return (
    <Script
      id="adsterra-social-bar"
      src="https://pl30169084.effectivecpmnetwork.com/ab/79/f2/ab79f2edf892c06fc67b75e888fd0380.js"
      strategy="lazyOnload"
    />
  );
}
