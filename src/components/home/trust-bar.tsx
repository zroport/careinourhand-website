import { Shield, Globe, Clock, MapPin } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "NDIS Registered",
    description: "Fully registered provider",
  },
  {
    icon: Globe,
    title: "Culturally Responsive",
    description: "Honouring your culture & traditions",
  },
  {
    icon: Clock,
    title: "24/7 Support Available",
    description: "We're here when you need us",
  },
  {
    icon: MapPin,
    title: "Local Sydney Team",
    description: "Based in South-West Sydney",
  },
];

export function TrustBar() {
  return (
    <section
      className="bg-gray-50 border-y border-gray-100 py-6"
      aria-label="Trust indicators"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          role="list"
        >
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="flex items-center gap-3 sm:gap-4 glass-card p-3 sm:p-4"
              >
                <span
                  className="flex items-center justify-center size-10 sm:size-12 rounded-xl bg-[#620E87]/10 shrink-0"
                  aria-hidden="true"
                >
                  <Icon className="size-5 sm:size-6 text-[#620E87]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
