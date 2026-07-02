"use client";

import { useEffect, useRef, useState } from "react";

type AdSlotProps = {
  /** Adsterra "key" for this ad zone. Get this from your Adsterra dashboard. */
  adKey?: string;
  /** Ad dimensions, must match what you configured in Adsterra. */
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Renders an Adsterra banner only once the slot scrolls into view.
 * This keeps ad scripts out of the initial page load, which protects
 * Core Web Vitals (LCP/CLS) and avoids interrupting the browsing experience.
 *
 * To activate: create a "Banner" ad zone in your Adsterra dashboard, copy the
 * zone key, and pass it as `adKey`. Until then this renders nothing.
 */
export default function AdSlot({
  adKey,
  width = 300,
  height = 250,
  className = "",
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading a bit before it's on screen
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !adKey || !containerRef.current) return;

    // Adsterra's "invoke" script expects these globals + a script tag with
    // matching id before it will render into the slot.
    const scriptId = `adsterra-${adKey}`;
    if (document.getElementById(scriptId)) return;

    const options = document.createElement("script");
    options.type = "text/javascript";
    options.text = `
      atOptions = {
        key: "${adKey}",
        format: "iframe",
        height: ${height},
        width: ${width},
        params: {},
      };
    `;

    const invoke = document.createElement("script");
    invoke.id = scriptId;
    invoke.type = "text/javascript";
    invoke.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;

    containerRef.current.appendChild(options);
    containerRef.current.appendChild(invoke);
  }, [isVisible, adKey, width, height]);

  return (
    <div
      ref={containerRef}
      className={`mx-auto flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: adKey ? height : 0, maxWidth: width }}
      aria-hidden={!adKey}
    />
  );
}
