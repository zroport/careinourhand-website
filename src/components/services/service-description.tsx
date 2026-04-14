import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Tag, Users, ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";

interface ServiceDescriptionProps {
  service: Service;
}

export function ServiceDescription({ service }: ServiceDescriptionProps) {
  const paragraphs = service.fullDescription.split("\n\n");

  return (
    <section
      className="py-16 sm:py-20"
      aria-labelledby="description-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">
          {/* Left: Full description */}
          <div>
            <h2
              id="description-heading"
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
            >
              About This{" "}
              <span className="text-[#620E87]">Service</span>
            </h2>
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-gray-600 text-base sm:text-lg leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Right: Sidebar card */}
          <aside aria-label="Service details">
            <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white sticky top-6">
              <CardContent className="pt-6 pb-6 space-y-5">
                {/* NDIS Category */}
                <div className="flex items-start gap-3">
                  <span
                    className="flex items-center justify-center size-9 rounded-lg bg-[#620E87]/10 shrink-0"
                    aria-hidden="true"
                  >
                    <Tag className="size-4 text-[#620E87]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                      NDIS Category
                    </p>
                    <p className="text-sm text-gray-800 font-medium leading-snug">
                      {service.ndisCategory}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <span
                    className="flex items-center justify-center size-9 rounded-lg bg-[#89C541]/15 shrink-0"
                    aria-hidden="true"
                  >
                    <MapPin className="size-4 text-[#6da033]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      Leppington, NSW &amp; surrounding areas
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start gap-3">
                  <span
                    className="flex items-center justify-center size-9 rounded-lg bg-green-50 shrink-0"
                    aria-hidden="true"
                  >
                    <Users className="size-4 text-green-600" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                      Availability
                    </p>
                    <p className="text-sm font-medium">
                      <span className="text-green-600">
                        Currently accepting new participants
                      </span>
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" aria-hidden="true" />

                {/* Quick Referral button */}
                <Button
                  className="w-full bg-[#620E87] hover:bg-[#4a0b66] text-white font-semibold rounded-xl h-11 text-sm transition-all"
                  asChild
                >
                  <Link
                    href="/referral"
                    aria-label={`Quick referral for ${service.title}`}
                    className="flex items-center justify-center gap-2"
                  >
                    Quick Referral
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}
