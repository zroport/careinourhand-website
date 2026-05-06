// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { FaqHero } from "@/components/faq/faq-hero"
import { FaqAccordion } from "@/components/faq/faq-accordion"
import { FaqCta } from "@/components/faq/faq-cta"
import { getPageHeader } from "@/lib/page-header"
import { getPageContent } from "@/lib/page-content"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "FAQ | Care In Our Hand",
  description:
    "Find answers to common questions about Care In Our Hand's NDIS services, pricing, eligibility, and how to get started as a participant.",
}

export default async function FaqPage() {
  const [pageHeader, content, faqs] = await Promise.all([
    getPageHeader("faq"),
    getPageContent("faq"),
    prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);
  return (
    <>
      <FaqHero pageHeader={pageHeader} />
      <FaqAccordion faqs={faqs} />
      <FaqCta heading={content.cta?.heading} body={content.cta?.body} />
    </>
  )
}
