import { CheckCircle2 } from "lucide-react";
import type { Service } from "@/data/services";

interface ServiceProvidesProps {
  service: Service;
}

export function ServiceProvides({ service }: ServiceProvidesProps) {
  return (
    <section
      className="py-16 sm:py-20 bg-gray-50"
      aria-labelledby="provides-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2
            id="provides-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8"
          >
            What We{" "}
            <span className="text-[#620E87]">Provide</span>
          </h2>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            role="list"
            aria-label={`What we provide for ${service.title}`}
          >
            {service.whatWeProvide.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 bg-white rounded-xl p-4 ring-1 ring-gray-100 shadow-sm"
              >
                <CheckCircle2
                  className="size-5 text-[#89C541] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
