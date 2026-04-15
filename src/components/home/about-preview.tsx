import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, HeartHandshake } from "lucide-react";

const stats = [
  { icon: Users, label: "Participants Supported", value: "500+" },
  { icon: Award, label: "Years of Expertise", value: "10+" },
  { icon: HeartHandshake, label: "Support Workers", value: "50+" },
];

export function AboutPreview() {
  return (
    <section
      className="py-20"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f5fc 100%)' }}
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div>
            <Badge
              variant="secondary"
              className="mb-4 bg-[#620E87]/10 text-[#620E87] border-0 font-medium px-3 py-1 text-xs rounded-full"
            >
              About Us
            </Badge>
            <h2
              id="about-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-5"
            >
              Empowering Lives{" "}
              <span className="text-[#620E87]">Across Sydney</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Founded in Sydney after seeing a gap in culturally appropriate, flexible
              care for local families. Care In Our Hand brings together years of
              healthcare expertise with a deep understanding of our diverse community.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              We believe every person deserves support that respects their culture,
              choices, and goals. Our team works side-by-side with participants and
              their families — because great care is a partnership.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <Icon
                      className="size-5 text-[#89C541] mx-auto mb-1"
                      aria-hidden="true"
                    />
                    <p className="text-xl font-bold text-[#620E87]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <Button
              className="bg-[#620E87] hover:bg-[#7d1aab] text-white border-0 rounded-xl px-6 h-11 font-semibold"
              asChild
            >
              <Link href="/about" aria-label="Learn more about Care In Our Hand">
                Learn More
                <ArrowRight className="size-4 ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Image placeholder */}
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#620E87]/10 to-[#89C541]/10 aspect-[4/3] flex items-center justify-center border border-[#620E87]/10"
              aria-label="Team photo placeholder"
            >
              {/* Placeholder content */}
              <div className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <div className="flex -space-x-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="size-12 rounded-full border-2 border-white bg-gradient-to-br from-[#620E87]/30 to-[#89C541]/30"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#620E87] font-semibold text-sm">
                  Our caring team
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Photo coming soon
                </p>
              </div>

              {/* Decorative corner accent */}
              <div
                aria-hidden="true"
                className="absolute top-4 right-4 size-16 rounded-xl bg-[#89C541]/20 border border-[#89C541]/30"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-4 left-4 size-10 rounded-lg bg-[#620E87]/20 border border-[#620E87]/30"
              />
            </div>

            {/* Floating badge */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3"
            >
              <span className="flex items-center justify-center size-9 rounded-xl bg-[#89C541]/15">
                <Award className="size-5 text-[#89C541]" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">NDIS Registered</p>
                <p className="text-xs text-gray-500">Verified Provider</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
