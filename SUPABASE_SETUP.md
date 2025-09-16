# Supabase Setup for GitHub Codespaces

This repository includes a comprehensive Supabase setup script specifically designed for GitHub Codespaces environments.

## Quick Start

Run the setup script interactively:

```bash
npm run supabase:setup
```

Or directly:

```bash
bash scripts/setup-supabase-codespaces.sh
```

## What the Script Does

### 🔧 Interactive Configuration
- Prompts for your Supabase URL and keys with input validation
- Securely handles sensitive service keys (hidden input)
- Validates all inputs are provided before proceeding

### 📄 Environment File Creation
- Creates `.env` in the root directory
- Creates `client/.env` (if client directory exists)
- Creates `server/.env` (if server directory exists)
- Updates `.env.example` with proper Supabase configuration

### 🔒 Security & Git Management
- Automatically updates `.gitignore` to prevent committing secrets
- Exports environment variables for the current session
- Persists variables in `~/.bashrc` for future sessions

### 📦 Dependency Management
- Installs npm dependencies if `package.json` exists
- Installs client dependencies if `client/package.json` exists

### 🧪 Connection Testing
- Tests Supabase configuration with Node.js
- Provides feedback on configuration status
- Shows abbreviated keys for verification

## Required Information

You'll need these values from your Supabase project:

1. **VITE_SUPABASE_URL** (public): Your project URL (e.g., `https://your-project.supabase.co`)
2. **VITE_SUPABASE_ANON_KEY** (public): Your public anonymous key
3. **SUPABASE_URL** (server): Same as above, for server-side use
4. **SUPABASE_SERVICE_KEY** (secret): Your service role key (keep this secure!)

## After Setup

1. **Restart your terminal** or run: `source ~/.bashrc`
2. **Start your development server**: `npm run dev`
3. **Test your Supabase integration** in your application

## Environment Variables Created

### Root `.env`
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
NODE_ENV=development
```

### Client `.env` (if client/ exists)
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Server `.env` (if server/ exists)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
NODE_ENV=development
```

## Integration with Existing Code

The script works with the existing Supabase client in `shared/supabase.js`, which automatically detects:
- Vite environment variables (`VITE_*`) for client-side builds
- Window variables for static HTML
- Fallback handling when Supabase isn't configured

## Troubleshooting

### Script Won't Run
- Ensure the script is executable: `chmod +x scripts/setup-supabase-codespaces.sh`
- Check you're in the repository root directory

### Environment Variables Not Persisting
- Run `source ~/.bashrc` to reload your shell
- Or restart your terminal/Codespace

### Supabase Connection Issues
- Verify your project URL and keys in the Supabase dashboard
- Check that your project is active and not paused
- Ensure your keys have the correct permissions

## Manual Setup Alternative

If you prefer manual setup, copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
# Edit .env with your actual Supabase values
```