import { getLogos } from "@/lib/logos"
import { LoginForm } from "@/components/admin/login-form"

export default async function AdminLoginPage() {
  const logos = await getLogos()

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #f5f0f9 0%, #ede0f5 30%, #f0e8fb 60%, #f5f0f9 100%)",
      }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(98,14,135,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(137,197,65,0.10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <LoginForm logoUrl={logos?.verticalLogoUrl} />
      </div>
    </div>
  )
}
