import { z } from "zod";

const schema = z.object({
  VITE_API_BASE_URL: z.string().url().optional()
});

export type AppEnv = z.infer<typeof schema>;

export function loadEnv(): AppEnv {
  const raw: Record<string, string | undefined> = {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    // Throw aggregated error for CI visibility
    throw new Error(
      "Environment validation failed:\n" +
        parsed.error.errors.map(e => `- ${e.path.join(".")}: ${e.message}`).join("\n")
    );
  }
  return parsed.data;
}

// Allow manual check via: npm run env:check
if (process.argv.includes("--check")) {
  loadEnv();
  console.log("Env OK");
}