import { UserCheck } from "lucide-react";
import type { Service } from "@/data/services";

interface ServiceWhoForProps {
  service: Service;
}

export function ServiceWhoFor({ service }: ServiceWhoForProps) {
  return (
    <section
      className="py-12 sm:py-16"
      aria-labelledby="who-for-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2
            id="who-for-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
          >
            Who Is This Service{" "}
            <span className="text-[#620E87]">For?</span>
          </h2>

          <div
            className="flex items-start gap-4 rounded-2xl p-6 sm:p-8"
            style={{
              background:
                "linear-gradient(135deg, #f5e8ff 0%, #ede0f7 50%, #e8d5f5 100%)",
              border: "1px solid #d4b3e8",
            }}
            role="note"
            aria-label="Who this service is for"
          >
            <span
              className="flex items-center justify-center size-11 rounded-xl bg-[#620E87]/10 shrink-0"
              aria-hidden="true"
            >
              <UserCheck className="size-5 text-[#620E87]" aria-hidden="true" />
            </span>
            <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
              {service.whoIsThisFor}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
