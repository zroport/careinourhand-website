export interface PageHeaderData {
  heading?: string | null
  subheading?: string | null
  imageUrl?: string | null
}

export async function getPageHeader(pageSlug: string): Promise<PageHeaderData | null> {
  try {
    const { prisma } = await import("@/lib/prisma")
    return await prisma.pageHeader.findUnique({
      where: { pageSlug },
      select: { heading: true, subheading: true, imageUrl: true },
    })
  } catch {
    return null
  }
}
