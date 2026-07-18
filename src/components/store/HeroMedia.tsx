"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Framed hero media (video if configured, else image), shown in its own column
 * beside the hero text — so the two never overlap. The video loops muted with a
 * slow "3D" zoom and a near-end seek to hide the loop seam.
 */
export function HeroMedia() {
  const { image, video } = siteConfig.hero;
  const ref = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-brand-900 shadow-2xl ring-1 ring-white/10">
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
          poster={image}
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
      ) : (
        <Image src={image} alt="" fill priority className="hero-zoom object-cover" />
      )}
    </div>
  );
}
