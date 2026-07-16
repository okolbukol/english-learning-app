import { describe, expect, it } from "vitest";
import { safeParseEnv } from "./index";

describe("environment validation", () => {
  it("accepts the required baseline variables", () => {
    const result = safeParseEnv({
      APP_SECRET: "a".repeat(32),
      DATABASE_URL: "postgresql://user:pass@localhost:5432/app",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NODE_ENV: "test",
      REDIS_URL: "redis://localhost:6379",
      STORAGE_DRIVER: "local"
    });

    expect(result.success).toBe(true);
  });

  it("rejects short application secrets", () => {
    const result = safeParseEnv({
      APP_SECRET: "short",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/app",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NODE_ENV: "test",
      REDIS_URL: "redis://localhost:6379",
      STORAGE_DRIVER: "local"
    });

    expect(result.success).toBe(false);
  });
});

