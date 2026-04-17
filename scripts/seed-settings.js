const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { randomBytes } = require("crypto");
function cuid() {
  return "c" + randomBytes(11).toString("base64url").slice(0, 24);
}

const defaults = [
  { key: "business_name", value: "Care In Our Hand" },
  { key: "tagline", value: "Your Life, In Caring Hands." },
  { key: "phone", value: "1300 XXX XXX" },
  { key: "email", value: "info@careinourhand.com.au" },
  { key: "address", value: "15 Gribbin Road, Leppington NSW 2179" },
  { key: "abn", value: "XX XXX XXX XXX" },
  { key: "facebook_url", value: "" },
  { key: "instagram_url", value: "" },
  { key: "linkedin_url", value: "" },
  {
    key: "office_hours",
    value:
      "Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM, Sunday: Closed",
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
    let inserted = 0;

    for (const setting of defaults) {
      const id = cuid();
      const result = await client.query(
        `INSERT INTO "SiteSetting" (id, key, value)
         VALUES ($1, $2, $3)
         ON CONFLICT (key) DO NOTHING
         RETURNING id`,
        [id, setting.key, setting.value]
      );
      if (result.rowCount > 0) inserted++;
    }

    console.log(`✅ Seeded ${inserted} settings (${defaults.length - inserted} already existed)`);
  } catch (err) {
    console.error("ERROR seeding settings:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
