import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

interface CtaBannerProps {
  heading?: string
  body?: string
}

export function CtaBanner({
  heading = "Ready to Get Started?",
  body = "Whether you're a participant, family member, or support coordinator, we'd love to hear from you. Let's build your support plan together.",
}: CtaBannerProps) {
  return (
    <section
      className="relative overflow-hidden bg-[#89C541] py-16 sm:py-20"
      aria-labelledby="cta-heading"
    >
      {/* Decorative shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/4 size-32 rounded-full bg-white/5" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/20 mb-6"
          aria-hidden="true"
        >
          <Phone className="size-6 text-gray-900" />
        </div>

        {/* Heading */}
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
        >
          {heading}
        </h2>

        {/* Subtext */}
        <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          {body}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold border-0 rounded-xl px-8 h-12 text-base shadow-md transition-all"
            asChild
          >
            <Link
              href="/contact"
              aria-label="Book a consultation with our team"
            >
              Book a Consultation
              <ArrowRight className="size-4 ml-1" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-[#620E87] hover:bg-[#4e0b6b] active:bg-[#3a0850] text-white font-semibold border-0 rounded-xl px-8 h-12 text-base shadow-md transition-all"
            asChild
          >
            <Link
              href="/referral"
              aria-label="Quick referral — for support coordinators"
            >
              Quick Referral
            </Link>
          </Button>
        </div>

        {/* Reassurance line */}
        <p className="mt-6 text-xs text-gray-700">
          NDIS Registered &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; Fast response guaranteed
        </p>
      </div>
    </section>
  );
}
