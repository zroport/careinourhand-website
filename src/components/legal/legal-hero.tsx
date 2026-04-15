import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface LegalHeroProps {
  heading: string
  lastUpdated: string
  breadcrumbLabel: string
}

export function LegalHero({ heading, lastUpdated, breadcrumbLabel }: LegalHeroProps) {
  return (
    <section
      className="relative overflow-hidden py-14 sm:py-18"
      style={{
        background:
          "linear-gradient(135deg, #8b1ab8 0%, #a02ed4 50%, #b84de0 100%)",
      }}
      aria-labelledby="legal-hero-heading"
    >
      {/* Decorative background elements */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 size-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 size-[280px] rounded-full bg-[#620E87]/30 blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

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
            {breadcrumbLabel}
          </span>
        </nav>

        <h1
          id="legal-hero-heading"
          className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4 max-w-2xl"
        >
          {heading}
        </h1>

        <p className="text-purple-200 text-sm">{lastUpdated}</p>
      </div>
    </section>
  )
}
