import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Clear existing users
    await prisma.user.deleteMany();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Create test user
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      },
    });

    console.log("✅ Seed completed successfully");
    console.log(`📧 Test user created: test@example.com / password123`);
    console.log(`👤 User ID: ${user.id}`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       name: "Alice",
//       email: "alice511515122@prisma.io",
//       password: "securepassword",
//     },
//   });
//   console.log("Created user:", user);
// }

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
