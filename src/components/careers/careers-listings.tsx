"use client"

import { useState } from "react"
import { ChevronDown, MapPin, Briefcase, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type DbJobListing = {
  id: string
  title: string
  location: string
  type: string
  description: string
  requirements: string | null
}

interface CareersListingsProps {
  jobs: DbJobListing[]
  onApply: (jobId: string, jobTitle: string) => void
}

export function CareersListings({ jobs, onApply }: CareersListingsProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section
      className="py-12 sm:py-16 section-blob-purple"
      style={{ background: "linear-gradient(135deg, #f5f0f9 0%, #f8f5fc 100%)" }}
      aria-labelledby="openings-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="openings-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 text-center"
        >
          Current Openings
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
          Browse our available positions and take the first step towards a meaningful career.
        </p>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-purple-100 mb-4">
              <Briefcase className="size-8 text-[#620E87]/50" aria-hidden="true" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No open positions right now.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon — we&apos;re always growing!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isOpen = openId === job.id
              const requirements = job.requirements
                ? job.requirements.split("\n").filter(Boolean)
                : []
              return (
                <Card key={job.id} className="overflow-hidden transition-colors glass-card">
                  {/* Summary row — always visible */}
                  <button
                    type="button"
                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 bg-white/80 hover:bg-purple-50/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87] focus-visible:ring-inset"
                    onClick={() => toggle(job.id)}
                    aria-expanded={isOpen}
                    aria-controls={`job-details-${job.id}`}
                    id={`job-trigger-${job.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="size-3.5" aria-hidden="true" />
                          {job.location}
                        </span>
                        <Badge className="text-xs bg-purple-100 text-[#620E87] border-[#620E87]/20 hover:bg-purple-100">
                          <Briefcase className="size-3 mr-1" aria-hidden="true" />
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                    <ChevronDown
                      className={`size-5 shrink-0 text-[#620E87] mt-1 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Expanded details */}
                  <div
                    id={`job-details-${job.id}`}
                    role="region"
                    aria-labelledby={`job-trigger-${job.id}`}
                    hidden={!isOpen}
                  >
                    <CardContent className="pt-0 pb-6 px-6 border-t border-gray-100 bg-gray-50/50">
                      <p className="text-gray-600 text-sm leading-relaxed mt-5 mb-4">
                        {job.description}
                      </p>
                      {requirements.length > 0 && (
                        <>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                          <ul className="space-y-1.5 mb-6" role="list">
                            {requirements.map((req) => (
                              <li key={req} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle
                                  className="size-4 text-[#89C541] mt-0.5 shrink-0"
                                  aria-hidden="true"
                                />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <Button
                        className="bg-[#620E87] hover:bg-[#4a0b66] text-white border-0 font-semibold"
                        onClick={() => onApply(job.id, job.title)}
                        aria-label={`Apply for ${job.title}`}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
