const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.static('.'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', port: PORT });
});

// Sister sites routing
const sites = ['hub', 'programs', 'lms', 'connect', 'compliance', 'pay', 'partners', 'account'];
sites.forEach(site => {
  app.get(`/${site}`, (req, res) => {
    const file = `${site}.html`;
    if (fs.existsSync(file)) {
      res.sendFile(path.join(__dirname, file));
    } else {
      res.redirect('/');
    }
  });
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EFH Server running on http://0.0.0.0:${PORT}`);
  console.log('✅ All sister sites accessible');
  console.log('💰 Emergency sale platform LIVE');
});