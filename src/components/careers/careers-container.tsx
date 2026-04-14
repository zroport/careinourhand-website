"use client"

import { useRef, useState } from "react"
import { CareersListings } from "./careers-listings"
import { CareersApplyForm } from "./careers-apply-form"

export function CareersContainer() {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined)
  const formRef = useRef<HTMLElement>(null)

  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId)
    // Give React a tick to re-render with the new value, then scroll
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  return (
    <>
      <CareersListings onApply={handleApply} />
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CareersApplyForm ref={formRef} preselectedJobId={selectedJobId} />
        </div>
      </section>
    </>
  )
}
