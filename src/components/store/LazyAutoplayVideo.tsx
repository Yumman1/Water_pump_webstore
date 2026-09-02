"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** Play video only when scrolled into view to save bandwidth and main-thread work. */
export function LazyAutoplayVideo({
  src,
  poster,
  alt,
  className,
  sizes,
}: {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "120px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="relative h-full w-full">
      {inView ? (
        <video
          src={src}
          poster={poster}
          className={className}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      ) : poster ? (
        <Image src={poster} alt={alt} fill sizes={sizes ?? "100vw"} className={className ?? "object-cover"} />
      ) : (
        <div className="h-full w-full bg-gray-200" aria-hidden />
      )}
    </div>
  );
}
