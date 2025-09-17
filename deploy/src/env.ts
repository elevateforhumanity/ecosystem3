import { z } from 'zod';

// Central environment validation. Fails fast if required vars missing.
export const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  STRIPE_SECRET_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  // Frontend API base (optional; can be relative or absolute). Kept loose intentionally.
  VITE_API_BASE_URL: z.string().optional()
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cached: AppEnv | null = null;

export function loadEnv(): AppEnv {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Aggregate errors
    const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
    // eslint-disable-next-line no-console
    console.error('\nEnvironment validation failed:\n' + issues + '\n');
    process.exit(1);
  }
  cached = parsed.data;
  return cached;
}

// Allow running standalone via: npm run env:check
if (require.main === module) {
  loadEnv();
  // eslint-disable-next-line no-console
  console.log('✅ Environment variables validated');
}