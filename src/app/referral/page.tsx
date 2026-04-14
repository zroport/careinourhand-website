import type { Metadata } from "next"
import { ReferralPageHero } from "@/components/referral/page-hero"
import { ReferralForm } from "@/components/referral/referral-form"

export const metadata: Metadata = {
  title: "Submit a Referral | Care In Our Hand",
  description:
    "Submit a referral for NDIS participants. For Support Coordinators and families — our team will respond within 24 hours.",
  keywords: [
    "NDIS referral",
    "support coordinator referral",
    "Care In Our Hand referral",
    "NDIS participant referral Sydney",
  ],
}

export default function ReferralPage() {
  return (
    <>
      <ReferralPageHero />
      <section className="py-12 sm:py-16 bg-gray-50/50" aria-label="Referral form">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReferralForm />
        </div>
      </section>
    </>
  )
}
