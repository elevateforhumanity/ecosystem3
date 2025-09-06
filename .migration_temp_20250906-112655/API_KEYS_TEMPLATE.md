
# 🔑 API Keys Template for Replit Secrets

## Required API Keys for EFH Ecosystem

### Payment Processing
```
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Database & Authentication  
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
DATABASE_URL=postgresql://user:password@host:port/database
```

### AI Services (Optional)
```
OPENAI_API_KEY=sk-your_openai_api_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
```

### Video Services (Optional)
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Analytics & Monitoring
```
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
GOOGLE_SEARCH_CONSOLE_VERIFICATION=your_verification_code
```

## 🛡️ How to Add to Replit Secrets

1. **Open Secrets Tool** - Click Tools → Secrets in your Replit workspace
2. **Add Each Key** - Copy key names from above, paste your actual values
3. **Verify Integration** - Keys automatically available as `process.env.KEY_NAME`

## 🔄 Current Integration Status

### ✅ Already Integrated
- Stripe payment processing (needs keys)
- Database schema ready (needs connection)
- Universal script system (active)

### ⏳ Needs API Keys  
- Payment processing (Stripe)
- User authentication (Supabase)
- Video storage (optional)
- AI features (optional)

## 📝 Notes

- **Never commit actual keys** - Use Replit Secrets only
- **Test vs Production** - Use test keys for development
- **Key Rotation** - Update regularly for security
- **Access Control** - Limit key permissions where possible

---

**💡 Tip**: Add keys one service at a time and test functionality before proceeding to the next service.
