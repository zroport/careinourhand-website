import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, ClipboardList } from "lucide-react"

export function FaqCta() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="faq-cta-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="faq-cta-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Still Have Questions?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Can&apos;t find what you&apos;re looking for? Our friendly team is happy to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[#620E87] hover:bg-[#4a0b66] text-white border-0 font-semibold"
            asChild
          >
            <Link href="/contact">
              <MessageCircle className="size-4 mr-2" aria-hidden="true" />
              Contact Us
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0"
            asChild
          >
            <Link href="/referral">
              <ClipboardList className="size-4 mr-2" aria-hidden="true" />
              Submit a Referral
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
