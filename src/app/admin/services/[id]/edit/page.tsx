import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ServiceForm } from "@/components/admin/services/service-form"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Edit Service | Admin",
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const { id } = await params
  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) notFound()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
      <ServiceForm
        serviceId={service.id}
        defaultValues={{
          title: service.title,
          slug: service.slug,
          summary: service.summary,
          description: service.description,
          icon: service.icon ?? "",
          order: service.order,
          isActive: service.isActive,
          image: service.image ?? "",
          brochureUrl: (service as { brochureUrl?: string | null }).brochureUrl ?? "",
        }}
      />
    </div>
  )
}
