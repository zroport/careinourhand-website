import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { services, iconMap } from "@/data/services";

export function ServicesListingGrid() {
  return (
    <section
      className="py-20 bg-white"
      aria-labelledby="services-grid-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            id="services-grid-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            All{" "}
            <span className="text-[#620E87]">NDIS Services</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Click any service to learn more about how we can support you.
          </p>
        </div>

        {/* Services grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87] focus-visible:ring-offset-2 rounded-2xl"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <Card className="h-full shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 glass-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center size-11 rounded-xl bg-[#620E87]/10 group-hover:bg-[#620E87]/20 transition-colors shrink-0">
                          {Icon && (
                            <Icon
                              className="size-5 text-[#620E87]"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        <CardTitle className="text-gray-900 font-semibold text-sm leading-snug mt-1">
                          {service.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-500 text-sm leading-relaxed">
                        {service.shortDescription}
                      </CardDescription>
                      <span className="inline-flex items-center gap-1 text-[#620E87] text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
