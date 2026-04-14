"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function CareersCta() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="careers-cta-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="careers-cta-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Don&apos;t See the Right Role?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          We&apos;re always interested in hearing from great people. Submit a general application
          and we&apos;ll keep you in mind for future opportunities.
        </p>
        <Button
          size="lg"
          className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0"
          onClick={() => {
            const el = document.getElementById("apply")
            el?.scrollIntoView({ behavior: "smooth", block: "start" })
          }}
        >
          <ArrowDown className="size-4 mr-2" aria-hidden="true" />
          Submit General Application
        </Button>
      </div>
    </section>
  )
}
