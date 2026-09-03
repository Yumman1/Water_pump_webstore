import { siteConfig } from "@/config/site";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const SOCIAL = [
  { key: "facebook", label: "Facebook", href: siteConfig.social.facebook, Icon: Icons.facebook },
  { key: "instagram", label: "Instagram", href: siteConfig.social.instagram, Icon: Icons.instagram },
  { key: "tiktok", label: "TikTok", href: siteConfig.social.tiktok, Icon: Icons.tiktok },
] as const;

type SocialLinksProps = {
  variant?: "footer" | "contact";
  className?: string;
};

export function SocialLinks({ variant = "footer", className }: SocialLinksProps) {
  const isFooter = variant === "footer";

  return (
    <div className={cn(isFooter ? "mt-4" : "", className)}>
      {!isFooter && <p className="font-semibold text-gray-900">Follow us</p>}
      <div className={cn("flex gap-3", isFooter ? "" : "mt-3")}>
        {SOCIAL.map(({ key, label, href, Icon }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center transition-colors",
              isFooter
                ? "h-10 w-10 rounded-full bg-gray-800 text-gray-300 hover:bg-brand-600 hover:text-white"
                : "h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-600"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
