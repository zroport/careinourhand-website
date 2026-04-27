import { ShieldCheck, AlertTriangle } from "lucide-react"
import { validateInviteToken } from "@/actions/admin/setup-password-actions"
import { SetupPasswordForm } from "./setup-password-form"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Set Up Your Account | Care In Our Hand",
}

interface SetupPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function SetupPasswordPage({ searchParams }: SetupPasswordPageProps) {
  const { token } = await searchParams
  const validation = await validateInviteToken(token ?? "")

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #f5f0f9 0%, #ede0f5 30%, #f0e8fb 60%, #f5f0f9 100%)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(98,14,135,0.12) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(137,197,65,0.10) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="glass-card p-8 shadow-xl">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: "rgba(98,14,135,0.1)" }}
            >
              {validation.valid ? (
                <ShieldCheck className="w-7 h-7" style={{ color: "#620E87" }} aria-hidden="true" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-red-500" aria-hidden="true" />
              )}
            </div>
            <h1 className="text-xl font-bold" style={{ color: "#620E87" }}>
              Care In Our Hand
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {validation.valid ? "Set Up Your Account" : "Invalid Link"}
            </h2>
            {!validation.valid && (
              <p className="text-sm text-red-600 mt-2">{validation.error}</p>
            )}
          </div>

          {validation.valid && (
            <SetupPasswordForm
              token={token!}
              name={validation.name}
              email={validation.email}
            />
          )}

          {!validation.valid && (
            <p className="text-center text-sm text-gray-500">
              Contact your administrator for a new invitation.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
