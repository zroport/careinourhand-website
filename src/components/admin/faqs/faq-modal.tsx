"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useTransition } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createFaq, updateFaq } from "@/actions/admin/faq-actions"

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  order: z.number().int().min(0),
})

type FormValues = z.infer<typeof schema>

type FaqForEdit = {
  id: string
  question: string
  answer: string
  order: number
}

interface FaqModalProps {
  isOpen: boolean
  onClose: () => void
  editing: FaqForEdit | null
  nextOrder: number
}

export function FaqModal({ isOpen, onClose, editing, nextOrder }: FaqModalProps) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: "", answer: "", order: nextOrder },
  })

  useEffect(() => {
    if (isOpen) {
      reset(
        editing
          ? { question: editing.question, answer: editing.answer, order: editing.order }
          : { question: "", answer: "", order: nextOrder }
      )
    }
  }, [isOpen, editing, nextOrder, reset])

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = editing
        ? await updateFaq(editing.id, data)
        : await createFaq(data)

      if (result?.error) {
        setError("root", { message: result.error })
        return
      }
      onClose()
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative glass-card w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? "Edit FAQ" : "Add New FAQ"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="faq-question">Question *</Label>
              <Input id="faq-question" {...register("question")} placeholder="What is...?" />
              {errors.question && <p className="text-xs text-red-500">{errors.question.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="faq-answer">Answer *</Label>
              <Textarea id="faq-answer" {...register("answer")} rows={5} placeholder="The answer..." />
              {errors.answer && <p className="text-xs text-red-500">{errors.answer.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="faq-order">Display Order</Label>
              <Input id="faq-order" type="number" min={0} {...register("order", { valueAsNumber: true })} className="w-28" />
            </div>

            {errors.root && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errors.root.message}
              </p>
            )}
          </div>

          <div className="px-6 pb-5 flex items-center gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#89C541] hover:bg-[#6da033] text-white"
            >
              {isPending ? "Saving..." : editing ? "Save Changes" : "Add FAQ"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
