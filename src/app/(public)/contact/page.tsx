// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { ContactPageHero } from "@/components/contact/page-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { getPageHeader } from "@/lib/page-header"

export const metadata: Metadata = {
  title: "Contact Us | Care In Our Hand",
  description:
    "Get in touch with Care In Our Hand. Have a question, want to learn about our NDIS services, or need support? We'd love to hear from you.",
  keywords: [
    "contact Care In Our Hand",
    "NDIS provider contact",
    "disability support enquiry Sydney",
    "Care In Our Hand email phone",
  ],
}

export default async function ContactPage() {
  const pageHeader = await getPageHeader("contact");
  return (
    <>
      <ContactPageHero pageHeader={pageHeader} />
      <section
        className="py-12 sm:py-16 section-blob-both"
        style={{ background: 'linear-gradient(135deg, #f8f5fc 0%, #ffffff 50%, #f5faf0 100%)' }}
        aria-label="Contact section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
