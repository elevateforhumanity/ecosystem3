const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function saveAffiliate(entry) {
  return await prisma.affiliate.upsert({
    where: { code: entry.code },
    update: entry,
    create: entry
  });
}

async function getAffiliate(code) {
  return await prisma.affiliate.findUnique({ where: { code } });
}

async function getAffiliates() {
  return await prisma.affiliate.findMany();
}

module.exports = {
  saveAffiliate,
  getAffiliate,
  getAffiliates
};
