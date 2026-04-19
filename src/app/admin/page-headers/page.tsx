import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PageHeadersManager } from "@/components/admin/page-headers/page-headers-manager"
import type { PageDefault, PageHeaderRecord } from "@/components/admin/page-headers/page-headers-manager"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Page Headers | Admin",
}

const PAGE_DEFAULTS: PageDefault[] = [
  {
    slug: "about",
    name: "About Us",
    defaultHeading: "The Heart Behind the Care",
    defaultSubheading:
      "We started Care In Our Hand because we saw a gap — families in Sydney's diverse communities deserved care that truly understood them.",
  },
  {
    slug: "services",
    name: "Services",
    defaultHeading: "NDIS Support Services",
    defaultSubheading:
      "Comprehensive, person-centred disability support services across Sydney. Every service is delivered according to the NDIS Price Guide with full transparency.",
  },
  {
    slug: "careers",
    name: "Careers",
    defaultHeading: "Build a Career in Care",
    defaultSubheading:
      "We're always looking for compassionate, dedicated people to join our growing team in Sydney. Make a real difference in people's lives every day.",
  },
  {
    slug: "blog",
    name: "Blog",
    defaultHeading: "Blog & Community News",
    defaultSubheading:
      "Stay up to date with NDIS updates, community events, care tips, and news from Care In Our Hand.",
  },
  {
    slug: "faq",
    name: "FAQ",
    defaultHeading: "Frequently Asked Questions",
    defaultSubheading:
      "Find answers to common questions about our NDIS services, pricing, and how to get started.",
  },
  {
    slug: "contact",
    name: "Contact",
    defaultHeading: "Contact Us",
    defaultSubheading: "Have a question or want to learn more? We'd love to hear from you.",
  },
  {
    slug: "feedback",
    name: "Feedback & Complaints",
    defaultHeading: "We Value Your Feedback",
    defaultSubheading:
      "Your voice matters. Whether it's a compliment, suggestion, or complaint, we want to hear from you.",
  },
  {
    slug: "booking",
    name: "Booking",
    defaultHeading: "Book an Appointment",
    defaultSubheading:
      "Schedule a time that works for you. We'll confirm your appointment within 24 hours.",
  },
  {
    slug: "referral",
    name: "Referral Portal",
    defaultHeading: "Submit a Referral",
    defaultSubheading:
      "For Support Coordinators and families. Submit participant details and our team will respond within 24 hours.",
  },
]

async function getPageHeaders(): Promise<PageHeaderRecord[]> {
  try {
    const { prisma } = await import("@/lib/prisma")
    return await prisma.pageHeader.findMany()
  } catch {
    return []
  }
}

export default async function PageHeadersPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const records = await getPageHeaders()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Page Headers</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          {PAGE_DEFAULTS.length} pages
        </span>
      </div>
      <p className="text-sm text-gray-500">
        Customize the hero section heading, subheading, and background image for each page.
        Pages without a custom record will use the default gradient and text.
      </p>
      <PageHeadersManager pages={PAGE_DEFAULTS} records={records} />
    </div>
  )
}
