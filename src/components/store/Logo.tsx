import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  textClassName,
  light,
}: {
  className?: string;
  textClassName?: string;
  light?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteConfig.logo}
        alt={siteConfig.name}
        className="h-9 w-9 object-contain"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <span className={cn("text-lg font-bold tracking-tight", light ? "text-white" : "text-brand-700", textClassName)}>
        {siteConfig.name}
      </span>
    </Link>
  );
}
