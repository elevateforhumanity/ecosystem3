let prisma = null;
let memoryLeads = [];
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch { /* prisma optional */ }

async function saveLead(entry) {
  if (prisma) {
    try { return await prisma.lead.create({ data: entry }); } catch { /* fallback */ }
  }
  const rec = { id: entry.id || (Date.now()+ '-' + Math.random().toString(36).slice(2)), ...entry };
  memoryLeads.push(rec);
  return rec;
}

async function getLeads() {
  if (prisma) {
    try { return await prisma.lead.findMany(); } catch { /* fallback */ }
  }
  return [...memoryLeads];
}

module.exports = { saveLead, getLeads };
