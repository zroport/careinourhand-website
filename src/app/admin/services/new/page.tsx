import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreateServiceForm } from "@/components/admin/services/create-service-form"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "New Service | Admin",
}

export default async function NewServicePage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Service</h1>
      <CreateServiceForm />
    </div>
  )
}
