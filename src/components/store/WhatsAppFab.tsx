import { siteConfig } from "@/config/site";
import { Icons } from "@/components/ui/icons";

export function WhatsAppFab() {
  let number = siteConfig.contact.whatsapp.replace(/[^0-9]/g, "");
  if (number.startsWith("0")) number = "92" + number.slice(1);
  if (!number) return null;
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="animate-float fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110"
    >
      <Icons.whatsapp className="h-7 w-7" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
