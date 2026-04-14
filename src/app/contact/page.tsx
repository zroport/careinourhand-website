import type { Metadata } from "next"
import { ContactPageHero } from "@/components/contact/page-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"

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

export default function ContactPage() {
  return (
    <>
      <ContactPageHero />
      <section className="py-12 sm:py-16 bg-gray-50/50" aria-label="Contact section">
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
