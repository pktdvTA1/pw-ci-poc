import playwright from 'eslint-plugin-playwright';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		...playwright.configs['flat/recommended'],
		rules: {
			indent: [
				'error',
				'tab',
				{
					ignoredNodes: ['PropertyDefinition'],
				},
			],
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
	}
);
