"use client"

import { useState, useTransition } from "react"
import { Eye, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { EmptyState } from "@/components/admin/empty-state"
import { DetailModal, DetailField, DetailSection } from "@/components/admin/detail-modal"
import { formatRelativeDate, formatDate } from "@/lib/format-date"
import { markMessageRead } from "@/actions/admin/update-message"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  isRead: boolean
  createdAt: Date
}

interface MessagesTableProps {
  messages: Message[]
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const [showUnread, setShowUnread] = useState(false)
  const [selected, setSelected] = useState<Message | null>(null)
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(messages.filter((m) => m.isRead).map((m) => m.id))
  )
  const [isPending, startTransition] = useTransition()

  const unreadCount = messages.filter((m) => !readIds.has(m.id)).length

  const filtered = showUnread
    ? messages.filter((m) => !readIds.has(m.id))
    : messages

  function openMessage(msg: Message) {
    setSelected(msg)
    if (!readIds.has(msg.id)) {
      startTransition(async () => {
        await markMessageRead(msg.id, true)
        setReadIds((prev) => new Set([...prev, msg.id]))
      })
    }
  }

  function handleToggleRead(msg: Message) {
    const nowRead = readIds.has(msg.id)
    startTransition(async () => {
      await markMessageRead(msg.id, !nowRead)
      setReadIds((prev) => {
        const next = new Set(prev)
        if (nowRead) next.delete(msg.id)
        else next.add(msg.id)
        return next
      })
      if (selected?.id === msg.id) {
        setSelected((prev) => prev ? { ...prev, isRead: !nowRead } : null)
      }
    })
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex rounded-lg overflow-hidden border border-white/40 glass-card">
          <button
            onClick={() => setShowUnread(false)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-colors",
              !showUnread ? "bg-[#620E87] text-white" : "text-gray-600 hover:bg-white/40"
            )}
          >
            All
          </button>
          <button
            onClick={() => setShowUnread(true)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5",
              showUnread ? "bg-[#620E87] text-white" : "text-gray-600 hover:bg-white/40"
            )}
          >
            Unread
            {unreadCount > 0 && (
              <span className={cn(
                "inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold",
                showUnread ? "bg-white text-[#620E87]" : "bg-amber-400 text-white"
              )}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <span className="text-sm text-gray-400">{filtered.length} message{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={showUnread ? "No unread messages" : "No messages yet"}
          description={showUnread ? "All messages have been read." : "Contact form submissions will appear here."}
        />
      ) : (
        <DataTable headers={["", "Name", "Email", "Phone", "Subject", "Message", "Received", ""]}>
          {filtered.map((msg) => {
            const isRead = readIds.has(msg.id)
            return (
              <DataTableRow key={msg.id} className={!isRead ? "bg-amber-50/30" : ""}>
                <DataTableCell>
                  <span
                    className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      !isRead ? "bg-amber-400" : "bg-gray-200"
                    )}
                    title={isRead ? "Read" : "Unread"}
                  />
                </DataTableCell>
                <DataTableCell>
                  <span className={cn("whitespace-nowrap", !isRead && "font-semibold text-gray-900")}>
                    {msg.name}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs">{msg.email}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs whitespace-nowrap">{msg.phone || "—"}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs">{msg.subject || "General"}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-500">
                    {msg.message.length > 50 ? `${msg.message.slice(0, 50)}…` : msg.message}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatRelativeDate(msg.createdAt)}</span>
                </DataTableCell>
                <DataTableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#620E87] hover:bg-purple-50 gap-1 whitespace-nowrap"
                    onClick={() => openMessage(msg)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                </DataTableCell>
              </DataTableRow>
            )
          })}
        </DataTable>
      )}

      <DetailModal
        title="Message Details"
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <DetailSection title="Contact Details">
              <DetailField label="Name" value={selected.name} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="Phone" value={selected.phone} />
            </DetailSection>

            <DetailSection title="Message">
              <DetailField label="Subject" value={selected.subject || "General Enquiry"} />
              <DetailField
                label="Message"
                value={
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{selected.message}</p>
                }
              />
            </DetailSection>

            <DetailSection title="Received">
              <DetailField label="Date" value={formatDate(selected.createdAt)} />
              <DetailField
                label="Time"
                value={new Date(selected.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
              />
            </DetailSection>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isPending}
                onClick={() => handleToggleRead(selected)}
              >
                {readIds.has(selected.id) ? "Mark as Unread" : "Mark as Read"}
              </Button>
            </div>
          </>
        )}
      </DetailModal>
    </>
  )
}
