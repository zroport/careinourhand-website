import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ServicesTable } from "@/components/admin/services/services-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Services | Admin",
}

export default async function ServicesPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          {services.length}
        </span>
      </div>
      {services.length === 0 && (
        <div className="glass-card p-4 border border-amber-100">
          <p className="text-sm text-amber-700">
            No services in the database yet. Run{" "}
            <code className="bg-amber-50 px-1 rounded">npm run seed:services</code> to seed from the static data file.
          </p>
        </div>
      )}
      <ServicesTable services={services} />
    </div>
  )
}
