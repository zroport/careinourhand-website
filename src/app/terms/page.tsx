// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import Link from "next/link"
import { LegalHero } from "@/components/legal/legal-hero"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Care In Our Hand",
  description:
    "Read the Terms of Service for Care In Our Hand, an NDIS registered disability support provider in South-West Sydney.",
}

const sections = [
  {
    id: "agreement",
    heading: "Agreement to Terms",
    content:
      "By accessing and using the Care In Our Hand website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.",
  },
  {
    id: "our-services",
    heading: "Our Services",
    content:
      "Care In Our Hand is a registered NDIS provider offering disability support services in the Sydney metropolitan area. Our services are delivered in accordance with the NDIS Act 2013, the NDIS Practice Standards, and the NDIS Code of Conduct.",
  },
  {
    id: "ndis-pricing",
    heading: "NDIS Pricing",
    content:
      "All services are priced in accordance with the current NDIS Price Guide published by the NDIA. We do not charge above the price limits set by the NDIS Price Guide. Any changes to pricing will be communicated to participants in advance.",
  },
  {
    id: "service-agreements",
    heading: "Service Agreements",
    content:
      "Before commencing services, all participants will be provided with a Service Agreement that outlines the agreed supports, pricing, cancellation policies, and responsibilities of both parties. Services will only commence once a signed Service Agreement is in place.",
  },
  {
    id: "cancellations",
    heading: "Cancellations",
    content:
      "Cancellations must be made with at least 48 hours' notice. Short-notice cancellations or no-shows may be charged at up to 100% of the agreed service rate, in accordance with the NDIS Price Guide cancellation policy.",
  },
  {
    id: "privacy",
    heading: "Privacy & Data Collection",
    content: null,
    customContent: (
      <>
        We collect and handle personal and sensitive information in accordance with the Australian Privacy Act 1988 and the NDIS Practice Standards. Please refer to our{" "}
        <Link href="/privacy" className="text-[#620E87] underline underline-offset-2 hover:text-[#4a0b66] transition-colors">
          Privacy Policy
        </Link>{" "}
        for detailed information on how we collect, use, and protect your data.
      </>
    ),
  },
  {
    id: "complaints",
    heading: "Feedback & Complaints",
    content:
      "We welcome feedback and take all complaints seriously. Complaints can be submitted through our website, by phone, or in person. All complaints are handled in accordance with the NDIS Quality and Safeguards Commission guidelines. If you are not satisfied with our resolution, you may contact the NDIS Commission directly.",
  },
  {
    id: "liability",
    heading: "Limitation of Liability",
    content:
      "While we strive to provide accurate and up-to-date information on this website, Care In Our Hand makes no warranties or representations about the completeness or accuracy of the content. This website is for informational purposes only and does not constitute medical, legal, or financial advice.",
  },
  {
    id: "changes",
    heading: "Changes to Terms",
    content:
      "We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the revised terms.",
  },
  {
    id: "contact",
    heading: "Contact",
    content:
      "If you have any questions about these Terms of Service, please contact us at info@careinourhand.com.au or call 1300 XXX XXX.",
  },
]

export default function TermsPage() {
  return (
    <>
      <LegalHero
        heading="Terms of Service"
        lastUpdated="Last updated: April 2026"
        breadcrumbLabel="Terms of Service"
      />

      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Draft callout */}
          <div
            className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5 mb-10"
            role="note"
            aria-label="Draft notice"
          >
            <AlertCircle
              className="size-5 text-amber-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-amber-800 leading-relaxed">
              These Terms of Service are a draft template. Care In Our Hand will update these with
              finalised legal terms. Please{" "}
              <Link
                href="/contact"
                className="font-semibold underline underline-offset-2 hover:text-amber-900 transition-colors"
              >
                contact us
              </Link>{" "}
              if you have any questions.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`terms-${section.id}`}>
                <h2
                  id={`terms-${section.id}`}
                  className="text-xl sm:text-2xl font-bold text-gray-900 mb-3"
                >
                  {section.heading}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.customContent ?? section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
