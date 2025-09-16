const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function saveDirectory(entry) {
  return await prisma.directoryListing.upsert({
    where: { id: entry.id },
    update: entry,
    create: entry
  });
}

async function getDirectory(id) {
  return await prisma.directoryListing.findUnique({ where: { id } });
}

async function getDirectories() {
  return await prisma.directoryListing.findMany();
}

module.exports = {
  saveDirectory,
  getDirectory,
  getDirectories
};
