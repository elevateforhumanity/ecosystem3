module.exports = {
  env: { browser: true, node: true, es2023: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/no-unescaped-entities': 'off'
  },
  globals: {
    console: 'readonly',
    process: 'readonly',
    module: 'writable',
    require: 'readonly',
    __dirname: 'readonly',
    setTimeout: 'readonly',
    setInterval: 'readonly',
    fetch: 'readonly',
    AbortController: 'readonly'
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      rules: {
        // Re-enable unused vars for application source; ignore underscore prefixed args
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
      }
    },
    {
      files: ['**/*.test.*', 'tests/**/*.*', 'test/**/*.*'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  ignorePatterns: [
    'dist/',
    'build/',
    'coverage/',
    '.vercel/',
    '.next/',
    'node_modules/',
    'tools/**',
    '.migration_temp_*/',
    '**/.migration_temp_*/**'
  ]
};
