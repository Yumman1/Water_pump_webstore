"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Full-bleed hero background media (video if configured, else image). Fills the
 * hero section behind the header and text; the parent applies the dark tint.
 * Poster image paints immediately for LCP; video loads after first paint.
 */
export function HeroMedia() {
  const { image, video, poster } = siteConfig.hero;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!video) return;
    const el = ref.current;
    if (!el) return;

    const play = () => {
      el.muted = true;
      void el.play().catch(() => {});
      setVideoReady(true);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(play, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(play, 300);
    return () => clearTimeout(t);
  }, [video]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
      )}
      {video ? (
        <video
          ref={ref}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster || undefined}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration && v.currentTime >= v.duration - 0.15) {
              v.currentTime = 0;
              void v.play();
            }
          }}
          className={`hero-zoom h-full w-full object-cover transition-opacity duration-500 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : image ? (
        <Image src={image} alt="" fill priority sizes="100vw" className="hero-zoom object-cover" />
      ) : null}
    </div>
  );
}
