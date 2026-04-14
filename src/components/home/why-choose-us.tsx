import { Globe, Laptop, MapPin } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Cultural Competency",
    description:
      "Specialized understanding of Sydney's diverse communities. We provide care that respects your culture, language, and traditions — so you always feel at home.",
  },
  {
    icon: Laptop,
    title: "Tech-Enabled Care",
    description:
      "Modern systems for faster communication and transparent reporting. Stay informed about your care at all times with easy access to updates and records.",
  },
  {
    icon: MapPin,
    title: "Local First",
    description:
      "Unlike big national providers, we're on the ground in Sydney. We respond to your needs instantly because we're part of your community.",
  },
];

export function WhyChooseUs() {
  return (
    <section
      className="py-20 bg-white"
      aria-labelledby="why-choose-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            id="why-choose-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            Why Choose{" "}
            <span className="text-[#620E87]">Care In Our Hand</span>?
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            We do things differently — because you deserve better than
            one-size-fits-all care.
          </p>
        </div>

        {/* Feature columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-200 group"
              >
                {/* Step number */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-4 text-4xl font-black text-gray-100 group-hover:text-[#620E87]/10 transition-colors leading-none select-none"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="flex items-center justify-center size-16 rounded-2xl bg-[#89C541]/15 mb-5 group-hover:bg-[#89C541]/25 transition-colors">
                  <Icon
                    className="size-7 text-[#89C541]"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
