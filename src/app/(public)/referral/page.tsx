// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { ReferralPageHero } from "@/components/referral/page-hero"
import { ReferralForm } from "@/components/referral/referral-form"
import { getPageHeader } from "@/lib/page-header"

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

export default async function ReferralPage() {
  const pageHeader = await getPageHeader("referral");
  return (
    <>
      <ReferralPageHero pageHeader={pageHeader} />
      <section className="py-12 sm:py-16 bg-gray-50/50" aria-label="Referral form">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReferralForm />
        </div>
      </section>
    </>
  )
}
