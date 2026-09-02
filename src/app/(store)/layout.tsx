import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { WhatsAppFab } from "@/components/store/WhatsAppFab";
import { GlobalStructuredData } from "@/components/seo/GlobalStructuredData";
import { StoreAnalytics } from "@/components/analytics/StoreAnalytics";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <GlobalStructuredData />
      <StoreAnalytics />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
