import { notFound } from "next/navigation"
import { requireRole } from "@/lib/require-role"
import { getPageSchema, getPageContent } from "@/lib/page-content"
import { PageEditor } from "@/components/admin/pages/page-editor"

export const dynamic = "force-dynamic"

interface AdminPageEditorProps {
  params: Promise<{ slug: string }>
}

export default async function AdminPageEditorPage({ params }: AdminPageEditorProps) {
  await requireRole("page-manager")

  const { slug } = await params
  const schema = getPageSchema(slug)
  if (!schema) notFound()

  const content = await getPageContent(slug)

  return <PageEditor schema={schema} initialContent={content} />
}

export async function generateMetadata({ params }: AdminPageEditorProps) {
  const { slug } = await params
  const schema = getPageSchema(slug)
  return { title: schema ? `${schema.title} | Page Manager` : "Page Manager" }
}
