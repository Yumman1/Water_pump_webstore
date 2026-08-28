"use client";

import { productCoverMedia } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductMediaPreview({ product }: { product: Product }) {
  const cover = productCoverMedia(product);
  const photos = product.images ?? [];

  if (!cover && photos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        No media yet. Upload photos or add a video URL below.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">Current cover preview</p>
      <div className="relative aspect-video max-w-xs overflow-hidden rounded-lg border bg-gray-100">
        {cover?.type === "video" ? (
          <video
            src={cover.src}
            className="h-full w-full object-cover"
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
          />
        ) : cover?.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.src} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <p className="text-xs text-gray-400">
        {cover?.type === "video"
          ? "Cover video (shown on shop cards and product page)."
          : "Cover photo (first image in list)."}
        {photos.length > 1 && ` ${photos.length} photos total.`}
      </p>
    </div>
  );
}
