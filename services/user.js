const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser({ email, password, name, role }) {
  return await prisma.lmsUser.create({ data: { email, password, name, role } });
}

async function getUserByEmail(email) {
  return await prisma.lmsUser.findUnique({ where: { email } });
}

async function updateUser(email, data) {
  return await prisma.lmsUser.update({ where: { email }, data });
}

module.exports = {
  createUser,
  getUserByEmail,
  updateUser
};
