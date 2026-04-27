import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const superAdminPassword = await bcrypt.hash("SuperAdmin@1234", 10)
  const adminPassword = await bcrypt.hash("Admin@1234", 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@careinourhand.com.au" },
    update: { password: superAdminPassword, role: "SUPER_ADMIN" },
    create: {
      email: "superadmin@careinourhand.com.au",
      name: "Super Admin",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: "admin@careinourhand.com.au" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      email: "admin@careinourhand.com.au",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Super Admin:", superAdmin.email, "| Role:", superAdmin.role)
  console.log("✅ Admin:", admin.email, "| Role:", admin.role)
  console.log("")
  console.log("🔑 Your login:   superadmin@careinourhand.com.au / SuperAdmin@1234")
  console.log("🔑 Client login: admin@careinourhand.com.au / Admin@1234")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })