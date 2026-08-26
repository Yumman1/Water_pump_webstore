import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
