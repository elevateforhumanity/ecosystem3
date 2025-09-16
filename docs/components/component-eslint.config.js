// Flat ESLint config shim used only so ESLint stops picking up legacy experimental file.
// We mirror the classic .eslintrc.cjs settings and explicitly ignore heavy utility scripts.
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  // Ignore large script/tool directories & build output to keep lint signal focused
  { ignores: [
    'dist/**','build/**','coverage/**','node_modules/**','tools/**','**/.vercel/**','**/.next/**',
    '.migration_temp_*/**'
  ] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react: reactPlugin, 'react-hooks': reactHooks, '@typescript-eslint': tsPlugin },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        // Common browser globals
        window: 'readonly', document: 'readonly', navigator: 'readonly', location: 'readonly',
        localStorage: 'readonly', caches: 'readonly', alert: 'readonly',
        PerformanceObserver: 'readonly',
        // Timers / async
        setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
        // Node / universal
        console: 'readonly', module: 'writable', require: 'readonly', __dirname: 'readonly', process: 'readonly',
        fetch: 'readonly', AbortController: 'readonly', Buffer: 'readonly', global: 'readonly'
      }
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'off',
  'no-unused-vars': 'off', // handled by TS rule below to avoid duplicate reports
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },
  prettier
];