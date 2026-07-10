import { siteConfig } from "@/config/site";
import { Icons } from "@/components/ui/icons";

export function WhatsAppFab() {
  const number = siteConfig.contact.whatsapp.replace(/[^0-9]/g, "");
  if (!number) return null;
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-105"
    >
      <Icons.whatsapp className="h-7 w-7" />
    </a>
  );
}
