import { Send, Search, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Send,
    number: "1",
    title: "Submit",
    description: "Share your feedback through the form below, by phone, or in person.",
  },
  {
    icon: Search,
    number: "2",
    title: "Review",
    description: "Our team reviews all feedback within 2 business days.",
  },
  {
    icon: CheckCircle,
    number: "3",
    title: "Resolve",
    description: "We take action and follow up with you on the outcome.",
  },
]

export function FeedbackProcess() {
  return (
    <section
      className="py-12 section-blob-purple"
      style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)' }}
      aria-labelledby="feedback-process-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          className="glass-card"
          style={{ background: "rgba(250, 245, 255, 0.78)", border: "1px solid rgba(98,14,135,0.15)" }}
        >
          <CardContent className="pt-8 pb-8">
            <h2
              id="feedback-process-heading"
              className="text-xl font-bold text-gray-900 mb-8 text-center"
            >
              Our Feedback Process
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <div key={step.number} className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <span className="flex items-center justify-center size-14 rounded-full bg-[#620E87] text-white">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span
                        className="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-[#89C541] text-gray-900 text-xs font-bold"
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-center text-gray-500 border-t border-[#620E87]/10 pt-5">
              All complaints are handled in accordance with the NDIS Quality and Safeguards
              Commission guidelines.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
