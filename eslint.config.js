import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginUnicorn from 'eslint-plugin-unicorn';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
	{ ignores: ['public/**'] },
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		...pluginReact.configs.flat.recommended,
		settings: {
			react: {
				version: '19.1.0',
			},
		},
	},
	pluginUnicorn.configs.recommended,
	...compat.config({
		extends: ['plugin:drizzle/all'],
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
	{
		files: ['**/*.{jsx,tsx}'],
		rules: {
			'no-console': 'warn',
		},
	},
];
