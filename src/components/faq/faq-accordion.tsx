"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
}

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="overflow-hidden glass-card">
      <button
        type="button"
        className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-purple-50/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87] focus-visible:ring-inset"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
        id={`faq-trigger-${faq.id}`}
      >
        <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">
          {faq.question}
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-[#620E87] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`faq-answer-${faq.id}`}
        role="region"
        aria-labelledby={`faq-trigger-${faq.id}`}
        hidden={!isOpen}
      >
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 bg-gray-50/50">
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const query = search.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!query) return faqs
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query) ||
        f.answer.toLowerCase().includes(query)
    )
  }, [faqs, query])

  const grouped = useMemo(() => {
    const map = new Map<string, FaqItem[]>()
    for (const faq of filtered) {
      const cat = faq.category || "General"
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(faq)
    }
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
  }, [filtered])

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section
      className="py-12 sm:py-16 section-blob-both"
      style={{ background: 'linear-gradient(135deg, #f8f5fc 0%, #ffffff 55%, #f5f0f9 100%)' }}
      aria-labelledby="faq-section-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="faq-section-heading" className="sr-only">
          All frequently asked questions
        </h2>

        {/* Search */}
        <div className="relative mb-10">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setOpenId(null)
            }}
            className="pl-10 h-11 text-sm"
            aria-label="Search frequently asked questions"
          />
          {query && (
            <p
              className="mt-2 text-sm text-gray-500"
              role="status"
              aria-live="polite"
            >
              {filtered.length === 0
                ? "No questions match your search."
                : `Showing ${filtered.length} of ${faqs.length} questions`}
            </p>
          )}
        </div>

        {/* Categories */}
        {grouped.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions match your search.</p>
            <button
              type="button"
              className="mt-4 text-sm text-[#620E87] hover:underline"
              onClick={() => setSearch("")}
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(({ label, items }) => (
              <div key={label}>
                <h3 className="text-lg font-bold text-[#620E87] mb-4 pb-2 border-b-2 border-[#620E87]/20">
                  {label}
                </h3>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      faq={faq}
                      isOpen={openId === faq.id}
                      onToggle={() => toggle(faq.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
