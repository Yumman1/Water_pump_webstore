import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { WhatsAppFab } from "@/components/store/WhatsAppFab";
import { DealPopup } from "@/components/store/DealPopup";
import { getPromoPopupConfig } from "@/lib/promo";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const promo = await getPromoPopupConfig();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
      <DealPopup promo={promo} />
    </div>
  );
}
