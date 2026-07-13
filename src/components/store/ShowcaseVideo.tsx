"use client";

import { useState } from "react";
import Image from "next/image";

type Clip = { title: string; description: string; src: string; poster: string };

/** A video card that shows a poster with a play button, then plays inline on click. */
export function ShowcaseVideo({ clip }: { clip: Clip }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl border bg-white">
      <div className="relative aspect-video bg-gray-900">
        {playing ? (
          <video
            src={clip.src}
            poster={clip.poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 h-full w-full"
            aria-label={`Play ${clip.title}`}
          >
            <Image src={clip.poster} alt={clip.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 text-brand-700" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{clip.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{clip.description}</p>
      </div>
    </div>
  );
}
