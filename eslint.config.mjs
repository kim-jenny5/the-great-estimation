import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tailwind from 'eslint-plugin-tailwindcss';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
	{
		ignores: ['.next/**', 'public/**', 'next.config.js', 'postcss.config.js', 'generated/**'],
	},
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, React: 'readonly' },
		},
	},
	pluginJs.configs.recommended,
	...tsEslint.configs.recommended,
	eslintPluginUnicorn.configs.recommended,
	...tailwind.configs['flat/recommended'],
	{
		plugins: { tailwindcss: tailwind },
		settings: {
			tailwindcss: {
				config: false, // disables config file resolution
			},
		},
	},
	{
		plugins: {
			import: importPlugin,
		},
		rules: {
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						['parent', 'sibling', 'index'],
						'type',
						'object',
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
			'import/no-duplicates': 'error',
			'import/no-unresolved': 'error',
			'import/newline-after-import': 'error',
		},
	},
	...compat.config({
		extends: ['next', 'prettier'],
		settings: { next: { rootDir: '.' } },
	}),
	{
		rules: {
			'no-undef': 'error',
			'react/react-in-jsx-scope': 'off',
			'tailwindcss/no-custom-classname': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/filename-case': 'off',
		},
	},
	{ files: ['**/*.{jsx,tsx}'], rules: { 'no-console': 'warn' } },
];

export default config;
