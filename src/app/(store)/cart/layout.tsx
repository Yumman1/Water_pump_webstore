import { noIndexMetadata } from "@/lib/noindex";

export const metadata = noIndexMetadata("/cart");

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
