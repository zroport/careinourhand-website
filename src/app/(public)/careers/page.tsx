// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { CareersHero } from "@/components/careers/careers-hero"
import { CareersBenefits } from "@/components/careers/careers-benefits"
import { CareersContainer } from "@/components/careers/careers-container"

export const metadata: Metadata = {
  title: "Careers | Care In Our Hand",
  description:
    "Join the Care In Our Hand team. We're hiring compassionate support workers and registered nurses across South-West Sydney. View current openings and apply today.",
}

export default async function CareersPage() {
  const activeJobs = await prisma.jobListing.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      location: true,
      type: true,
      description: true,
      requirements: true,
    },
  })

  return (
    <>
      <CareersHero />
      <CareersBenefits />
      <CareersContainer jobs={activeJobs} />
    </>
  )
}
