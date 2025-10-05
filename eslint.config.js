import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
    },
    plugins: { js },
    extends: ['js/recommended'],
  },
  eslintPluginUnicorn.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['docs', 'dist', 'node_modules'],
  },
]);
