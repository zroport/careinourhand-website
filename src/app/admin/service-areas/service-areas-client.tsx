"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Check, X, ArrowUp, ArrowDown } from "lucide-react"
import {
  createServiceArea,
  updateServiceArea,
  toggleServiceAreaActive,
  deleteServiceArea,
} from "@/actions/admin/service-area-actions"

interface Area {
  id: string
  areaName: string
  isActive: boolean
  order: number
}

export function ServiceAreasClient({ areas: initial }: { areas: Area[] }) {
  const [areas, setAreas] = useState<Area[]>(initial)
  const [newName, setNewName] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editOrder, setEditOrder] = useState(0)
  const [isPending, startTransition] = useTransition()

  async function handleCreate() {
    if (!newName.trim()) return
    const maxOrder = areas.length > 0 ? Math.max(...areas.map((a) => a.order)) + 1 : 0
    startTransition(async () => {
      await createServiceArea({ areaName: newName.trim(), order: maxOrder })
      setNewName("")
      // refresh data by re-fetching via server action
      window.location.reload()
    })
  }

  async function handleUpdate() {
    if (!editId) return
    startTransition(async () => {
      await updateServiceArea(editId, { areaName: editName.trim(), order: editOrder })
      setEditId(null)
      window.location.reload()
    })
  }

  async function handleToggle(id: string) {
    startTransition(async () => {
      await toggleServiceAreaActive(id)
      setAreas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
      )
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service area?")) return
    startTransition(async () => {
      await deleteServiceArea(id)
      setAreas((prev) => prev.filter((a) => a.id !== id))
    })
  }

  function startEdit(area: Area) {
    setEditId(area.id)
    setEditName(area.areaName)
    setEditOrder(area.order)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Service Areas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the suburbs and regions shown on the public homepage.
        </p>
      </div>

      {/* Add new area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Campbelltown"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              disabled={isPending}
            />
            <Button onClick={handleCreate} disabled={isPending || !newName.trim()}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Areas table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Areas ({areas.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {areas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No areas yet. Add one above.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {areas.map((area) => (
                <div key={area.id} className="flex items-center gap-3 px-4 py-3">
                  {editId === area.id ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 h-8 text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                      />
                      <Input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(Number(e.target.value))}
                        className="w-20 h-8 text-sm"
                        placeholder="Order"
                      />
                      <Button size="sm" variant="ghost" onClick={handleUpdate} disabled={isPending}>
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                        <X className="w-4 h-4 text-gray-400" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 w-8 text-right shrink-0">
                        {area.order}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-900">
                        {area.areaName}
                      </span>
                      <Badge
                        variant={area.isActive ? "default" : "secondary"}
                        className={`text-xs cursor-pointer ${area.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                        onClick={() => handleToggle(area.id)}
                      >
                        {area.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(area)} disabled={isPending}>
                        <Pencil className="w-3.5 h-3.5 text-gray-400" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(area.id)} disabled={isPending}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
