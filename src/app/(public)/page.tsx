// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/hero-slider";
import { TrustBar } from "@/components/home/trust-bar";
import { AboutPreview } from "@/components/home/about-preview";
import { ServicesGrid } from "@/components/home/services-grid";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { CtaBanner } from "@/components/home/cta-banner";
import { getPageContent } from "@/lib/page-content";

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

async function getHeroSlides() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch {
    // Table may not exist yet — run `npx prisma db push` to create it.
    return [];
  }
}

export default async function Home() {
  const [slides, content] = await Promise.all([
    getHeroSlides(),
    getPageContent("home"),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />
      <TrustBar />
      <AboutPreview />
      <ServicesGrid />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner heading={content.cta?.heading} body={content.cta?.body} />
    </>
  );
}
