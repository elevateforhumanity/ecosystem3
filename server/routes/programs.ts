/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { stubData } from '../services/database.js';

const router = express.Router();

// GET /api/programs - Get all programs
router.get('/', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  const programs = [
    {
      id: 'ai-fundamentals',
      title: 'AI Fundamentals',
      description: 'Learn the basics of artificial intelligence and machine learning',
      duration: '12 weeks',
      price: 1997,
      level: 'beginner',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'AI Ethics'],
      outcomes: ['Build AI models', 'Understand ML algorithms', 'Deploy AI solutions'],
    },
    {
      id: 'data-science-bootcamp',
      title: 'Data Science Bootcamp',
      description: 'Comprehensive training in data science and analytics',
      duration: '16 weeks',
      price: 2997,
      level: 'intermediate',
      skills: ['Python', 'R', 'SQL', 'Statistics', 'Data Visualization'],
      outcomes: ['Analyze complex datasets', 'Build predictive models', 'Create dashboards'],
    },
    {
      id: 'machine-learning-advanced',
      title: 'Advanced Machine Learning',
      description: 'Deep dive into advanced ML techniques and applications',
      duration: '20 weeks',
      price: 3997,
      level: 'advanced',
      skills: ['Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision'],
      outcomes: ['Build deep learning models', 'Implement neural networks', 'Deploy ML systems'],
    },
  ];

  res.json({
    programs,
    timestamp: new Date().toISOString(),
    correlationId,
  });
});

export default router;