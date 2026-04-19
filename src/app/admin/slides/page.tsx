import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SlidesClient from "./slides-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Home Slider | Admin",
}

export default async function SlidesPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  let slides: Awaited<ReturnType<typeof prisma.heroSlide.findMany>> = []
  try {
    slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    })
  } catch (e) {
    console.error("[SlidesPage] Failed to fetch slides:", e)
  }

  return <SlidesClient slides={slides} />
}