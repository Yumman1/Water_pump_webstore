import { noIndexMetadata } from "@/lib/noindex";

export const metadata = noIndexMetadata("/checkout");

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
