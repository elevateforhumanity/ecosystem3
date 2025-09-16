const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.LICENSE_SECRET_KEY || "your_super_secret_key";

function validateLicense(req, res, next) {
  const token = req.headers['x-license-token'];
  if (!token) return res.status(403).json({ error: "Missing license token" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.purpose !== "license") return res.status(403).json({ error: "Invalid license purpose" });
    if (decoded.domain !== req.hostname) return res.status(403).json({ error: "License not valid for this domain" });
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired license token" });
  }
}

module.exports = validateLicense;