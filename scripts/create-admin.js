const bcrypt = require("bcryptjs");
const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL not found in .env");
    process.exit(1);
  }

  const email = "admin@careinourhand.com.au";
  const name = "Admin";
  const password = "admin123";
  const role = "ADMIN";
  const now = new Date().toISOString();

  // Generate a cuid-compatible id using crypto
  const { randomBytes } = require("crypto");
  const id = "c" + randomBytes(11).toString("base64url").slice(0, 24);

  const hashedPassword = await bcrypt.hash(password, 12);

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();

    const result = await client.query(
      `INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [id, name, email, hashedPassword, role, now, now]
    );

    if (result.rowCount === 0) {
      console.log(`ℹ️  Admin user already exists: ${email}`);
    } else {
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role:     ${role}`);
      console.log("");
      console.log(`⚠️  Remember to change the password after first login.`);
    }
  } catch (err) {
    console.error("ERROR creating admin user:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
