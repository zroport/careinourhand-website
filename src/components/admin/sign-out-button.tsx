"use client"

import { LogOut } from "lucide-react"
import { signOutAction } from "@/actions/auth"

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        aria-label="Sign out of admin panel"
      >
        <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Sign Out</span>
      </button>
    </form>
  )
}
