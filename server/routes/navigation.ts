/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { logger } from '../../src/logger.js';

const router = express.Router();

// GET /api/navigation - Complete site navigation
router.get('/', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  const navigationResponse = {
    mainMenu: [
      {
        title: 'Programs',
        url: '/programs',
        icon: '🎓',
        description: 'Explore our training programs',
      },
      {
        title: 'LMS',
        url: '/lms',
        icon: '📚',
        description: 'Learning management system',
      },
      {
        title: 'Connect',
        url: '/connect',
        icon: '🤝',
        description: 'Community and networking',
      },
      {
        title: 'Compliance Portal',
        url: '/compliance',
        icon: '📋',
        description: 'Federal compliance information',
        sections: [
          {
            title: 'DOE Compliance',
            items: ['WIOA Certification', 'Training Provider Status', 'Performance Reports'],
          },
          {
            title: 'DWD Integration',
            items: ['Workforce Development Alignment', 'State Reporting', 'Partner Coordination'],
          },
          {
            title: 'DOL Requirements',
            items: ['Equal Opportunity', 'Financial Compliance', 'Data Security'],
          },
        ],
      },
      {
        title: 'Pay',
        url: '/pay',
        icon: '💳',
        description: 'Payment processing and funding',
      },
      {
        title: 'Account',
        url: '/account',
        icon: '👤',
        description: 'Manage your account',
      },
    ],
    
    footerMenu: [
      {
        title: 'About',
        url: '/about',
      },
      {
        title: 'Privacy Policy',
        url: '/privacy',
      },
      {
        title: 'Terms of Service',
        url: '/terms',
      },
      {
        title: 'Contact',
        url: '/contact',
      },
    ],
    
    timestamp: new Date().toISOString(),
    correlationId,
  };

  logger.info({ correlationId }, 'Navigation data requested');
  res.json(navigationResponse);
});

// GET /api/sister-sites - Sister sites ecosystem (legacy endpoint)
router.get('/sister-sites', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  const sisterSitesResponse = {
    brain: 'active',
    ecosystem: 'feeding-main-domain',
    timestamp: new Date().toISOString(),
    correlationId,
    
    sites: {
      main: 'https://www.elevateforhumanity.org',
      programs: '/api/programs',
      hub: '/api/hub',
      lms: '/api/lms',
      connect: '/api/connect',
      compliance: '/api/compliance',
      pay: '/api/stripe',
      branding: '/api/branding',
    },
  };

  logger.info({ correlationId }, 'Sister sites data requested');
  res.json(sisterSitesResponse);
});

// GET /api/integration-guide - Integration guide for main domain
router.get('/integration-guide', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  const integrationGuide = {
    title: 'Elevate for Humanity Brain Integration Guide',
    version: '1.0',
    timestamp: new Date().toISOString(),
    correlationId,
    
    integration: {
      step1: {
        title: 'Include Brain Script',
        description: 'Add the brain integration script to your main domain',
        code: '<script src="https://brain.elevateforhumanity.org/api/widgets/integration.js"></script>',
      },
      step2: {
        title: 'Add Widget Containers',
        description: 'Place these containers where you want widgets to appear',
        examples: [
          {
            name: 'Hero Stats',
            container: '<div id="efh-hero-stats"></div>',
            description: 'Real-time enrollment and completion statistics',
          },
          {
            name: 'Program Carousel',
            container: '<div id="efh-program-carousel"></div>',
            description: 'Interactive program showcase',
          },
          {
            name: 'Success Stories',
            container: '<div id="efh-success-stories"></div>',
            description: 'Graduate testimonials and achievements',
          },
          {
            name: 'Live Feed',
            container: '<div id="efh-live-feed"></div>',
            description: 'Real-time activity and updates',
          },
          {
            name: 'Funding Calculator',
            container: '<div id="efh-funding-calculator"></div>',
            description: 'Interactive funding options calculator',
          },
        ],
      },
      step3: {
        title: 'Navigation Integration',
        description: 'Integrate navigation menu with your existing structure',
        endpoint: '/api/navigation',
      },
    },
  };

  logger.info({ correlationId }, 'Integration guide requested');
  res.json(integrationGuide);
});

export default router;