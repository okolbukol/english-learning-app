import { z } from "zod";

const envSchema = z.object({
  APP_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  LOCAL_STORAGE_PATH: z.string().min(1).default("./storage"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  REDIS_URL: z.string().url(),
  STORAGE_DRIVER: z.enum(["local", "s3"]).default("local")
});

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(input: NodeJS.ProcessEnv): AppEnv {
  return envSchema.parse(input);
}

export function safeParseEnv(input: NodeJS.ProcessEnv) {
  return envSchema.safeParse(input);
}

export const appEnv =
  process.env.SKIP_ENV_VALIDATION === "true" || process.env.NODE_ENV === "test" ? undefined : parseEnv(process.env);
