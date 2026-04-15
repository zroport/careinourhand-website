// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { FeedbackHero } from "@/components/feedback/feedback-hero"
import { FeedbackProcess } from "@/components/feedback/feedback-process"
import { FeedbackForm } from "@/components/feedback/feedback-form"
import { FeedbackOtherWays } from "@/components/feedback/feedback-other-ways"

export const metadata: Metadata = {
  title: "Feedback & Complaints | Care In Our Hand",
  description:
    "Share your compliments, suggestions, or complaints with Care In Our Hand. All feedback is treated with respect and confidentiality in line with NDIS Quality and Safeguards requirements.",
}

export default function FeedbackPage() {
  return (
    <>
      <FeedbackHero />
      <FeedbackProcess />
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeedbackForm />
        </div>
      </section>
      <FeedbackOtherWays />
    </>
  )
}
