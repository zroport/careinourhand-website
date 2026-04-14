import type { Metadata } from "next"
import { FaqHero } from "@/components/faq/faq-hero"
import { FaqAccordion } from "@/components/faq/faq-accordion"
import { FaqCta } from "@/components/faq/faq-cta"

export const metadata: Metadata = {
  title: "FAQ | Care In Our Hand",
  description:
    "Find answers to common questions about Care In Our Hand's NDIS services, pricing, eligibility, and how to get started as a participant.",
}

export default function FaqPage() {
  return (
    <>
      <FaqHero />
      <FaqAccordion />
      <FaqCta />
    </>
  )
}
