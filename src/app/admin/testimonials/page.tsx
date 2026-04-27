import { requireRole } from "@/lib/require-role"
import { prisma } from "@/lib/prisma"
import TestimonialsClient from "./testimonials-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Testimonials | Admin",
}

export default async function TestimonialsPage() {
  await requireRole("testimonials")

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  })

  return <TestimonialsClient testimonials={testimonials} />
}
