import type { Metadata } from "next"
import { CareersHero } from "@/components/careers/careers-hero"
import { CareersBenefits } from "@/components/careers/careers-benefits"
import { CareersContainer } from "@/components/careers/careers-container"
import { CareersCta } from "@/components/careers/careers-cta"

export const metadata: Metadata = {
  title: "Careers | Care In Our Hand",
  description:
    "Join the Care In Our Hand team. We're hiring compassionate support workers and registered nurses across South-West Sydney. View current openings and apply today.",
}

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <CareersBenefits />
      <CareersContainer />
      <CareersCta />
    </>
  )
}
