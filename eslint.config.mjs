import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  { ignores: [".next/**", "node_modules/**", "graphify-out/**", "test-results/**", "next-env.d.ts", ".claude/**", ".agents/**", ".codex/**", "public/**", "docs/**", "vault/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
];

export default config;
