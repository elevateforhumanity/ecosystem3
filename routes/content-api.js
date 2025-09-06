
import express from 'express';
import { contentLibrary } from '../lib/content-library.js';

const router = express.Router();

// Get content library structure
router.get('/library', async (req, res) => {
  try {
    const library = contentLibrary.getContentLibrary();
    res.json(library);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load content library' });
  }
});

// Get module content (LearnKey-style)
router.get('/content/:courseId/:moduleId', async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const content = await contentLibrary.getModuleContent(courseId, moduleId);
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load module content' });
  }
});

// Search content (LearnKey-style)
router.get('/search', async (req, res) => {
  try {
    const { q: query, category, type } = req.query;
    const filters = { category, type };
    const results = contentLibrary.searchContent(query, filters);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Update progress (with federal tracking)
router.post('/progress/:courseId/:moduleId', async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { userId } = req.user; // from auth middleware
    const progressData = req.body;
    
    const progress = contentLibrary.updateProgress(userId, courseId, moduleId, progressData);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get learning paths
router.get('/learning-paths', async (req, res) => {
  try {
    const paths = Array.from(contentLibrary.learningPaths.values());
    res.json(paths);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load learning paths' });
  }
});

// Generate progress report (federal compliance ready)
router.get('/reports/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    const report = contentLibrary.generateProgressReport(userId, { startDate, endDate });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export { router as contentRouter };
