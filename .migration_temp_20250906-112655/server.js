// Main deployment entry point
// This file ensures deployment systems can find the correct server
// Redirects to the stable CommonJS server for better compatibility
console.log("🔄 Starting server via server.js...");
console.log("➡️  Redirecting to simple-server.js for deployment compatibility");
require("./simple-server.js");
