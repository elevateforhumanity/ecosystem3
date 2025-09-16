let prisma = null;

async function getPrisma() {
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    await prisma.$connect();
    return prisma;
  } catch (e) {
    return null; // fallback to in-memory if unavailable
  }
}

module.exports = { getPrisma };
