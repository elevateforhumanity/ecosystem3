
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve React build first (if it exists)
const distPath = path.join(__dirname, 'client', 'dist');
try {
  app.use(express.static(distPath, { maxAge: '1h' }));
  console.log('✅ Serving React build from client/dist');
} catch (error) {
  console.log('⚠️ React build not found, serving static files');
}

// Fallback to root static files
app.use(express.static('.', { maxAge: '1h' }));
app.use(express.json({ limit: '10mb' }));

// Health checks BEFORE catch-all
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
app.get('/api/health', (req, res) => res.json({ status: 'healthy', port: PORT }));

// React SPA fallback (must be last)
app.get('*', (req, res) => {
  const reactIndex = path.join(distPath, 'index.html');
  if (require('fs').existsSync(reactIndex)) {
    res.sendFile(reactIndex);
  } else {
    // Fallback to root index.html
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Fast server running on port ${PORT}`);
  console.log(`📦 Serving optimized React build`);
});
