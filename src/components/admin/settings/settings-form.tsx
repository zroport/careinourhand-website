"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSettings, updatePassword } from "@/actions/admin/update-settings"

type SettingsMap = Record<string, string>

interface SettingsFormProps {
  settings: SettingsMap
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Minimum 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
})

type PasswordValues = z.infer<typeof passwordSchema>

export function SettingsForm({ settings: initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<SettingsMap>(initialSettings)
  const [isSaving, startSaveTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle")

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    setError: setPwdError,
    formState: { errors: pwdErrors },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) })

  const [isPwdPending, startPwdTransition] = useTransition()
  const [pwdStatus, setPwdStatus] = useState<"idle" | "saved" | "error">("idle")

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaveStatus("idle")
  }

  function handleSave() {
    startSaveTransition(async () => {
      const result = await updateSettings(settings)
      setSaveStatus(result.error ? "error" : "saved")
    })
  }

  function onPasswordSubmit(data: PasswordValues) {
    startPwdTransition(async () => {
      const result = await updatePassword(data)
      if (result.error) {
        setPwdError("root", { message: result.error })
        setPwdStatus("error")
      } else {
        setPwdStatus("saved")
        resetPwd()
      }
    })
  }

  function field(key: string, label: string, type: "text" | "email" | "url" | "textarea" = "text") {
    const value = settings[key] ?? ""
    const id = `setting-${key}`
    return (
      <div key={key} className="space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        {type === "textarea" ? (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={3}
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Business Information */}
      <section className="glass-card p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800">Business Information</h2>
        {field("business_name", "Business Name")}
        {field("tagline", "Tagline")}
        {field("abn", "ABN")}
      </section>

      {/* Contact Details */}
      <section className="glass-card p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800">Contact Details</h2>
        {field("phone", "Phone Number")}
        {field("email", "Email Address", "email")}
        {field("address", "Address")}
        {field("office_hours", "Office Hours", "textarea")}
      </section>

      {/* Social Media */}
      <section className="glass-card p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800">Social Media</h2>
        {field("facebook_url", "Facebook URL", "url")}
        {field("instagram_url", "Instagram URL", "url")}
        {field("linkedin_url", "LinkedIn URL", "url")}
      </section>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#89C541] hover:bg-[#6da033] text-white"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
        {saveStatus === "saved" && (
          <span className="text-sm text-green-600 font-medium">Settings saved.</span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm text-red-500">Failed to save. Please try again.</span>
        )}
      </div>

      {/* Danger Zone */}
      <section className="glass-card p-6 space-y-5 border border-red-200">
        <h2 className="text-base font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-gray-600 font-medium">Change Admin Password</p>

        <form onSubmit={handlePwd(onPasswordSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <Input id="currentPassword" type="password" {...regPwd("currentPassword")} autoComplete="current-password" />
            {pwdErrors.currentPassword && (
              <p className="text-xs text-red-500">{pwdErrors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password *</Label>
            <Input id="newPassword" type="password" {...regPwd("newPassword")} autoComplete="new-password" />
            {pwdErrors.newPassword && (
              <p className="text-xs text-red-500">{pwdErrors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
            <Input id="confirmPassword" type="password" {...regPwd("confirmPassword")} autoComplete="new-password" />
            {pwdErrors.confirmPassword && (
              <p className="text-xs text-red-500">{pwdErrors.confirmPassword.message}</p>
            )}
          </div>

          {pwdErrors.root && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {pwdErrors.root.message}
            </p>
          )}

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isPwdPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isPwdPending ? "Updating..." : "Update Password"}
            </Button>
            {pwdStatus === "saved" && (
              <span className="text-sm text-green-600 font-medium">Password updated.</span>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
