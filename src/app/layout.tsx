import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { UserProvider } from "@/components/UserProvider";
import { SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.tagline, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image", site: SITE.twitter },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0e0e11", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <UserProvider>{children}</UserProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
