import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const PAGE_DEFAULTS: Array<{ slug: string; title: string; content: Record<string, Record<string, string>> }> = [
  {
    slug: "home",
    title: "Home",
    content: {
      cta: {
        heading: "Ready to Get Started?",
        body: "Whether you're a participant, family member, or support coordinator, we'd love to hear from you. Let's build your support plan together.",
      },
    },
  },
  {
    slug: "about",
    title: "About",
    content: {
      ourStory: {
        heading: "Built on Understanding",
        para1:
          "Care In Our Hand was founded in Sydney after seeing firsthand how many families struggled to find disability support that was culturally appropriate, flexible, and genuinely personal. Too often, participants were treated as numbers in a system rather than individuals with unique goals, backgrounds, and dreams.",
        para2:
          "Our founders brought together years of healthcare experience across the NSW health sector with a deep commitment to doing things differently. We believe that great care starts with understanding — understanding your culture, your language, your family dynamics, and most importantly, your choices.",
        para3:
          "Today, we're proud to serve the South-West Sydney community from our base in Leppington, providing NDIS support services that put you in the driver's seat of your own life.",
      },
      cta: {
        heading: "Want to Know More?",
        body: "We'd love to tell you more about how we can support you or your loved one.",
      },
    },
  },
  {
    slug: "services",
    title: "Services",
    content: {
      cta: {
        heading: "Not Sure Which Service You Need?",
        body: "Our team can help match you with the right support. Get in touch for a free consultation.",
      },
    },
  },
  {
    slug: "careers",
    title: "Careers",
    content: {
      cta: {
        heading: "Join Our Team",
        body: "We're always looking for compassionate people to join us. Apply today and make a difference.",
      },
    },
  },
  {
    slug: "faq",
    title: "FAQ",
    content: {
      cta: {
        heading: "Still Have Questions?",
        body: "Can't find what you're looking for? Our friendly team is happy to help.",
      },
    },
  },
  {
    slug: "contact",
    title: "Contact",
    content: {
      info: {
        address: "15 Gribbin Road\nLeppington NSW 2179",
        phone: "1300 XXX XXX",
        email: "info@careinourhand.com.au",
        hoursWeekday: "Monday – Friday: 8:00 AM – 6:00 PM",
        hoursSaturday: "Saturday: 9:00 AM – 2:00 PM",
        hoursSunday: "Sunday: Closed",
      },
    },
  },
]

async function main() {
  console.log("Seeding pages…")
  for (const page of PAGE_DEFAULTS) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
    console.log(`  ✓ "${page.title}"`)
  }
  console.log("Pages seeded.")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
