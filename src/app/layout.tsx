import type { Metadata } from "next";
import "./globals.css";
import { getLogos } from "@/lib/logos";

export const metadata: Metadata = {
  title: {
    template: "%s | Care In Our Hand",
    default: "Care In Our Hand | NDIS Provider Sydney",
  },
  description:
    "Care In Our Hand is an NDIS registered disability support provider based in Leppington, NSW. Compassionate, culturally responsive support across Sydney.",
  metadataBase: new URL("https://careinourhand.com.au"),
  openGraph: {
    siteName: "Care In Our Hand",
    locale: "en_AU",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logos = await getLogos();
  const faviconUrl = logos?.faviconUrl ?? "/favicon.ico";

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href={faviconUrl} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
