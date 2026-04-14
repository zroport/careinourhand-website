import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";
import { iconMap, type Service } from "@/data/services";

interface ServiceHeroProps {
  service: Service;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  const Icon = iconMap[service.icon];

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        background:
          "linear-gradient(135deg, #8b1ab8 0%, #a02ed4 40%, #b84de0 70%, #c96deb 100%)",
      }}
      aria-labelledby="service-hero-heading"
    >
      {/* Decorative background shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 size-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-[350px] rounded-full bg-[#620E87]/30 blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -bottom-10 right-0 size-[400px] border-[2px] border-[#89C541]/15 rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="absolute -bottom-10 right-0 size-[280px] border-[2px] border-[#89C541]/10 rounded-full translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-purple-200/80 text-sm mb-8 flex-wrap"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-white transition-colors"
            aria-label="Go to Home page"
          >
            <Home className="size-3.5" aria-hidden="true" />
            Home
          </Link>
          <ChevronRight className="size-3.5 text-purple-300/50" aria-hidden="true" />
          <Link
            href="/services"
            className="hover:text-white transition-colors"
            aria-label="Go to Services page"
          >
            Services
          </Link>
          <ChevronRight className="size-3.5 text-purple-300/50" aria-hidden="true" />
          <span className="text-white font-medium" aria-current="page">
            {service.title}
          </span>
        </nav>

        {/* Icon + Title */}
        <div className="flex items-center gap-5 mb-6">
          <span
            className="flex items-center justify-center size-16 sm:size-20 rounded-2xl shrink-0"
            style={{ backgroundColor: "#89C541" }}
            aria-hidden="true"
          >
            {Icon && (
              <Icon className="size-8 sm:size-10 text-gray-900" aria-hidden="true" />
            )}
          </span>
          <Badge className="bg-white/15 text-white border border-white/25 px-4 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm hover:bg-white/15">
            {service.ndisCategory}
          </Badge>
        </div>

        {/* Heading */}
        <h1
          id="service-hero-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 max-w-3xl"
        >
          {service.title}
        </h1>

        {/* Hero description */}
        <p className="text-lg sm:text-xl text-purple-100 leading-relaxed max-w-2xl mb-8">
          {service.heroDescription}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0 rounded-xl px-8 h-12 text-base shadow-md transition-all"
            asChild
          >
            <Link
              href="/contact"
              aria-label={`Book the ${service.title} service`}
            >
              Book This Service
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent hover:bg-white/10 text-white border-white/40 hover:border-white font-semibold rounded-xl px-8 h-12 text-base transition-all"
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
