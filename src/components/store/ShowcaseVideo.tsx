"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Clip = { title: string; description: string; src: string; poster?: string };

/** Showcase card with a muted looping video loaded only when in viewport. */
export function ShowcaseVideo({ clip }: { clip: Clip }) {
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
      { rootMargin: "160px", threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="card-hover group overflow-hidden rounded-xl border bg-white">
      <div ref={rootRef} className="relative aspect-video overflow-hidden bg-gray-900">
        {inView ? (
          <video
            src={clip.src}
            poster={clip.poster}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={clip.title}
          />
        ) : clip.poster ? (
          <Image
            src={clip.poster}
            alt={clip.title}
            fill
            sizes="(max-width:640px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-sm text-gray-400">
            {clip.title}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{clip.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{clip.description}</p>
      </div>
    </div>
  );
}
