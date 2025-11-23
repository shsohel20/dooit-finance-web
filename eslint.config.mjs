import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  //error on unused imports
  {
    rules: {
      // ❗ NOW this will work for JS
      "no-undef": "error",

      // Unused variables
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],

      // Unused imports
      "no-unused-imports/no-unused-imports": "error",

      // Import order
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      // Prettier formatting
      "prettier/prettier": "error",

      // Clean code
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",
    },

  },
])

export default eslintConfig