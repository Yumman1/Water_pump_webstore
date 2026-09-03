import { noIndexMetadata } from "@/lib/noindex";

export const metadata = noIndexMetadata("/order-success");

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
