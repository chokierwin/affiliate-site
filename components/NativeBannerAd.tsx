"use client";

import { useEffect, useRef, useState } from "react";

type NativeBannerAdProps = {
  /** The Adsterra native banner zone id, e.g. "858080f0bede8f3e18306beb7f77c68f". */
  zoneId?: string;
  className?: string;
};

const DEFAULT_ZONE_ID = "858080f0bede8f3e18306beb7f77c68f";

/**
 * Renders an Adsterra Native Banner ad, but only injects the script once the
 * slot scrolls into view. This keeps ad scripts out of the initial page
 * load (protects Core Web Vitals) and avoids loading ads the visitor never
 * actually scrolls to.
 */
export default function NativeBannerAd({
  zoneId = DEFAULT_ZONE_ID,
  className = "",
}: NativeBannerAdProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const scriptId = `adsterra-native-${zoneId}`;
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `https://pl30169085.effectivecpmnetwork.com/${zoneId}/invoke.js`;
    document.body.appendChild(script);
  }, [isVisible, zoneId]);

  return (
    <div ref={wrapperRef} className={`w-full ${className}`}>
      <div id={`container-${zoneId}`} />
    </div>
  );
}
