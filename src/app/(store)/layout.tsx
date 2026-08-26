import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { WhatsAppFab } from "@/components/store/WhatsAppFab";
import { DealPopup } from "@/components/store/DealPopup";
import { GlobalStructuredData } from "@/components/seo/GlobalStructuredData";
import { TikTokPixel } from "@/components/analytics/TikTokPixel";
import { getPromoPopupConfig } from "@/lib/promo";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const promo = await getPromoPopupConfig();

  return (
    <div className="flex min-h-screen flex-col">
      <GlobalStructuredData />
      <TikTokPixel />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
      <DealPopup promo={promo} />
    </div>
  );
}
