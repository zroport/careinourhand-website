"use client"

import { useState, useTransition } from "react"
import { HelpCircle, Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { EmptyState } from "@/components/admin/empty-state"
import { FaqModal } from "@/components/admin/faqs/faq-modal"
import { deleteFaq, toggleFaqActive } from "@/actions/admin/faq-actions"

type Faq = {
  id: string
  question: string
  answer: string
  order: number
  isActive: boolean
}

interface FaqsTableProps {
  faqs: Faq[]
}

export function FaqsTable({ faqs: initialFaqs }: FaqsTableProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [isPending, startTransition] = useTransition()
  const [actionId, setActionId] = useState<string | null>(null)

  const nextOrder = initialFaqs.length > 0 ? Math.max(...initialFaqs.map((f) => f.order)) + 1 : 1

  function openAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(faq: Faq) {
    setEditing(faq)
    setModalOpen(true)
  }

  function handleDelete(id: string, question: string) {
    if (!window.confirm(`Delete this FAQ?\n\n"${question.slice(0, 80)}..."`)) return
    setActionId(id)
    startTransition(async () => {
      await deleteFaq(id)
      setActionId(null)
    })
  }

  function handleToggle(id: string) {
    setActionId(id)
    startTransition(async () => {
      await toggleFaqActive(id)
      setActionId(null)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openAdd} className="bg-[#89C541] hover:bg-[#6da033] text-white gap-2">
          <Plus className="w-4 h-4" />
          Add New FAQ
        </Button>
      </div>

      {initialFaqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs yet"
          description='Click "Add New FAQ" or run npm run seed:faqs to populate from static data.'
        />
      ) : (
        <DataTable headers={["Order", "Question", "Status", ""]}>
          {initialFaqs.map((faq) => (
            <DataTableRow key={faq.id}>
              <DataTableCell className="w-16">
                <span className="text-sm font-medium text-gray-500">{faq.order}</span>
              </DataTableCell>
              <DataTableCell>
                <p className="text-sm text-gray-900 line-clamp-2 max-w-xl">{faq.question}</p>
              </DataTableCell>
              <DataTableCell>
                {faq.isActive ? (
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
                <div className="flex items-center gap-1 flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#620E87] hover:bg-purple-50 gap-1"
                    onClick={() => openEdit(faq)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={faq.isActive ? "text-orange-500 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}
                    onClick={() => handleToggle(faq.id)}
                    disabled={isPending && actionId === faq.id}
                  >
                    {faq.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 gap-1"
                    onClick={() => handleDelete(faq.id, faq.question)}
                    disabled={isPending && actionId === faq.id}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}

      <FaqModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        nextOrder={nextOrder}
      />
    </>
  )
}
