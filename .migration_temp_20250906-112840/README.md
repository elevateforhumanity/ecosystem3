# Multi-Site Ecosystem Implementation

This project implements a complete multi-site ecosystem for Elevate for Humanity using Supabase for shared user memory.

## 🏗️ System Architecture

### Sister Sites
- **Hub (www)**: Main landing page with navigation and SEO
- **Programs (programs.)**: Program catalog, funding info, and application intake  
- **LMS (lms.)**: Learning content delivery and course management
- **Connect (connect.)**: Community features, events, and resources
- **Pay (pay.)**: Centralized payment processing using Node.js and Stripe
- **Memory Service**: Powered by Supabase (no custom server needed)

### Data Sharing
All sites share user data through Supabase:
- User authentication (magic links, OAuth)
- Profile information (name, phone, address)
- User preferences (email settings, locale, accessibility)
- Course enrollments with status tracking
- Payment history and Stripe integration

## 📂 File Structure

```
├── account.html                    # Full account management page
├── demo-site.html                  # Example sister site implementation
├── pay-backend-integration.js      # Stripe → Supabase integration
├── setup-guide.md                 # Step-by-step setup instructions
└── shared/
    ├── account-drawer.html         # Embeddable account widget
    ├── supabase.js                # Shared Supabase client
    └── enrollment.js              # Enrollment helper functions
```

## 🚀 Implementation Status

### ✅ Completed Components
- Database schema design with security policies
- Account management page (full-page version)
- Account drawer widget (embeddable version)
- Shared authentication and user session management
- Enrollment tracking and display functions
- Payment integration template for existing Pay service
- Demo site showing complete integration

### ⏳ Manual Setup Required
- Create Supabase project and apply database schema
- Configure Supabase Auth for all sister site domains
- Update credential placeholders with real Supabase values
- Integrate Supabase code into existing Pay backend
- Test cross-site authentication and enrollment flow

## 🔧 Key Features

### Account Drawer Widget
- Floating "Account" button on any page
- Slide-out drawer with sign-in and profile management
- Shows live enrollment status across all sites
- Mobile responsive with proper accessibility
- **NEW**: Funding & voucher collection for checkout metadata

### Enrollment System
- Reuses existing Pay backend with minimal changes
- Adds `program_slug` metadata to Stripe checkout
- Automatic enrollment activation after payment
- Status tracking: pending → active → completed
- **NEW**: Automatic funding metadata injection (voucher ID, case manager, funding source, coupons)

### Funding & Voucher Support
- Local storage persistence for guest users
- Supabase sync for authenticated users
- Automatic injection into all enrollment checkouts
- Case manager and voucher ID tracking
- Support for WIOA, ETPL, WRG, and other funding sources
- Funding details recorded in payment metadata and notes

#### How It Works
1. User fills out funding info in Account Drawer (voucher ID, case manager, funding source, coupon)
2. System saves locally and syncs to Supabase if signed in
3. When `efhEnroll()` is called, funding data is automatically attached to Stripe metadata
4. Payment backend receives funding info in webhook and stores in database notes
5. Funding details appear in Stripe dashboard for billing/authorization support

### Shared Authentication
- Magic link email authentication
- Session persistence across sister sites
- Automatic user record creation and syncing
- Secure access with Row Level Security

## 🎯 Business Benefits

- **Unified User Experience**: Users see consistent data across all sites
- **Simplified Management**: One source of truth for all user data
- **Scalable Architecture**: Supabase handles infrastructure and security
- **Easy Integration**: Drop-in widgets require minimal code changes
- **Cost Effective**: Uses existing Pay service with hosted Supabase

## 📱 User Journey

1. **Discovery**: User visits any sister site
2. **Sign In**: Magic link authentication (works across all sites)
3. **Browse**: View programs, courses, community content
4. **Enroll**: Click enrollment button → Stripe checkout
5. **Payment**: Complete payment through existing Pay service
6. **Activation**: Enrollment automatically activated across all sites
7. **Learning**: Access content based on enrollment status

The system ensures seamless experience as users move between different parts of the ecosystem.