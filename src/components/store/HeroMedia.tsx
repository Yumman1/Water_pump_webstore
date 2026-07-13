"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Hero background: a muted, looping video if configured, otherwise the image.
 * The callback ref forces `muted` so autoplay is allowed by browsers.
 */
export function HeroMedia() {
  const { image, video } = siteConfig.hero;

  if (video) {
    return (
      <video
        ref={(el) => {
          if (el) el.muted = true;
        }}
        autoPlay
        loop
        muted
        playsInline
        poster={image}
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        aria-hidden
      >
        <source src={video} type="video/mp4" />
      </video>
    );
  }

  return <Image src={image} alt="" fill priority className="object-cover opacity-25" />;
}
