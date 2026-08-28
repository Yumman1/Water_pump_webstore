import Image from "next/image";
import { productCoverMedia } from "@/lib/utils";
import type { Product } from "@/lib/types";

type Props = {
  product: Pick<Product, "images" | "video" | "name">;
  className?: string;
};

/** Admin list thumbnail — shows cover photo or looping video preview. */
export function AdminProductThumb({ product, className = "h-10 w-10" }: Props) {
  const cover = productCoverMedia(product);

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-gray-100 ${className}`}>
      {cover?.type === "video" ? (
        <video
          src={cover.src}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          aria-label={`${product.name} video`}
        />
      ) : cover?.type === "image" ? (
        <Image src={cover.src} alt="" fill sizes="40px" className="object-cover" />
      ) : null}
    </div>
  );
}
