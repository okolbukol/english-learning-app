import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { rules: {} }
});

export default [
  {
    ignores: [
      "**/.next/**",
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "packages/database/generated/**"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettier
];
