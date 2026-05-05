export const dynamic = "force-dynamic"

import { getActiveServiceAreas } from "@/actions/admin/service-area-actions"
import { MapPin } from "lucide-react"

export async function ServiceCoverage() {
  const areas = await getActiveServiceAreas()

  if (areas.length === 0) return null

  return (
    <section
      id="service-areas"
      className="py-12 sm:py-16 section-blob-green"
      style={{ background: "linear-gradient(135deg, #f0f9f0 0%, #fafcf8 100%)" }}
      aria-labelledby="service-areas-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#89C541] uppercase mb-3">
            Coverage
          </span>
          <h2
            id="service-areas-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            Areas We <span className="text-[#620E87]">Serve</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            While our main office is in Leppington, our dedicated team travels to provide care in the following areas:
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {areas.map((area) => (
            <span
              key={area.id}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#89C541]/30 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:border-[#89C541] transition-all duration-200"
            >
              <MapPin className="size-3.5 text-[#89C541] shrink-0" aria-hidden="true" />
              {area.areaName}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
