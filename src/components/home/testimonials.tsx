import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

const fallbackTestimonials = [
  {
    id: "1",
    name: "Sarah M.",
    role: "Participant",
    content:
      "Care In Our Hand has completely changed my life. The support workers genuinely care and always respect my choices. I finally feel like I'm in control of my own life.",
    rating: 5,
  },
  {
    id: "2",
    name: "James T.",
    role: "Parent & Guardian",
    content:
      "Finding culturally appropriate care for my son was so difficult until we found Care In Our Hand. They truly understand our family's needs and never make us feel like a burden.",
    rating: 5,
  },
  {
    id: "3",
    name: "Lisa R.",
    role: "Support Coordinator",
    content:
      "The referral process is so smooth and the team always has capacity. They're my go-to provider in South-West Sydney — professional, responsive, and truly person-centred.",
    rating: 5,
  },
];

async function getTestimonials() {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return rows.length > 0 ? rows : fallbackTestimonials;
  } catch {
    return fallbackTestimonials;
  }
}

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

export async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section
      className="py-12 sm:py-16 section-blob-purple"
      style={{ background: "linear-gradient(135deg, #f5f0f9 0%, #fefefe 60%, #f5f0f9 100%)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
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

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-hide md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0 md:gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="relative shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible glass-card snap-start shrink-0 min-w-[280px] md:min-w-0"
            >
              <div
                aria-hidden="true"
                className="absolute -top-3 -left-2 flex items-center justify-center size-10 rounded-full bg-[#620E87] shadow-md"
              >
                <Quote className="size-4 text-white fill-white" />
              </div>

              <CardContent className="pt-8 pb-6 px-6 flex flex-col gap-4 h-full">
                <StarRating count={t.rating} />

                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div
                    className="flex items-center justify-center size-9 rounded-full bg-[#620E87]/10 font-bold text-[#620E87] text-sm shrink-0"
                    aria-hidden="true"
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
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
