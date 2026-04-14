import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function AboutCta() {
  return (
    <section
      className="relative overflow-hidden bg-[#620E87] py-16 sm:py-20"
      aria-labelledby="about-cta-heading"
    >
      {/* Decorative shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-[#4a0b66]/60" />
        <div className="absolute top-1/2 right-1/4 size-32 rounded-full bg-white/5" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/15 mb-6"
          aria-hidden="true"
        >
          <MessageCircle className="size-6 text-white" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h2
          id="about-cta-heading"
          className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
        >
          Want to Know More?
        </h2>

        {/* Subtext */}
        <p className="text-purple-200 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          We&apos;d love to tell you more about how we can support you or your
          loved one.
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
            className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0 rounded-xl px-8 h-12 text-base shadow-md transition-all"
            asChild
          >
            <Link href="/services" aria-label="View our range of NDIS services">
              View Our Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
