import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { iconMap, type Service } from "@/data/services";

interface ServiceRelatedProps {
  relatedServices: Service[];
}

export function ServiceRelated({ relatedServices }: ServiceRelatedProps) {
  return (
    <section
      className="py-16 sm:py-20 bg-gray-50"
      aria-labelledby="related-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2
            id="related-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
          >
            Other Services You{" "}
            <span className="text-[#620E87]">Might Need</span>
          </h2>
          <p className="text-gray-500 text-base">
            Explore our full range of NDIS support services.
          </p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          role="list"
        >
          {relatedServices.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87] focus-visible:ring-offset-2 rounded-2xl"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white rounded-2xl">
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

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#620E87] hover:text-[#7d1aab] border border-[#620E87]/30 hover:border-[#620E87] px-5 py-2.5 rounded-xl transition-colors"
            aria-label="View all NDIS services we offer"
          >
            View All Services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
