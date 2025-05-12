import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export const ALL_JS_FILES = '**/*.{js,mjs,cjs,ts,jsx,tsx}';

export default defineConfig([
  globalIgnores(['node_modules/*', 'dist/*', '**/generated-types.ts', '**/generated-types/**']),
  {
    files: [ALL_JS_FILES],
    plugins: { js },
    extends: ['js/recommended'],
  },
  // this needs to be after the js-specific rules, because of overrides
  tseslint.configs.recommended,
  {
    files: [ALL_JS_FILES],
    plugins: { prettier },
    extends: [eslintConfigPrettier],
    rules: { 'prettier/prettier': 'error' },
  },
]);
