const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { randomBytes } = require("crypto");
function cuid() {
  return "c" + randomBytes(11).toString("base64url").slice(0, 24);
}

const slides = [
  {
    title: "Caring for You, Every Step of the Way",
    subtitle: "Professional NDIS support services in Leppington and surrounding areas",
    imageUrl: null,
    buttonText: "Our Services",
    buttonLink: "/services",
    order: 1,
    isActive: true,
  },
  {
    title: "Your Goals, Our Mission",
    subtitle: "Personalised disability support tailored to your individual needs",
    imageUrl: null,
    buttonText: "Make a Referral",
    buttonLink: "/referral",
    order: 2,
    isActive: true,
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL not found in .env");
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    const now = new Date().toISOString();
    let inserted = 0;
    let updated = 0;

    for (const slide of slides) {
      const existing = await client.query(
        `SELECT id FROM "HeroSlide" WHERE title = $1`,
        [slide.title]
      );

      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE "HeroSlide"
           SET subtitle = $1, "imageUrl" = $2, "buttonText" = $3, "buttonLink" = $4,
               "order" = $5, "isActive" = $6, "updatedAt" = $7
           WHERE title = $8`,
          [slide.subtitle, slide.imageUrl, slide.buttonText, slide.buttonLink,
           slide.order, slide.isActive, now, slide.title]
        );
        updated++;
      } else {
        const id = cuid();
        await client.query(
          `INSERT INTO "HeroSlide" (id, title, subtitle, "imageUrl", "buttonText", "buttonLink", "order", "isActive", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [id, slide.title, slide.subtitle, slide.imageUrl, slide.buttonText,
           slide.buttonLink, slide.order, slide.isActive, now, now]
        );
        inserted++;
      }
    }

    console.log(`✅ Slides seeded: ${inserted} inserted, ${updated} updated`);
  } catch (err) {
    console.error("ERROR seeding slides:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
