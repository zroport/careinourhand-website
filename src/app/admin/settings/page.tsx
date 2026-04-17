import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "@/components/admin/settings/settings-form"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Site Settings | Admin",
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const rows = await prisma.siteSetting.findMany()
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
      {rows.length === 0 && (
        <div className="glass-card p-4 border border-amber-100">
          <p className="text-sm text-amber-700">
            No settings in the database yet. Run{" "}
            <code className="bg-amber-50 px-1 rounded">npm run seed:settings</code> to populate defaults.
          </p>
        </div>
      )}
      <SettingsForm settings={settings} />
    </div>
  )
}
