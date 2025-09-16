import express from 'express';
import subscriptionRoutes from '../subscription-routes.js';

export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(subscriptionRoutes);
  return app;
}
