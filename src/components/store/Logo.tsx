"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
}: {
  className?: string;
  /** Kept for call-site compatibility; wordmark is in the image. */
  textClassName?: string;
  /** Kept for call-site compatibility; wordmark is in the image. */
  light?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center", className)} aria-label={siteConfig.name}>
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        width={221}
        height={60}
        priority
        className="h-9 w-auto max-w-[160px] object-contain object-left sm:h-10 sm:max-w-[200px]"
      />
    </Link>
  );
}
