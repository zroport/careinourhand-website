// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesListingGrid } from "@/components/services/services-listing-grid";
import { ServicesCta } from "@/components/services/services-cta";
import { getPageHeader } from "@/lib/page-header";
import { getPageContent } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "NDIS Services | Care In Our Hand",
  description:
    "Explore our full range of NDIS support services across Sydney — from personal care and community nursing to life skills, transport, and community participation. Person-centred care delivered with full NDIS Price Guide transparency.",
  keywords: [
    "NDIS services Sydney",
    "disability support services",
    "NDIS provider Leppington",
    "personal care NDIS",
    "community nursing NDIS",
    "life skills support",
    "NDIS transport Sydney",
  ],
};

export default async function ServicesPage() {
  const [pageHeader, content] = await Promise.all([
    getPageHeader("services"),
    getPageContent("services"),
  ]);
  return (
    <>
      <ServicesHero pageHeader={pageHeader} />
      <ServicesListingGrid />
      <ServicesCta heading={content.cta?.heading} body={content.cta?.body} />
    </>
  );
}
