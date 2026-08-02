import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "data/**/*.json",
      "*.php",
      "next-swc-darwin-arm64-16.2.0.tgz",
      "app/api/catalogs/admin/route.ts",
      "app/api/hscode/route.ts",
      "app/board/**",
      "app/cart/**",
      "app/catalog/**",
      "app/controller1/**",
      "app/hscode/**",
      "app/led-chip1/**",
      "app/led-circuit1/**",
      "app/market-report/**",
      "app/material1/**",
      "app/mold1/**",
      "app/smartsmps1/**",
      "app/solar1/**",
      "app/solar3/**",
      "app/tech/**",
      "app/trade-info/**",
      "components/*.tsx",
      "lib/store.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  }
);
