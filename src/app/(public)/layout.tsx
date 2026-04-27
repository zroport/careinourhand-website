import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { getSiteSettings, setting } from "@/lib/site-settings"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings()
  const phone = setting(s, "phone", "1300 XXX XXX")
  const email = setting(s, "email", "info@careinourhand.com.au")
  const abn = setting(s, "abn", "XX XXX XXX XXX")

  return (
    <>
      <Header phone={phone} email={email} />
      <main className="flex-1">{children}</main>
      <Footer phone={phone} email={email} abn={abn} />
      <ScrollToTop />
    </>
  )
}
