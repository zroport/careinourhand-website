// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import Link from "next/link"
import { LegalHero } from "@/components/legal/legal-hero"
import { getSiteSettings, setting } from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "Privacy Policy | Care In Our Hand",
  description:
    "Read the Privacy Policy for Care In Our Hand. We handle all personal and sensitive information in accordance with the Australian Privacy Act 1988 and the NDIS Practice Standards.",
}

const sections = [
  {
    id: "introduction",
    heading: "Introduction",
    content:
      "Care In Our Hand is committed to protecting the privacy and confidentiality of all personal and sensitive information we collect. This Privacy Policy outlines how we collect, use, store, and disclose your information in accordance with the Australian Privacy Act 1988 (Cth), the Australian Privacy Principles (APPs), and the NDIS Practice Standards.",
  },
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    content:
      "We may collect the following types of information: personal details (name, address, phone number, email), NDIS participant information (NDIS number, plan details, management type), health and disability information relevant to service delivery, emergency contact details, feedback and complaint records, and website usage data through privacy-friendly analytics.",
  },
  {
    id: "how-we-collect",
    heading: "How We Collect Information",
    content:
      "We collect information directly from you through our website forms (referral, booking, contact, feedback), phone and email communications, service agreements and intake processes, and through your Support Coordinator or Plan Manager with your consent.",
  },
  {
    id: "how-we-use",
    heading: "How We Use Your Information",
    content:
      "Your information is used to deliver and coordinate NDIS support services, communicate with you about your care, process referrals and bookings, comply with NDIS reporting requirements, improve our services based on feedback, and respond to complaints and inquiries.",
  },
  {
    id: "data-storage",
    heading: "Data Storage & Security",
    content:
      "All personal and sensitive information is stored securely on Australian-based servers. We implement appropriate technical and organisational measures to protect your information against unauthorised access, loss, or misuse. Access to participant data is restricted to authorised staff only.",
  },
  {
    id: "disclosure",
    heading: "Disclosure of Information",
    content:
      "We will not sell or rent your personal information to third parties. We may share your information with other NDIS providers involved in your care (with your consent), government agencies as required by law (such as the NDIS Commission), and our professional advisors (accountants, lawyers) under strict confidentiality obligations.",
  },
  {
    id: "your-rights",
    heading: "Your Rights",
    content:
      "Under the Australian Privacy Principles, you have the right to access the personal information we hold about you, request corrections to inaccurate information, request deletion of your information (subject to legal obligations), withdraw consent for data collection at any time, and lodge a complaint about how we handle your information.",
  },
  {
    id: "cookies",
    heading: "Cookies & Website Analytics",
    content:
      "Our website uses privacy-friendly analytics (Plausible) that do not use cookies or track personal information. We do not use Google Analytics or any tracking tools that create user profiles.",
  },
  {
    id: "childrens-privacy",
    heading: "Children's Privacy",
    content:
      "We are committed to protecting the privacy of children and young people. We will only collect information about minors with the consent of their parent, guardian, or authorised representative.",
  },
  {
    id: "changes",
    heading: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.",
  },
]

export default async function PrivacyPage() {
  const s = await getSiteSettings()
  const phone = setting(s, "phone", "1300 XXX XXX")

  const contactSection = {
    id: "contact",
    heading: "Contact Us",
    content: null,
    customContent: (
      <>
        If you have questions about this Privacy Policy or wish to make a privacy-related complaint,
        please contact us:
        <br />
        <br />
        <strong>Privacy Officer, Care In Our Hand</strong>
        <br />
        15 Gribbin Road, Leppington NSW 2179
        <br />
        Email:{" "}
        <a
          href="mailto:privacy@careinourhand.com.au"
          className="text-[#620E87] underline underline-offset-2 hover:text-[#4a0b66] transition-colors"
        >
          privacy@careinourhand.com.au
        </a>
        <br />
        Phone: {phone}
        <br />
        <br />
        You may also contact the Office of the Australian Information Commissioner (OAIC) at{" "}
        <a
          href="https://www.oaic.gov.au"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#620E87] underline underline-offset-2 hover:text-[#4a0b66] transition-colors"
        >
          oaic.gov.au
        </a>{" "}
        if you believe we have breached your privacy.
      </>
    ),
  }
  const allSections = [...sections, contactSection]
  return (
    <>
      <LegalHero
        heading="Privacy Policy"
        lastUpdated="Last updated: April 2026"
        breadcrumbLabel="Privacy Policy"
      />

      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sections */}
          <div className="space-y-10">
            {allSections.map((section) => (
              <section key={section.id} aria-labelledby={`privacy-${section.id}`}>
                <h2
                  id={`privacy-${section.id}`}
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
