// Fallback Prisma export to prevent module loading errors  
// This allows services to import from './prisma' path

try {
  const prismaService = require('../services/prisma.cjs');
  module.exports = {
    getPrisma: prismaService.getPrisma
  };
} catch (err) {
  // Fallback if prisma service not available
  module.exports = {
    getPrisma: async () => null
  };
}