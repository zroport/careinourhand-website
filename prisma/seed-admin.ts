import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@careinourhand.com.au" },
    update: {},
    create: {
      email: "admin@careinourhand.com.au",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Admin user created/verified:", admin.email)
  console.log("")
  console.log("⚠️  IMPORTANT: Change the default password immediately!")
  console.log("   Default credentials:")
  console.log("   Email:    admin@careinourhand.com.au")
  console.log("   Password: admin123")
  console.log("")
  console.log("   Log in at: http://localhost:3000/admin/login")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
