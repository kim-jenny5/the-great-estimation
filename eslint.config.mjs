import configPrisma from 'eslint-config-prisma';
import tsEslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tailwind from 'eslint-plugin-tailwindcss';
import compat from 'eslint-plugin-compat';
import globals from 'globals';

const config = [
  {
    ignores: [
      '.next/**',
      'public/**',
      'next.config.js',
      'postcss.config.js',
      '**/build/**/*',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, React: 'readonly' },
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  ...configPrisma, // ✅ adds Prisma-specific rules
  {
    plugins: { tailwindcss: tailwind },
    settings: { tailwindcss: { config: false }, next: { rootDir: '.' } },
  },
  ...compat.configs({ extends: ['next'] }),
  {
    rules: {
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
      'tailwindcss/no-custom-classname': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
    },
  },
  { files: ['**/*.{jsx,tsx}'], rules: { 'no-console': 'warn' } },
];

export default config;
