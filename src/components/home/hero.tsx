import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#620E87] min-h-[88vh] flex items-center"
      aria-label="Hero section"
    >
      {/* Decorative background shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large soft circle top-right */}
        <div className="absolute -top-32 -right-32 size-[600px] rounded-full bg-[#7d1aab]/40 blur-3xl" />
        {/* Small circle bottom-left */}
        <div className="absolute -bottom-20 -left-20 size-[400px] rounded-full bg-[#4a0b66]/60 blur-2xl" />
        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Green accent arc */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] border-[3px] border-[#89C541]/20 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] border-[2px] border-[#89C541]/15 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-[#89C541]" aria-hidden="true" />
            NDIS Registered Provider · Sydney, NSW
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Your Life,{" "}
            <span className="relative inline-block">
              <span className="text-[#89C541]">In Caring Hands.</span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#89C541]/50 rounded-full"
              />
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-purple-100 leading-relaxed mb-10 max-w-2xl">
            Providing compassionate, culturally responsive NDIS support services
            across Sydney. We&apos;re here to help you live life on your terms.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#620E87] font-semibold transition-all rounded-xl px-8 h-12 text-base"
              asChild
            >
              <Link href="/services" aria-label="View our NDIS services">
                Our Services
                <ArrowRight className="size-4 ml-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0 rounded-xl px-8 h-12 text-base transition-all shadow-lg shadow-[#89C541]/30"
              asChild
            >
              <Link href="/referral" aria-label="Make a referral for NDIS support">
                Make a Referral
              </Link>
            </Button>
          </div>

          {/* Quick social proof */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-purple-200 text-sm">
            <span className="flex items-center gap-2">
              <span className="size-1.5 bg-[#89C541] rounded-full" aria-hidden="true" />
              Culturally Responsive Care
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 bg-[#89C541] rounded-full" aria-hidden="true" />
              South-West Sydney Based
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 bg-[#89C541] rounded-full" aria-hidden="true" />
              24/7 Support Available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
