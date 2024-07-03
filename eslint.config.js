import playwright from 'eslint-plugin-playwright';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	...[eslint.configs.recommended, ...tseslint.configs.recommended].map((c) => ({
		...c,
		files: ['**/*.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-inner-declarations': 'off',
			'require-await': 'warn',
		},
	})),
	{
		files: ['tests/**/*.spec.ts'],
		...playwright.configs['flat/recommended'],
		rules: {
			'playwright/no-nested-step': 'warn',
			'playwright/prefer-strict-equal': 'error',
			'playwright/prefer-to-be': 'warn',
			'playwright/prefer-to-contain': 'error',
			'playwright/prefer-to-have-length': 'error',
			'playwright/missing-playwright-await': 'warn',
			'playwright/no-skipped-test': 'warn',
		},
	},
];
