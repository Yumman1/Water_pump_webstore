"use client";

import Image from "next/image";
import { realImages } from "@/lib/utils";
import { LazyAutoplayVideo } from "./LazyAutoplayVideo";

/** Product card cover: static image by default; video plays only in viewport. */
export function ProductCardMedia({
  productName,
  video,
  images,
}: {
  productName: string;
  video?: string | null;
  images?: string[] | null;
}) {
  const poster = realImages(images)[0];

  if (video) {
    return (
      <LazyAutoplayVideo
        src={video}
        poster={poster}
        alt={productName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    );
  }

  if (poster) {
    return (
      <Image
        src={poster}
        alt={productName}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  return null;
}
