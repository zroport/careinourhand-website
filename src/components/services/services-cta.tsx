import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function ServicesCta() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20"
      style={{ backgroundColor: "#89C541" }}
      aria-labelledby="services-cta-heading"
    >
      {/* Decorative shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-black/5" />
        <div className="absolute top-1/2 right-1/4 size-32 rounded-full bg-white/10" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/25 mb-6"
          aria-hidden="true"
        >
          <HelpCircle className="size-6 text-gray-900" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h2
          id="services-cta-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
        >
          Not Sure Which Service You Need?
        </h2>

        {/* Subtext */}
        <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Our team can help match you with the right support. Get in touch for a
          free consultation.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold border-0 rounded-xl px-8 h-12 text-base shadow-md transition-all"
            asChild
          >
            <Link href="/contact" aria-label="Contact the Care In Our Hand team">
              Contact Us
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-[#620E87] hover:bg-[#4a0b66] text-white font-semibold border-0 rounded-xl px-8 h-12 text-base shadow-md transition-all"
            asChild
          >
            <Link href="/referral" aria-label="Make a referral for NDIS support">
              Make a Referral
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
