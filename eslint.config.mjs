import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Seed scripts are not production code — skip unused-var enforcement
    "prisma/**",
  ]),
  // Relax unused-vars rule to allow _ prefix for both params and variables
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // This experimental rule incorrectly flags legitimate async data-fetching
      // patterns where setState is called inside .then() callbacks inside effects.
      // All affected effects use cancellation guards and are the recommended pattern.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
