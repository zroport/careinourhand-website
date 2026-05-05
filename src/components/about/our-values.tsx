import { Heart, Users, Shield } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description:
      "Every interaction is guided by empathy. We treat you the way we'd want our own family to be treated.",
  },
  {
    icon: Users,
    title: "Cultural Respect",
    description:
      "We celebrate diversity. Our team understands and respects the cultural backgrounds of the communities we serve across Sydney.",
  },
  {
    icon: Shield,
    title: "Safety & Trust",
    description:
      "Your safety is non-negotiable. All our workers are NDIS screened, First Aid certified, and continuously trained.",
  },
];

export function OurValues() {
  return (
    <section
      className="py-12 sm:py-16 section-blob-green"
      style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #fafcf8 100%)' }}
      aria-labelledby="our-values-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#89C541] uppercase mb-3">
            Our Values
          </span>
          <h2
            id="our-values-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            What We{" "}
            <span className="text-[#620E87]">Stand For</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-hide md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0 md:gap-6 lg:gap-8">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="flex flex-col items-center text-center p-8 glass-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 snap-start shrink-0 min-w-[280px] md:min-w-0"
              >
                {/* Icon container */}
                <div
                  className="flex items-center justify-center size-16 rounded-2xl bg-[#620E87]/10 mb-5"
                  aria-hidden="true"
                >
                  <Icon className="size-7 text-[#620E87]" aria-hidden="true" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-6 w-10 h-0.5 rounded-full bg-[#89C541]"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
