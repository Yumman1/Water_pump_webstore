"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Full-bleed hero background media (video if configured, else image). Fills the
 * hero section behind the header and text; the parent applies the dark tint.
 * The video loops muted with a slow "3D" zoom and a near-end seek to hide the
 * loop seam.
 */
export function HeroMedia() {
  const { image, video } = siteConfig.hero;
  const ref = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {video ? (
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
          onTimeUpdate={(e) => {
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
      ) : image ? (
        <Image src={image} alt="" fill priority className="hero-zoom object-cover" />
      ) : null}
    </div>
  );
}
