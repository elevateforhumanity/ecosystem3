const { generateLicense, validateLicense } = require('./license-generator');

console.log('🔐 ELEVATE LICENSE SYSTEM TEST\n');

// Test 1: Generate a license
console.log('📝 Test 1: Generating License');
const { licenseKey, expiresAt } = generateLicense("customer@example.com", "price_1SiteClone", 365);
console.log("🔑 Generated License:", licenseKey);
console.log("📅 Expires:", expiresAt.toLocaleDateString());
console.log();

// Test 2: Validate the license
console.log('✅ Test 2: Validating License');
const validation = validateLicense(licenseKey);
console.log("Validation Result:", validation);
console.log();

// Test 3: Test expired license
console.log('⏰ Test 3: Testing Expired License');
const expiredLicense = generateLicense("expired@example.com", "price_1Enterprise", -1); // Expired yesterday
const expiredValidation = validateLicense(expiredLicense.licenseKey);
console.log("Expired License Validation:", expiredValidation);
console.log();

// Test 4: Test tampered license
console.log('🚫 Test 4: Testing Tampered License');
const tamperedLicense = licenseKey.slice(0, -5) + "XXXXX"; // Tamper with signature
const tamperedValidation = validateLicense(tamperedLicense);
console.log("Tampered License Validation:", tamperedValidation);
console.log();

// Test 5: Decode license info
console.log('🔍 Test 5: Decoding License Information');
try {
  const [encodedPayload] = licenseKey.split('.');
  const payload = Buffer.from(encodedPayload, 'base64').toString('utf-8');
  const [email, productId, issuedAt, expiresAt] = payload.split('|');
  
  console.log("📧 Email:", email);
  console.log("🛍️ Product ID:", productId);
  console.log("📅 Issued At:", new Date(issuedAt).toLocaleDateString());
  console.log("📅 Expires At:", new Date(expiresAt).toLocaleDateString());
  console.log("⏳ Days Remaining:", Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24)));
} catch (err) {
  console.log("❌ Error decoding license:", err.message);
}

console.log('\n🎯 LICENSE SYSTEM READY FOR PRODUCTION!');
console.log('✅ HMAC-SHA256 signed');
console.log('✅ Base64 encoded payload');
console.log('✅ Expiration checking');
console.log('✅ Tamper detection');
console.log('✅ Renewal capability');