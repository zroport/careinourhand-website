// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { PageHero } from "@/components/about/page-hero";
import { OurStory } from "@/components/about/our-story";
import { OurValues } from "@/components/about/our-values";
import { StatsBar } from "@/components/about/stats-bar";
import { MeetTheTeam } from "@/components/about/meet-the-team";
import { AboutCta } from "@/components/about/about-cta";
import { getPageHeader } from "@/lib/page-header";

export const metadata: Metadata = {
  title: "About Us | Care In Our Hand",
  description:
    "Learn about Care In Our Hand — an NDIS registered disability support provider in Leppington, NSW. Founded to bring culturally responsive, flexible care to the diverse families of South-West Sydney.",
  keywords: [
    "about Care In Our Hand",
    "NDIS provider Sydney",
    "disability support Leppington",
    "culturally responsive NDIS",
    "South-West Sydney care",
    "NDIS registered provider",
  ],
};

export default async function AboutPage() {
  const pageHeader = await getPageHeader("about");
  return (
    <>
      <PageHero pageHeader={pageHeader} />
      <OurStory />
      <OurValues />
      <StatsBar />
      <MeetTheTeam />
      <AboutCta />
    </>
  );
}
