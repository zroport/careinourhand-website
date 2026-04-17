"use client"

import { useTransition, useState } from "react"
import Link from "next/link"
import { LayoutGrid, GripVertical, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { EmptyState } from "@/components/admin/empty-state"
import { toggleServiceActive } from "@/actions/admin/toggle-service"

type Service = {
  id: string
  title: string
  slug: string
  order: number
  isActive: boolean
}

interface ServicesTableProps {
  services: Service[]
}

export function ServicesTable({ services }: ServicesTableProps) {
  const [isPending, startTransition] = useTransition()
  const [togglingId, setTogglingId] = useState<string | null>(null)

  function handleToggle(id: string) {
    setTogglingId(id)
    startTransition(async () => {
      await toggleServiceActive(id)
      setTogglingId(null)
    })
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="No services found"
        description="Run npm run seed:services to populate from the static data file."
      />
    )
  }

  return (
    <DataTable headers={["", "Title", "Slug", "Status", ""]}>
      {services.map((service) => (
        <DataTableRow key={service.id}>
          <DataTableCell className="w-8">
            <GripVertical className="w-4 h-4 text-gray-300" aria-hidden="true" />
          </DataTableCell>
          <DataTableCell>
            <span className="font-medium text-gray-900">{service.title}</span>
          </DataTableCell>
          <DataTableCell>
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
              {service.slug}
            </code>
          </DataTableCell>
          <DataTableCell>
            {service.isActive ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                Inactive
              </span>
            )}
          </DataTableCell>
          <DataTableCell>
            <div className="flex items-center gap-1">
              <Link href={`/admin/services/${service.id}/edit`}>
                <Button size="sm" variant="ghost" className="text-[#620E87] hover:bg-purple-50 gap-1">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className={service.isActive ? "text-orange-500 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}
                onClick={() => handleToggle(service.id)}
                disabled={isPending && togglingId === service.id}
              >
                {isPending && togglingId === service.id
                  ? "..."
                  : service.isActive
                  ? "Deactivate"
                  : "Activate"}
              </Button>
            </div>
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTable>
  )
}
