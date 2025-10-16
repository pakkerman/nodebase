import { PrismaClient } from "@/generated/prisma";

// create a global prisma client object that will presist between hot reloads
// this is only for development
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
