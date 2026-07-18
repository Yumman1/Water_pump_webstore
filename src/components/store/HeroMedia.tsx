"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Hero background media. If a video is configured it plays muted & looping with
 * a slow, continuous "3D" zoom for depth. A near-end seek makes the loop feel
 * seamless (no black-frame flash). Falls back to the image otherwise.
 */
export function HeroMedia() {
  const { image, video } = siteConfig.hero;
  const ref = useRef<HTMLVideoElement | null>(null);

  if (video) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={(el) => {
            ref.current = el;
            if (el) el.muted = true;
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={image}
          onTimeUpdate={(e) => {
            // Restart a hair before the true end to hide the loop seam.
            const v = e.currentTarget;
            if (v.duration && v.currentTime >= v.duration - 0.15) {
              v.currentTime = 0;
              void v.play();
            }
          }}
          className="hero-zoom h-full w-full object-cover"
          aria-hidden
        >
          <source src={video} type="video/mp4" />
        </video>
        {/* Legibility overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/60 to-brand-900/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-brand-900/30" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image src={image} alt="" fill priority className="hero-zoom object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/60 to-brand-900/30" />
    </div>
  );
}
