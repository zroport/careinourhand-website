import { Clock, TrendingUp, Users, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const benefits = [
  {
    icon: Clock,
    title: "Flexible Schedules",
    description:
      "We offer flexible working hours that fit around your life, including part-time and casual options.",
  },
  {
    icon: TrendingUp,
    title: "Professional Growth",
    description:
      "Ongoing training, mentoring, and career development opportunities to help you grow.",
  },
  {
    icon: Users,
    title: "Supportive Team",
    description:
      "Join a diverse, inclusive team that values collaboration and mutual respect.",
  },
  {
    icon: Heart,
    title: "Make a Difference",
    description:
      "Every shift is an opportunity to positively impact someone's life in your local community.",
  },
]

export function CareersBenefits() {
  return (
    <section className="py-16 sm:py-20 bg-white" aria-labelledby="benefits-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="benefits-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 text-center"
        >
          Why Choose Care In Our Hand?
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
          We invest in our team because great support starts with great workers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <Card
                key={benefit.title}
                className="text-center hover:shadow-md transition-shadow border-gray-100"
              >
                <CardContent className="pt-8 pb-7">
                  <div className="flex justify-center mb-4">
                    <span className="flex items-center justify-center size-14 rounded-2xl bg-purple-100">
                      <Icon className="size-7 text-[#620E87]" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
