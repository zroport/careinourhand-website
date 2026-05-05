import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const logos = await prisma.siteLogos.findFirst({ where: { siteId: "default" } })
    return NextResponse.json(logos ?? {})
  } catch {
    return NextResponse.json({})
  }
}
