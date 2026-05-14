import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      'dist/',
      '**/dist/',
      '*.js',
      '*.mjs',
      '*.cjs',
      'fixtures/',
      'reports/',
      'templates/',
      'registry/',
      'policyguard/',
      'vitest.workspace.ts',
      'eslint.config.js',
    ],
  },
  {
    files: ['packages/**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['packages/**/tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
