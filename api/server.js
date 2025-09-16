// Vercel serverless entrypoint wrapping Express app
const app = require('../simple-server.cjs');
module.exports = (req, res) => {
  return app(req, res);
};
