import { requireRole } from "@/lib/require-role"
import { prisma } from "@/lib/prisma"
import MediaClient from "./media-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Media Library | Admin",
}

export default async function MediaPage() {
  await requireRole("media")

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <MediaClient media={media} />
}
