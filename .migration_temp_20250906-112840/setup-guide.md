# Multi-Site Ecosystem Setup Guide

This guide shows how to implement your multi-site ecosystem using Supabase for shared user memory across all sister sites.

## 🎯 What You'll Get

- **Shared Authentication**: Users sign in once, access all sites
- **Shared User Data**: Profiles, preferences, and enrollments sync across all sites
- **Payment Integration**: Your existing Stripe Pay backend automatically updates enrollments
- **Account Management**: Both full page and drawer widget options

## 📋 Quick Setup Checklist

### 1. Supabase Project Setup
- [ ] Create new Supabase project
- [ ] Run the database schema (already created in your local database)
- [ ] Configure Auth settings to allow all sister site domains
- [ ] Get your project URL and anon key
- [ ] Optional: Set up custom domain (api.elevateforhumanity.org)

### 2. Sister Site Integration
- [ ] Add account drawer widget to each site (programs, lms, connect, www)
- [ ] Update enrollment buttons to include `program_slug` metadata
- [ ] Test sign-in flow on each site

### 3. Pay Backend Updates
- [ ] Install `@supabase/supabase-js` in your Pay service
- [ ] Add Supabase environment variables
- [ ] Update Stripe webhook to mark enrollments as paid
- [ ] Update webhook to extract and save funding metadata
- [ ] Test payment → enrollment activation flow with funding data

## 🗄️ Database Schema

The following tables have been created in your local database for reference:

- **app_users**: Links Supabase auth users to your app
- **profiles**: User personal information (name, phone, address)
- **preferences**: Settings (email opt-in, locale, accessibility)
- **enrollments**: Course enrollment tracking with status
- **payments**: Stripe payment history
- **notes**: Administrative notes (optional)

## 📁 Files Created

- **account.html**: Full account management page
- **shared/account-drawer.html**: Embeddable drawer widget
- **shared/supabase.js**: Shared Supabase client module
- **shared/enrollment.js**: Enrollment functions for sister sites
- **pay-backend-integration.js**: Integration code for your Pay service
- **demo-site.html**: Example implementation

## 🔧 Next Steps

1. **Set up your Supabase project** using the schema from your local database
2. **Update credentials** in all HTML files (replace YOUR-PROJECT and YOUR_PUBLIC_ANON_KEY)
3. **Integrate the account drawer** into your existing sister sites
4. **Update your Pay backend** with the Supabase integration code
5. **Test the complete flow** from enrollment to payment to activation

## 🌐 Sister Sites Integration

Each sister site needs:
1. The account drawer widget embedded before `</body>`
2. Enrollment buttons with proper `program_slug` metadata
3. Supabase credentials configured

The system works across:
- **www.elevateforhumanity.org**: Hub and landing
- **programs.elevateforhumanity.org**: Course catalog
- **lms.elevateforhumanity.org**: Learning management
- **connect.elevateforhumanity.org**: Community features
- **pay.elevateforhumanity.org**: Payment processing (your existing service)

## 💰 Funding & Voucher System

The Account Drawer now includes funding collection that automatically integrates with your checkout flow:

### Features
- **Voucher ID tracking**: WorkOne numbers, WIOA vouchers, etc.
- **Case Manager contact**: Stores case manager email for billing support
- **Funding source selection**: WIOA, ETPL, WRG, Self-Pay, Other
- **Coupon support**: Promotional codes and discount tracking

### How It Works
1. Users fill out funding info in the Account Drawer
2. System saves to localStorage (guests) and Supabase (authenticated users)
3. All `efhEnroll()` calls automatically include funding metadata
4. Your Pay backend receives funding details in Stripe webhook metadata
5. Funding information is saved to database notes for record-keeping

### Integration
No changes needed on sister sites - the enhanced Account Drawer handles everything automatically. Your existing enrollment buttons will now include funding metadata when users have saved funding information.

## ✅ Benefits

- **No custom backend needed**: Supabase handles everything
- **Secure by default**: Row Level Security protects user data
- **Easy to maintain**: Drop-in widgets, no complex integrations
- **Works with existing Pay service**: Minimal changes required
- **Mobile responsive**: Account drawer works on all devices
- **Automatic funding tracking**: Vouchers and funding sources tracked automatically