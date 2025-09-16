// Simple semantic search using workspace code/comments
const fs = require('fs');
const path = require('path');

function semanticSearch(query) {
  // Scan .md, .js, .html files for relevant lines
  const exts = ['.md', '.js', '.html'];
  const root = path.resolve(__dirname, '..');
  let results = [];
  function scanDir(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full);
      } else if (exts.includes(path.extname(file))) {
        const lines = fs.readFileSync(full, 'utf8').split('\n');
        lines.forEach((line, i) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({ file: full, line: i+1, text: line });
          }
        });
      }
    }
  }
  scanDir(root);
  return results.slice(0, 10); // Top 10 matches
}

module.exports = { semanticSearch };
