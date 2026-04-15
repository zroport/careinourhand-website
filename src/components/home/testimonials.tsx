import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Participant",
    body: "Care In Our Hand has completely changed my life. The support workers genuinely care and always respect my choices. I finally feel like I'm in control of my own life.",
    stars: 5,
  },
  {
    name: "James T.",
    role: "Parent & Guardian",
    body: "Finding culturally appropriate care for my son was so difficult until we found Care In Our Hand. They truly understand our family's needs and never make us feel like a burden.",
    stars: 5,
  },
  {
    name: "Lisa R.",
    role: "Support Coordinator",
    body: "The referral process is so smooth and the team always has capacity. They're my go-to provider in South-West Sydney — professional, responsive, and truly person-centred.",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`} role="img">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="size-4 fill-[#89C541] text-[#89C541]"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      className="py-20 bg-gray-50"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            What Our{" "}
            <span className="text-[#620E87]">Community Says</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Real stories from participants, families, and coordinators who trust
            us every day.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="relative shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible glass-card"
            >
              {/* Large decorative quote mark */}
              <div
                aria-hidden="true"
                className="absolute -top-3 -left-2 flex items-center justify-center size-10 rounded-full bg-[#620E87] shadow-md"
              >
                <Quote className="size-4 text-white fill-white" />
              </div>

              <CardContent className="pt-8 pb-6 px-6 flex flex-col gap-4 h-full">
                {/* Stars */}
                <StarRating count={t.stars} />

                {/* Body */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                  &ldquo;{t.body}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div
                    className="flex items-center justify-center size-9 rounded-full bg-[#620E87]/10 font-bold text-[#620E87] text-sm shrink-0"
                    aria-hidden="true"
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
