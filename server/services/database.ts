/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import { PrismaClient } from '@prisma/client';
import { logger } from '../../src/logger.js';
import { loadEnv } from '../../src/env.js';

let prisma: PrismaClient | null = null;
let isDbEnabled = false;

// Initialize Prisma client if DATABASE_URL is available
export function initializeDatabase() {
  try {
    const env = loadEnv();
    
    if (!env.DATABASE_URL) {
      logger.info('No DATABASE_URL provided, running in stub mode');
      isDbEnabled = false;
      return;
    }

    prisma = new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

    isDbEnabled = true;
    logger.info('Database connection initialized');
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to initialize database');
    isDbEnabled = false;
  }
}

// Get database connection (with auto-initialization)
export function getDatabase(): PrismaClient | null {
  if (!prisma && isDbEnabled === undefined) {
    initializeDatabase();
  }
  return prisma;
}

// Check database status for health checks
export async function getDatabaseStatus() {
  if (!isDbEnabled) {
    return {
      status: 'disabled',
      message: 'Database not configured, using in-memory stub',
    };
  }

  try {
    const db = getDatabase();
    if (!db) {
      return {
        status: 'error',
        message: 'Database client not initialized',
      };
    }

    // Simple connection test
    await db.$queryRaw`SELECT 1`;
    
    return {
      status: 'connected',
      message: 'Database connection healthy',
    };
  } catch (error: any) {
    logger.error({ err: error }, 'Database health check failed');
    return {
      status: 'error',
      message: error.message,
    };
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  }
}

// In-memory stub data for when database is not available
export const stubData = {
  courses: [
    {
      id: 'ai-fundamentals',
      title: 'AI Fundamentals',
      description: 'Learn the basics of artificial intelligence',
      price: 1997,
      published: true,
      createdAt: new Date(),
    },
    {
      id: 'data-science-bootcamp',
      title: 'Data Science Bootcamp',
      description: 'Comprehensive data science training',
      price: 2997,
      published: true,
      createdAt: new Date(),
    },
    {
      id: 'machine-learning-advanced',
      title: 'Advanced Machine Learning',
      description: 'Advanced ML techniques and applications',
      price: 3997,
      published: true,
      createdAt: new Date(),
    },
  ],
  
  lessons: [
    {
      id: 'intro-to-ai',
      courseId: 'ai-fundamentals',
      title: 'Introduction to AI',
      content: 'Welcome to the world of artificial intelligence...',
      type: 'TEXT',
      duration: 1800,
      order: 1,
    },
    {
      id: 'ai-history',
      courseId: 'ai-fundamentals',
      title: 'History of AI',
      content: 'AI has a rich history dating back to...',
      type: 'TEXT',
      duration: 1200,
      order: 2,
    },
  ],
  
  users: [] as any[],
  enrollments: [] as any[],
  progress: [] as any[],
};

// Auto-initialize on import
initializeDatabase();