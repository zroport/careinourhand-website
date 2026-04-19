import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Home } from "lucide-react"

interface ReferralPageHeroProps {
  pageHeader?: {
    heading?: string | null
    subheading?: string | null
    imageUrl?: string | null
  } | null
}

export function ReferralPageHero({ pageHeader }: ReferralPageHeroProps = {}) {
  const heading = pageHeader?.heading
  const subheading =
    pageHeader?.subheading ??
    "For Support Coordinators and families. Submit participant details and our team will respond within 24 hours."
  const imageUrl = pageHeader?.imageUrl

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20"
      aria-labelledby="referral-hero-heading"
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
            Referral Portal
          </span>
        </nav>

        <div className="mb-5">
          <Badge className="bg-white/15 text-white border border-white/25 px-4 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm hover:bg-white/15">
            Referral Portal
          </Badge>
        </div>

        {heading ? (
          <h1
            id="referral-hero-heading"
            className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5 max-w-2xl"
          >
            {heading}
          </h1>
        ) : (
          <h1
            id="referral-hero-heading"
            className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5 max-w-2xl"
          >
            Submit a <span className="text-[#c8e87a]">Referral</span>
          </h1>
        )}

        <p className="text-lg text-purple-100 leading-relaxed max-w-xl">{subheading}</p>
      </div>
    </section>
  )
}
