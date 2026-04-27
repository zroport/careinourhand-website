import { prisma } from "@/lib/prisma"

export type FieldType = "text" | "textarea"

export interface ContentField {
  key: string
  label: string
  type: FieldType
  default: string
}

export interface ContentSection {
  key: string
  label: string
  fields: ContentField[]
}

export interface PageSchema {
  slug: string
  title: string
  sections: ContentSection[]
}

export type ContentBlock = Record<string, Record<string, string>>

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    slug: "home",
    title: "Home",
    sections: [
      {
        key: "cta",
        label: "CTA Banner",
        fields: [
          { key: "heading", label: "Heading", type: "text", default: "Ready to Get Started?" },
          {
            key: "body",
            label: "Body Text",
            type: "textarea",
            default:
              "Whether you're a participant, family member, or support coordinator, we'd love to hear from you. Let's build your support plan together.",
          },
        ],
      },
    ],
  },
  {
    slug: "about",
    title: "About",
    sections: [
      {
        key: "ourStory",
        label: "Our Story",
        fields: [
          { key: "heading", label: "Heading", type: "text", default: "Built on Understanding" },
          {
            key: "para1",
            label: "Paragraph 1",
            type: "textarea",
            default:
              "Care In Our Hand was founded in Sydney after seeing firsthand how many families struggled to find disability support that was culturally appropriate, flexible, and genuinely personal. Too often, participants were treated as numbers in a system rather than individuals with unique goals, backgrounds, and dreams.",
          },
          {
            key: "para2",
            label: "Paragraph 2",
            type: "textarea",
            default:
              "Our founders brought together years of healthcare experience across the NSW health sector with a deep commitment to doing things differently. We believe that great care starts with understanding — understanding your culture, your language, your family dynamics, and most importantly, your choices.",
          },
          {
            key: "para3",
            label: "Paragraph 3",
            type: "textarea",
            default:
              "Today, we're proud to serve the South-West Sydney community from our base in Leppington, providing NDIS support services that put you in the driver's seat of your own life.",
          },
        ],
      },
      {
        key: "cta",
        label: "CTA Banner",
        fields: [
          { key: "heading", label: "Heading", type: "text", default: "Want to Know More?" },
          {
            key: "body",
            label: "Body Text",
            type: "textarea",
            default: "We'd love to tell you more about how we can support you or your loved one.",
          },
        ],
      },
    ],
  },
  {
    slug: "services",
    title: "Services",
    sections: [
      {
        key: "cta",
        label: "CTA Banner",
        fields: [
          {
            key: "heading",
            label: "Heading",
            type: "text",
            default: "Not Sure Which Service You Need?",
          },
          {
            key: "body",
            label: "Body Text",
            type: "textarea",
            default:
              "Our team can help match you with the right support. Get in touch for a free consultation.",
          },
        ],
      },
    ],
  },
  {
    slug: "careers",
    title: "Careers",
    sections: [
      {
        key: "cta",
        label: "CTA Banner",
        fields: [
          { key: "heading", label: "Heading", type: "text", default: "Join Our Team" },
          {
            key: "body",
            label: "Body Text",
            type: "textarea",
            default:
              "We're always looking for compassionate people to join us. Apply today and make a difference.",
          },
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    sections: [
      {
        key: "cta",
        label: "CTA Banner",
        fields: [
          { key: "heading", label: "Heading", type: "text", default: "Still Have Questions?" },
          {
            key: "body",
            label: "Body Text",
            type: "textarea",
            default: "Can't find what you're looking for? Our friendly team is happy to help.",
          },
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    sections: [
      {
        key: "info",
        label: "Contact Information",
        fields: [
          {
            key: "address",
            label: "Address",
            type: "textarea",
            default: "15 Gribbin Road\nLeppington NSW 2179",
          },
          { key: "phone", label: "Phone", type: "text", default: "1300 XXX XXX" },
          { key: "email", label: "Email", type: "text", default: "info@careinourhand.com.au" },
          {
            key: "hoursWeekday",
            label: "Weekday Hours",
            type: "text",
            default: "Monday – Friday: 8:00 AM – 6:00 PM",
          },
          {
            key: "hoursSaturday",
            label: "Saturday Hours",
            type: "text",
            default: "Saturday: 9:00 AM – 2:00 PM",
          },
          { key: "hoursSunday", label: "Sunday Hours", type: "text", default: "Sunday: Closed" },
        ],
      },
    ],
  },
]

export function getPageSchema(slug: string): PageSchema | undefined {
  return PAGE_SCHEMAS.find((p) => p.slug === slug)
}

export function buildDefaultContent(schema: PageSchema): ContentBlock {
  const content: ContentBlock = {}
  for (const section of schema.sections) {
    content[section.key] = {}
    for (const field of section.fields) {
      content[section.key][field.key] = field.default
    }
  }
  return content
}

export async function getPageContent(slug: string): Promise<ContentBlock> {
  const schema = getPageSchema(slug)
  const defaults = schema ? buildDefaultContent(schema) : {}

  try {
    const page = await prisma.page.findUnique({ where: { slug } })
    if (!page?.content) return defaults

    const stored = page.content as ContentBlock
    // Deep merge: stored values override defaults
    const merged: ContentBlock = { ...defaults }
    for (const sectionKey of Object.keys(stored)) {
      merged[sectionKey] = { ...(defaults[sectionKey] ?? {}), ...stored[sectionKey] }
    }
    return merged
  } catch {
    return defaults
  }
}
