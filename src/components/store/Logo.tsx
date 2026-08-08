import Link from "next/link";
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteConfig.logo}
        alt={siteConfig.name}
        className="h-9 w-auto max-w-[160px] object-contain object-left sm:h-10 sm:max-w-[200px]"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </Link>
  );
}
