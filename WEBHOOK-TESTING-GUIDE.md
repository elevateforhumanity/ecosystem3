# 🧪 Elevate Webhook Testing Guide

## Quick Setup & Test (5 Minutes)

### 1. **Deploy Webhook Server**
```bash
# Run the deployment script
./deploy-webhook.sh

# Or manual setup:
cd elevate-webhook
npm install
npm start
```

### 2. **Configure Stripe Webhook**
```bash
# In Stripe Dashboard > Developers > Webhooks
# Add endpoint: https://your-domain.com/webhook
# Select events: checkout.session.completed

# For local testing:
stripe listen --forward-to localhost:4242/webhook
```

### 3. **Test Payment Flow**
```bash
# Use Stripe test card: 4242 4242 4242 4242
# Any future date, any CVC
# Test email: test@example.com
```

---

## 🔍 Testing Checklist

### ✅ **Webhook Functionality**
- [ ] Server starts without errors
- [ ] Health check responds: `GET /health`
- [ ] Webhook receives Stripe events
- [ ] License keys are generated
- [ ] Files are stored in `/licenses` directory

### ✅ **Email Delivery**
- [ ] Email credentials configured
- [ ] Test email sends successfully
- [ ] License key appears in email
- [ ] Download links are clickable
- [ ] Professional formatting

### ✅ **License Validation**
- [ ] License validation endpoint works: `GET /validate/LICENSE-KEY`
- [ ] Valid licenses return correct data
- [ ] Invalid licenses return 404
- [ ] Expired licenses are handled

### ✅ **Analytics Tracking**
- [ ] Sales are logged to CSV
- [ ] Analytics endpoint works: `GET /analytics`
- [ ] Revenue calculations are correct
- [ ] Product breakdown is accurate

---

## 🧪 Test Commands

### **1. Health Check**
```bash
curl http://localhost:4242/health
# Expected: {"status":"healthy","timestamp":"...","uptime":123}
```

### **2. Test License Validation**
```bash
# First, create a test license file
echo '{"key":"TEST-LICENSE-123","productName":"Test Product","status":"active"}' > licenses/TEST-LICENSE-123.json

# Then validate it
curl http://localhost:4242/validate/TEST-LICENSE-123
# Expected: {"valid":true,"product":"Test Product",...}
```

### **3. View Analytics**
```bash
curl http://localhost:4242/analytics
# Expected: {"totalSales":0,"totalRevenue":0,"productBreakdown":{},...}
```

### **4. Test Webhook with Stripe CLI**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:4242/webhook

# In another terminal, trigger test event:
stripe trigger checkout.session.completed
```

---

## 🐛 Troubleshooting

### **Webhook Not Receiving Events**
```bash
# Check webhook URL in Stripe Dashboard
# Verify endpoint is publicly accessible
# Check webhook logs in Stripe Dashboard
# Ensure webhook secret is correct
```

### **Email Not Sending**
```bash
# Test email credentials
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }
});
transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test',
  text: 'Test email'
}, console.log);
"
```

### **License Files Not Created**
```bash
# Check directory permissions
ls -la licenses/
# Ensure webhook has write permissions
chmod 755 licenses/
```

### **Analytics Not Working**
```bash
# Check CSV file exists and is writable
ls -la licenses/master-log.csv
# Manually add test entry
echo "$(date -Iseconds),TEST-123,test@example.com,Test Product,99" >> licenses/master-log.csv
```

---

## 📊 Sample Test Data

### **Test License JSON**
```json
{
  "key": "ELV-TEST-12345-ABCD",
  "productId": "price_1TestProduct",
  "productName": "Test Product",
  "price": 99,
  "files": ["https://example.com/test.zip"],
  "licenseType": "commercial",
  "expiresAt": null,
  "issuedAt": "2024-01-01T00:00:00.000Z",
  "customerEmail": "test@example.com",
  "customerName": "Test Customer",
  "stripeSessionId": "cs_test_123",
  "status": "active"
}
```

### **Test Stripe Event**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123",
      "amount_total": 9900,
      "customer_details": {
        "email": "test@example.com",
        "name": "Test Customer"
      }
    }
  }
}
```

---

## 🚀 Production Deployment

### **1. Environment Setup**
```bash
# Production environment variables
NODE_ENV=production
PORT=443
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_secret
```

### **2. SSL Certificate**
```bash
# Use Let's Encrypt for free SSL
sudo certbot --nginx -d your-domain.com
```

### **3. Process Management**
```bash
# Use PM2 for production
npm install -g pm2
pm2 start webhook.js --name elevate-webhook
pm2 startup
pm2 save
```

### **4. Monitoring**
```bash
# Monitor logs
pm2 logs elevate-webhook

# Monitor performance
pm2 monit

# Restart if needed
pm2 restart elevate-webhook
```

---

## 📈 Performance Optimization

### **1. Rate Limiting**
```javascript
// Add to webhook.js
const rateLimit = require('express-rate-limit');
app.use('/webhook', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

### **2. Database Upgrade**
```javascript
// Replace JSON files with MongoDB/PostgreSQL
const mongoose = require('mongoose');
const License = mongoose.model('License', {
  key: String,
  productId: String,
  customerEmail: String,
  // ... other fields
});
```

### **3. File Storage**
```javascript
// Use AWS S3 for file storage
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
// Upload files to S3 instead of local storage
```

---

## ✅ Go-Live Checklist

- [ ] Webhook server deployed and running
- [ ] SSL certificate installed
- [ ] Stripe live keys configured
- [ ] Email delivery tested
- [ ] License validation working
- [ ] Analytics tracking enabled
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Support email configured
- [ ] Documentation updated

🎉 **Ready to start selling!**