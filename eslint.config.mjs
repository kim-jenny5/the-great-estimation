import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tailwind from 'eslint-plugin-tailwindcss';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
	{ ignores: ['.next/**', 'public/**', 'next.config.js', 'postcss.config.js'] },
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node, React: 'readonly' } } },
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
	...compat.config({
		extends: ['next', 'prettier'],
		settings: {
			next: {
				rootDir: '.',
			},
		},
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

export default config;
