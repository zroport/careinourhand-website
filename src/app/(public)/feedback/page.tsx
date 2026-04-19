// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { FeedbackHero } from "@/components/feedback/feedback-hero"
import { FeedbackProcess } from "@/components/feedback/feedback-process"
import { FeedbackForm } from "@/components/feedback/feedback-form"
import { FeedbackOtherWays } from "@/components/feedback/feedback-other-ways"
import { getPageHeader } from "@/lib/page-header"

export const metadata: Metadata = {
  title: "Feedback & Complaints | Care In Our Hand",
  description:
    "Share your compliments, suggestions, or complaints with Care In Our Hand. All feedback is treated with respect and confidentiality in line with NDIS Quality and Safeguards requirements.",
}

export default async function FeedbackPage() {
  const pageHeader = await getPageHeader("feedback");
  return (
    <>
      <FeedbackHero pageHeader={pageHeader} />
      <FeedbackProcess />
      <section
        className="py-12 section-blob-green"
        style={{ background: 'linear-gradient(135deg, #f5faf0 0%, #ffffff 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeedbackForm />
        </div>
      </section>
      <FeedbackOtherWays />
    </>
  )
}
