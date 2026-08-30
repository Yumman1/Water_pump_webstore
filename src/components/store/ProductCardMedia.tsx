"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { productPosterSrc } from "@/lib/utils";

const FALLBACK_POSTER = "/logo.png";

/**
 * Listing card media: static poster by default; video loads only when visible
 * and plays on hover (saves bandwidth vs autoplay on every card).
 */
export function ProductCardMedia({
  product,
  alt,
}: {
  product: {
    slug: string;
    images?: string[] | null;
    video?: string | null;
    category?: { slug?: string } | null;
  };
  alt: string;
}) {
  const poster = productPosterSrc(product);
  const [posterSrc, setPosterSrc] = useState(poster);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !product.video || !visible) return;
    if (hovering) {
      void video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [hovering, product.video, visible]);

  const onPosterError = useCallback(() => {
    setPosterSrc(FALLBACK_POSTER);
  }, []);

  const showVideo = Boolean(product.video && visible && hovering);

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Image
        src={posterSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${showVideo ? "opacity-0" : "opacity-100"}`}
        onError={onPosterError}
      />
      {product.video && visible && (
        <video
          ref={videoRef}
          src={product.video}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:scale-105 ${showVideo ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden={!showVideo}
        />
      )}
    </div>
  );
}
