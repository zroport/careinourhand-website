import Link from "next/link";
import {
  Briefcase,
  RefreshCcw,
  UserCheck,
  Car,
  Stethoscope,
  Home,
  BookOpen,
  Sparkles,
  Users,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const services = [
  {
    icon: Briefcase,
    title: "Assist Access & Employment",
    description: "Building your career confidence and workplace skills",
    href: "/services#employment",
  },
  {
    icon: RefreshCcw,
    title: "Life Stages & Transitions",
    description: "Smooth support through life's big changes",
    href: "/services#life-stages",
  },
  {
    icon: UserCheck,
    title: "Assist Personal Activities",
    description: "Respectful help with daily personal routines",
    href: "/services#personal-activities",
  },
  {
    icon: Car,
    title: "Travel & Transport",
    description: "Safe, reliable transport to wherever you need to go",
    href: "/services#transport",
  },
  {
    icon: Stethoscope,
    title: "Community Nursing Care",
    description: "Expert clinical care in the comfort of your home",
    href: "/services#nursing",
  },
  {
    icon: Home,
    title: "Daily Tasks & Shared Living",
    description: "Creating a harmonious and supported home life",
    href: "/services#shared-living",
  },
  {
    icon: BookOpen,
    title: "Daily Living & Life Skills",
    description: "Building independence with practical life skills",
    href: "/services#life-skills",
  },
  {
    icon: Sparkles,
    title: "Household Tasks",
    description: "Keeping your living space fresh and organized",
    href: "/services#household",
  },
  {
    icon: Users,
    title: "Community & Social Participation",
    description: "Staying connected and active in your community",
    href: "/services#community",
  },
  {
    icon: PlayCircle,
    title: "Group & Centre-Based Activities",
    description: "Fun group programs to learn, play, and connect",
    href: "/services#group",
  },
];

export function ServicesGrid() {
  return (
    <section
      className="py-20 bg-gray-50"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            Our{" "}
            <span className="text-[#620E87]">NDIS Services</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Comprehensive support tailored to your needs — because no two people
            are the same.
          </p>
        </div>

        {/* Services grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <li key={service.title}>
                <Link
                  href={service.href}
                  className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87] focus-visible:ring-offset-2 rounded-2xl"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white rounded-2xl">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center size-11 rounded-xl bg-[#620E87]/10 group-hover:bg-[#620E87]/20 transition-colors shrink-0">
                          <Icon
                            className="size-5 text-[#620E87]"
                            aria-hidden="true"
                          />
                        </span>
                        <CardTitle className="text-gray-900 font-semibold text-sm leading-snug mt-1">
                          {service.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-500 text-sm leading-relaxed">
                        {service.description}
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

        {/* Bottom CTA */}
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
