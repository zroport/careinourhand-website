"use client"

import { Button } from "@/components/ui/button"

interface CareersCTAProps {
  onGeneralApply: () => void
  hasJobs: boolean
}

export function CareersCta({ onGeneralApply, hasJobs }: CareersCTAProps) {
  return (
    <section
      className="py-12 sm:py-16 bg-gray-50"
      aria-labelledby="careers-cta-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="careers-cta-heading"
          className={
            hasJobs
              ? "text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              : "text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          }
        >
          Don&apos;t See the Right Role?
        </h2>
        <p
          className={
            hasJobs
              ? "text-lg text-gray-600 mb-8 max-w-xl mx-auto"
              : "text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          }
        >
          We&apos;re always interested in hearing from great people. Submit a general application
          and we&apos;ll keep you in mind for future opportunities.
        </p>
        <Button
          size="lg"
          className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0"
          onClick={onGeneralApply}
          aria-label="Open general application form"
        >
          Submit General Application
        </Button>
      </div>
    </section>
  )
}
