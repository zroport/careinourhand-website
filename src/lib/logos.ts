import { prisma } from "@/lib/prisma"

export async function getLogos() {
  try {
    return await prisma.siteLogos.findFirst({ where: { siteId: "default" } })
  } catch {
    return null
  }
}
