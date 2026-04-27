"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { canAccess } from "@/lib/permissions"
import { UserRole } from "@prisma/client"
import { PAGE_SCHEMAS, buildDefaultContent, type ContentBlock } from "@/lib/page-content"

async function requirePageManager() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")
  const role = session.user.role as UserRole
  if (!canAccess(role, "page-manager")) redirect("/admin")
  return session
}

export async function getPage(slug: string) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  return prisma.page.findUnique({ where: { slug } })
}

export type PageUpdateResult = { success: true } | { success: false; error: string }

export async function updatePage(
  slug: string,
  content: ContentBlock
): Promise<PageUpdateResult> {
  const session = await requirePageManager()

  try {
    await prisma.page.upsert({
      where: { slug },
      update: { content, lastEditedById: session.user.id },
      create: {
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        content,
        lastEditedById: session.user.id,
      },
    })

    revalidatePath(`/admin/pages/${slug}`)
    // Revalidate the corresponding public page
    const publicPaths: Record<string, string> = {
      home: "/",
      about: "/about",
      services: "/services",
      careers: "/careers",
      faq: "/faq",
      contact: "/contact",
    }
    if (publicPaths[slug]) revalidatePath(publicPaths[slug])

    return { success: true }
  } catch (err) {
    console.error("updatePage error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function initializePages(): Promise<PageUpdateResult> {
  const session = await requirePageManager()

  try {
    await Promise.all(
      PAGE_SCHEMAS.map((schema) =>
        prisma.page.upsert({
          where: { slug: schema.slug },
          update: {},
          create: {
            slug: schema.slug,
            title: schema.title,
            content: buildDefaultContent(schema),
            lastEditedById: session.user.id,
          },
        })
      )
    )
    revalidatePath("/admin/pages")
    return { success: true }
  } catch (err) {
    console.error("initializePages error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
