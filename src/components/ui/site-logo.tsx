import { getLogos } from "@/lib/logos"

type LogoType = "favicon" | "horizontal" | "vertical" | "footer" | "fullHeader"

interface SiteLogoProps {
  type: LogoType
  className?: string
  alt?: string
}

const TYPE_TO_FIELD: Record<LogoType, string> = {
  favicon: "faviconUrl",
  horizontal: "horizontalLogoUrl",
  vertical: "verticalLogoUrl",
  footer: "footerLogoUrl",
  fullHeader: "fullHeaderLogoUrl",
}

export async function SiteLogo({ type, className, alt = "Care In Our Hand" }: SiteLogoProps) {
  const logos = await getLogos()
  const field = TYPE_TO_FIELD[type] as keyof typeof logos
  const url = logos?.[field] as string | null | undefined

  if (!url) {
    return (
      <span className={className} style={{ fontWeight: 700 }}>
        Care In Our Hand
      </span>
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className={className} />
}
