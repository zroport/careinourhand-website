import { prisma } from "@/lib/prisma"

export type SiteSettingsMap = Record<string, string>

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const rows = await prisma.siteSetting.findMany()
    return Object.fromEntries(rows.map((r) => [r.key, r.value]))
  } catch {
    return {}
  }
}

export function setting(map: SiteSettingsMap, key: string, fallback = ""): string {
  return map[key] ?? fallback
}
