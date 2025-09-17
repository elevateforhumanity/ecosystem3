# 🚀 Elevate Store Deployment Guide

## Quick Setup (5 Minutes)

### 1. **Stripe Setup**
```bash
# 1. Create Stripe account at stripe.com
# 2. Get your keys from Dashboard > Developers > API Keys
# 3. Create products in Dashboard > Products

# Example products to create:
- Landing Page Demo Template ($39) → price_1DemoTemplate
- PDF Workbook Bundle ($29) → price_1Workbooks
- AI Course Creator License ($199) → price_1AICourseLicense
```

### 2. **Deploy Webhook (Choose One)**

#### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod

# Add environment variables in Vercel dashboard
```

#### Option B: Netlify Functions
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

#### Option C: Railway
```bash
npm install -g @railway/cli
railway login
railway deploy

# Add environment variables in Railway dashboard
```

### 3. **Configure Webhook URL**
```bash
# In Stripe Dashboard > Developers > Webhooks
# Add endpoint: https://your-domain.vercel.app/api/webhook
# Select events: checkout.session.completed
```

### 4. **Upload Files to CDN**
```bash
# Upload your digital products to:
# - AWS S3
# - Google Cloud Storage  
# - Cloudflare R2
# - Or any CDN

# Update file URLs in webhook-license-delivery.js
```

---

## 📁 File Structure
```
elevate-store/
├── elevate-store.html          # Main storefront
├── webhook-license-delivery.js # Payment processor
├── api/
│   └── stripe-checkout.js      # Checkout API
├── downloads/                  # Digital products
│   ├── landing-template.zip
│   ├── workforce-workbooks.zip
│   └── ai-course-creator.zip
└── .env                       # Environment variables
```

---

## 🔧 Environment Variables Setup

Create `.env` file:
```bash
# Required
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional (for advanced features)
SUPABASE_URL=https://your-project.supabase.co
DOWNLOAD_BASE_URL=https://your-cdn.com/downloads
```

---

## 📧 Email Setup Options

### Option 1: Gmail (Easiest)
```bash
# 1. Enable 2FA on Gmail
# 2. Generate App Password
# 3. Use in EMAIL_PASS variable
```

### Option 2: SendGrid (Professional)
```bash
# 1. Create SendGrid account
# 2. Get API key
# 3. Update webhook to use SendGrid API
```

### Option 3: AWS SES (Enterprise)
```bash
# 1. Set up AWS SES
# 2. Verify domain
# 3. Update webhook to use AWS SDK
```

---

## 🎯 Testing Your Store

### 1. **Test Mode**
```bash
# Use Stripe test keys (pk_test_...)
# Test card: 4242 4242 4242 4242
# Any future date, any CVC
```

### 2. **Verify Webhook**
```bash
# Check webhook logs in Stripe Dashboard
# Test with: stripe listen --forward-to localhost:3000/webhook
```

### 3. **Test Email Delivery**
```bash
# Make test purchase
# Check email delivery
# Verify download links work
```

---

## 🔐 Security Checklist

- ✅ Use HTTPS for all endpoints
- ✅ Verify webhook signatures
- ✅ Store sensitive data encrypted
- ✅ Implement rate limiting
- ✅ Use secure file storage
- ✅ Add license validation
- ✅ Monitor for fraud

---

## 📊 Analytics & Monitoring

### Track Key Metrics:
- Conversion rates by product
- License usage patterns
- Customer support requests
- Download completion rates

### Recommended Tools:
- Google Analytics 4
- Stripe Dashboard analytics
- Mixpanel for user behavior
- Sentry for error tracking

---

## 🛠️ Customization Options

### 1. **Add More Products**
```javascript
// In webhook-license-delivery.js
const PRODUCT_CATALOG = {
  'price_1NewProduct': {
    name: 'New Product Name',
    price: 99,
    files: ['download-link.zip'],
    license_type: 'commercial'
  }
};
```

### 2. **Custom Email Templates**
```javascript
// Modify sendLicenseEmail() function
// Add your branding, colors, logos
```

### 3. **License Validation API**
```javascript
// Implement validateLicense() endpoint
// Add domain restrictions
// Track usage analytics
```

---

## 🚨 Troubleshooting

### Common Issues:

**Webhook not receiving events:**
- Check webhook URL is correct
- Verify endpoint is publicly accessible
- Check Stripe webhook logs

**Email not sending:**
- Verify email credentials
- Check spam folder
- Test with different email provider

**Download links broken:**
- Verify CDN/storage URLs
- Check file permissions
- Test links manually

**License validation failing:**
- Check license key format
- Verify database connection
- Test validation endpoint

---

## 📞 Support

- **Email:** support@elevateforhumanity.com
- **Discord:** [Join Community](https://discord.gg/elevate)
- **Documentation:** [Full Docs](https://docs.elevateforhumanity.com)

---

## 🎉 Go Live Checklist

- [ ] Stripe account verified
- [ ] Products created in Stripe
- [ ] Webhook deployed and tested
- [ ] Email delivery working
- [ ] Download files uploaded
- [ ] Test purchase completed
- [ ] Analytics configured
- [ ] Support system ready
- [ ] Switch to live Stripe keys
- [ ] Launch! 🚀