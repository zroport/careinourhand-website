// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { AboutPreview } from "@/components/home/about-preview";
import { ServicesGrid } from "@/components/home/services-grid";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { CtaBanner } from "@/components/home/cta-banner";

export const metadata: Metadata = {
  title: "Care In Our Hand | NDIS Provider Sydney",
  description:
    "Care In Our Hand is an NDIS registered disability support provider based in Leppington, NSW. Compassionate, culturally responsive support across Sydney — helping you live life on your terms.",
  keywords: [
    "NDIS provider Sydney",
    "disability support Sydney",
    "NDIS registered",
    "care services Leppington",
    "NDIS support worker",
    "culturally responsive care",
  ],
};

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AboutPreview />
      <ServicesGrid />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
