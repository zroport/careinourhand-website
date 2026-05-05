import { requireRole } from "@/lib/require-role"
import { getServiceAreas } from "@/actions/admin/service-area-actions"
import { ServiceAreasClient } from "./service-areas-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Service Areas | Admin",
}

export default async function ServiceAreasPage() {
  await requireRole("service-areas")
  const areas = await getServiceAreas()
  return <ServiceAreasClient areas={areas} />
}
