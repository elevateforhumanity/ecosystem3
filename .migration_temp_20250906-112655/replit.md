# Overview

This is a multi-site ecosystem for an educational/training platform consisting of interconnected "sister sites" that share user data and work together seamlessly. The system includes a main hub site, specialized program catalog, learning management system, community platform, payment processing, and a central memory service that maintains shared user state across all platforms.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Multi-Site Architecture
The system follows a distributed microservices pattern with domain-specific sites:
- **Hub (www)**: Main landing page with navigation and SEO optimization
- **Programs (programs.)**: Program catalog, funding information, and application intake
- **LMS (lms.)**: Learning content delivery and course management
- **Connect (connect.)**: Community features, events, and resources
- **Pay (pay.)**: Centralized payment processing using Node.js and Stripe
- **Memory Service (api.)**: Central identity and data service

## Data Sharing Strategy
All sites communicate through a shared "memory service" that acts as the central brain:
- Unified user identity across all platforms
- Shared user profiles and preferences
- Cross-platform enrollment tracking
- Centralized payment history
- Adviser and administrative notes

## Authentication & Session Management
Uses JWT tokens or session cookies (for subdomain deployment) to maintain authentication state across all sister sites. This enables seamless user experience as they move between different parts of the ecosystem.

## Database Design
Central database schema includes:
- **Users**: Core identity (id, email, auth_id)
- **Profiles**: Personal information (name, phone, address)
- **Preferences**: User settings (email preferences, accessibility, locale)
- **Enrollments**: Program participation tracking (user_id, program_slug, status, timestamps)
- **Payments**: Stripe integration data (customer_id, payment history)
- **Notes**: Administrative records (adviser notes, funding notes)

# External Dependencies

## Recommended Tech Stack (Option A - Hosted Services)
- **Authentication**: Clerk, Auth0, or Supabase Auth for OIDC/JWT
- **Database**: Supabase Postgres (free tier compatible)
- **Payment Processing**: Stripe (already integrated in existing pay service)

## API Communication
- HTTPS REST APIs for inter-service communication
- Shared JWT authentication across all services
- Cross-origin resource sharing (CORS) configuration for subdomain access

## Benefits of Hosted Approach
- Minimal custom authentication code required
- Battle-tested SSO implementation
- Easy subdomain integration
- Scalable from free tier to production