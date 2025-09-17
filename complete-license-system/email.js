const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendLicenseEmail(to, licenseKey, productId, productName, downloadLinks = []) {
  const mailOptions = {
    from: '"Elevate Platform Store" <' + process.env.EMAIL_USER + '>',
    to,
    subject: `🎯 Your ${productName} License - Key: ${licenseKey}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 2rem; background: #f9f9f9; }
    .license-key { background: #e3f2fd; padding: 1rem; border-radius: 4px; font-family: monospace; font-size: 1.2em; font-weight: bold; text-align: center; margin: 1rem 0; border: 2px dashed #2196f3; }
    .download-section { background: white; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #28a745; }
    .download-btn { display: inline-block; background: #28a745; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 5px; margin: 0.5rem 0.5rem 0.5rem 0; }
    .footer { background: #333; color: white; padding: 1rem; text-align: center; font-size: 0.9em; border-radius: 0 0 8px 8px; }
    .important { background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 Your Elevate Platform Purchase</h1>
    <p>License delivered instantly - Ready to download!</p>
  </div>
  
  <div class="content">
    <h2>Thank you for purchasing ${productName}!</h2>
    
    <div class="important">
      <h3>🔐 Your License Key:</h3>
      <div class="license-key">${licenseKey}</div>
      <p><strong>Keep this key safe!</strong> You'll need it for software activation and support requests.</p>
    </div>
    
    <div class="download-section">
      <h3>📥 Download Your Files:</h3>
      ${downloadLinks.length > 0 ? 
        downloadLinks.map(link => `<a href="${link}?license=${licenseKey}" class="download-btn">📥 Download ${link.split('/').pop()}</a>`).join('') :
        `<a href="https://elevateforhumanity.com/downloads/${productId}.zip?license=${licenseKey}" class="download-btn">📥 Download ${productName}</a>`
      }
      <p><small>💡 Download links are valid for 30 days and include your license key for verification.</small></p>
    </div>
    
    <h3>🎯 Next Steps:</h3>
    <ol>
      <li><strong>Download</strong> your files using the links above</li>
      <li><strong>Extract</strong> the files to your desired location</li>
      <li><strong>Follow</strong> the setup guide included in your download</li>
      <li><strong>Enter</strong> your license key when prompted during installation</li>
      <li><strong>Join</strong> our community: <a href="https://discord.gg/elevate">Discord Support</a></li>
    </ol>
    
    <div class="important">
      <h4>🛠️ Need Help?</h4>
      <ul>
        <li><strong>Email:</strong> support@elevateforhumanity.com</li>
        <li><strong>Include your license key</strong> in all support requests</li>
        <li><strong>Response time:</strong> Usually within 24 hours</li>
        <li><strong>Documentation:</strong> <a href="https://docs.elevateforhumanity.com">docs.elevateforhumanity.com</a></li>
      </ul>
    </div>
  </div>
  
  <div class="footer">
    <p>© 2024 Selfish Inc. DBA Rise Foundation | Licensed Use Only</p>
    <p>License Key: ${licenseKey} | Need help? support@elevateforhumanity.com</p>
  </div>
</body>
</html>
    `,
    text: `
Hi,

Thank you for purchasing ${productName}!

Your license key: ${licenseKey}

Download link:
https://elevateforhumanity.com/downloads/${productId}.zip?license=${licenseKey}

Please keep this key safe - you'll need it for activation and support.

Need help? Email support@elevateforhumanity.com with your license key.

Best regards,
The Elevate Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📩 License email sent to', to);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

// Test email function
async function testEmail() {
  try {
    await sendLicenseEmail(
      'test@example.com',
      'ELV-TEST-12345-ABCD',
      'test-product',
      'Test Product',
      ['https://example.com/test.zip']
    );
    console.log('✅ Test email sent successfully');
  } catch (error) {
    console.error('❌ Test email failed:', error);
  }
}

module.exports = { sendLicenseEmail, testEmail };