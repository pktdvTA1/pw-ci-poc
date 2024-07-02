import playwright from 'eslint-plugin-playwright';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	...[eslint.configs.recommended, ...tseslint.configs.recommended].map((c) => ({
		...c,
		files: ['**/*.ts'],
	})),
	{
		// override recommended eslint and tseslint here
		files: ['**/*.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-namespace': 'off',
		},
	},
	{
		files: ['tests/**/*.spec.ts'],
		...playwright.configs['flat/recommended'],
	},
	{
		// override playwright eslint () here
		// can refer to this https://www.npmjs.com/package/eslint-plugin-playwright
		files: ['tests/**/*.spec.ts', 'tests/**/*.setup.ts', 'tests/**/*.page.ts'],
		rules: {
			'@typescript-eslint/no-namespace': 'off',
			'no-inner-declarations': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'playwright/no-nested-step': 'off',
			'playwright/prefer-strict-equal': 'error',
			'playwright/prefer-to-be': 'warn',
			'playwright/prefer-to-contain': 'error',
			'playwright/prefer-to-have-length': 'error',
			'playwright/missing-playwright-await': 'off',
			'playwright/no-skipped-test': 'warn',
		},
	},
];
