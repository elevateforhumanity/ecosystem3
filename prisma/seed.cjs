#!/usr/bin/env node
/* Seed script: idempotent inserts of representative data */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

(async () => {
  console.log('Seeding start');
  // Affiliate sample
  const sampleAffiliateEmail = 'sample-affiliate@example.com';
  const existingA = await prisma.affiliate.findFirst({ where: { email: sampleAffiliateEmail } });
  if (!existingA) {
    await prisma.affiliate.create({ data: { code: 'sample01', email: sampleAffiliateEmail, name: 'Sample Affiliate', website: 'https://example.com' } });
    console.log('Inserted sample affiliate');
  } else console.log('Affiliate already exists');

  // Directory sample
  const sampleDirName = 'Sample Tool';
  const existingD = await prisma.directoryListing.findFirst({ where: { name: sampleDirName } });
  if (!existingD) {
    await prisma.directoryListing.create({ data: { name: sampleDirName, category: 'tools', url: 'https://example.com/tool', description: 'Example listing seeded', plan: 'standard', status: 'approved' } });
    console.log('Inserted sample directory listing');
  } else console.log('Directory listing exists');

  // Validate pricing exists for readiness (warn if empty)
  try {
    const pagesFile = path.join(process.cwd(), 'content', 'pages.json');
    if (fs.existsSync(pagesFile)) {
      const pages = JSON.parse(fs.readFileSync(pagesFile, 'utf8'));
      const plans = pages?.pricing?.plans || [];
      if (!plans.length) console.warn('WARN: No pricing plans defined in content/pages.json');
    }
  } catch (e) { console.warn('WARN: pricing validation failed', e.message); }

  await prisma.$disconnect();
  console.log('Seeding complete');
})().catch(async e => { console.error(e); await prisma.$disconnect(); process.exit(1); });
