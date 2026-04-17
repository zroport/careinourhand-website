// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { BookingPageHero } from "@/components/booking/page-hero"
import { BookingForm } from "@/components/booking/booking-form"

export const metadata: Metadata = {
  title: "Book an Appointment | Care In Our Hand",
  description:
    "Book a support service appointment with Care In Our Hand. Schedule a time that suits you — we'll confirm within 24 hours.",
  keywords: [
    "book NDIS service",
    "NDIS appointment booking",
    "Care In Our Hand booking",
    "disability support booking Sydney",
  ],
}

export default function BookingPage() {
  return (
    <>
      <BookingPageHero />
      <section className="py-12 sm:py-16 bg-gray-50/50" aria-label="Booking form">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingForm />
        </div>
      </section>
    </>
  )
}
