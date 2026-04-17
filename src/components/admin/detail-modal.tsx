"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface DetailModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function DetailModal({ title, isOpen, onClose, children }: DetailModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto glass-card border-l border-white/40 shadow-2xl"
      >
        <SheetHeader className="border-b border-white/40 pb-4 mb-6">
          <SheetTitle className="text-lg font-bold text-gray-900">{title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

export function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <div className="text-sm text-gray-800">{value || <span className="text-gray-400 italic">Not provided</span>}</div>
    </div>
  )
}

export function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-[#620E87] uppercase tracking-widest border-b border-purple-100 pb-1">
        {title}
      </h4>
      {children}
    </div>
  )
}
