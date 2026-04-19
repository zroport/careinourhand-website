import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Home } from "lucide-react";

interface ServicesHeroProps {
  pageHeader?: {
    heading?: string | null;
    subheading?: string | null;
    imageUrl?: string | null;
  } | null;
}

export function ServicesHero({ pageHeader }: ServicesHeroProps = {}) {
  const heading = pageHeader?.heading;
  const subheading =
    pageHeader?.subheading ??
    "Comprehensive, person-centred disability support services across Sydney. Every service is delivered according to the NDIS Price Guide with full transparency.";
  const imageUrl = pageHeader?.imageUrl;

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="services-hero-heading"
    >
      {imageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(98, 14, 135, 0.6)" }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #8b1ab8 0%, #a02ed4 40%, #b84de0 70%, #c96deb 100%)",
          }}
          aria-hidden="true"
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
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-purple-200/80 text-sm mb-8"
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
          <span className="text-white font-medium" aria-current="page">
            Services
          </span>
        </nav>

        <div className="mb-5">
          <Badge className="bg-white/15 text-white border border-white/25 px-4 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm hover:bg-white/15">
            Our Services
          </Badge>
        </div>

        {heading ? (
          <h1
            id="services-hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 max-w-3xl"
          >
            {heading}
          </h1>
        ) : (
          <h1
            id="services-hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 max-w-3xl"
          >
            NDIS Support{" "}
            <span className="text-[#c8e87a]">Services</span>
          </h1>
        )}

        <p className="text-lg sm:text-xl text-purple-100 leading-relaxed max-w-2xl">
          {subheading}
        </p>
      </div>
    </section>
  );
}
