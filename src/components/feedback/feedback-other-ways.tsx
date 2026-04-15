import { Phone, Mail, MapPin, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeedbackOtherWays() {
  return (
    <section className="py-12 bg-gray-50" aria-labelledby="other-ways-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="other-ways-heading" className="sr-only">
          Other ways to provide feedback and external complaints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Other ways */}
          <Card className="glass-card">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">
                Other Ways to Provide Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <a
                href="tel:1300XXXXXX"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#620E87] transition-colors group"
                aria-label="Call us on 1300 XXX XXX"
              >
                <span className="flex items-center justify-center size-9 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors shrink-0">
                  <Phone className="size-4 text-[#620E87]" aria-hidden="true" />
                </span>
                <span>1300 XXX XXX</span>
              </a>
              <a
                href="mailto:feedback@careinourhand.com.au"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#620E87] transition-colors group"
                aria-label="Email feedback@careinourhand.com.au"
              >
                <span className="flex items-center justify-center size-9 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors shrink-0">
                  <Mail className="size-4 text-[#620E87]" aria-hidden="true" />
                </span>
                <span>feedback@careinourhand.com.au</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <span className="flex items-center justify-center size-9 rounded-full bg-purple-100 shrink-0 mt-0.5">
                  <MapPin className="size-4 text-[#620E87]" aria-hidden="true" />
                </span>
                <span>
                  In person: 15 Gribbin Road,
                  <br />
                  Leppington NSW 2179
                </span>
              </div>
            </CardContent>
          </Card>

          {/* External complaints */}
          <Card
            className="glass-card"
            style={{ background: "rgba(255, 251, 235, 0.78)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <CardHeader className="border-b border-amber-200/60 pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">
                External Complaints
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                If you&apos;re not satisfied with how we&apos;ve handled your complaint, you can
                contact the NDIS Quality and Safeguards Commission:
              </p>
              <div className="space-y-3">
                <a
                  href="tel:1800035544"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#620E87] transition-colors group"
                  aria-label="Call NDIS Commission on 1800 035 544"
                >
                  <span className="flex items-center justify-center size-9 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors shrink-0">
                    <Phone className="size-4 text-amber-700" aria-hidden="true" />
                  </span>
                  <span>1800 035 544</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center justify-center size-9 rounded-full bg-amber-100 shrink-0">
                    <ExternalLink className="size-4 text-amber-700" aria-hidden="true" />
                  </span>
                  <span>ndiscommission.gov.au</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
