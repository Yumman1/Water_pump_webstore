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
        {/* Legibility overlays — dark scrim on the left where the text sits.
            Uses black (opacity modifiers work reliably) rather than the
            CSS-variable brand color. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image src={image} alt="" fill priority className="hero-zoom object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25" />
    </div>
  );
}
