const fs = require('fs');
const path = require('path');
// ...existing code...
let cached = null;
function getVersionInfo() {
  if (cached) return cached;
  const pkgPath = path.join(process.cwd(), 'package.json');
  let version = process.env.APP_VERSION || null;
  try {
    if (!version && fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      version = pkg.version || '0.0.0';
    }
  } catch { version = '0.0.0'; }
  let gitSha = process.env.GIT_SHA || null;
  try {
    const headFile = path.join(process.cwd(), '.git', 'HEAD');
    if (fs.existsSync(headFile)) {
      const ref = fs.readFileSync(headFile, 'utf8').trim();
      if (ref.startsWith('ref:')) {
        const refPath = path.join(process.cwd(), '.git', ref.split(' ')[1]);
        if (fs.existsSync(refPath)) gitSha = fs.readFileSync(refPath, 'utf8').trim().substring(0, 12);
      } else {
        gitSha = ref.substring(0, 12);
      }
    }
  } catch { /* ignore */ }
  cached = { version: version || '0.0.0', gitSha: gitSha || 'unknown' };
  return cached;
}
// ...existing code...
module.exports = { getVersionInfo };
