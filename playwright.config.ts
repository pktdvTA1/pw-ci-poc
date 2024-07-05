import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './src/configs/env';
import { existsSync } from 'fs';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const baseURL =
	envConfig.PORT === ''
		? envConfig.HOST
		: `${envConfig.HOST}"${envConfig.PORT}`;

export default defineConfig({
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	outputDir: './playwright-report/results',
	reporter: [
		[
			'html',
			{
				outputFolder: './playwright-report/report',
			},
		],
		['line'],
	],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		baseURL: baseURL,
		trace: 'retain-on-failure',
		screenshot: 'off',
		video: 'off',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'setup_DB',
			testDir: './tests/setup',
			testMatch: '*.setup.ts',
		},
		{
			name: 'api',
			testDir: './tests/integration',
			testMatch: '*.spec.ts',
			testIgnore: '*db*',
		},
		{
			name: 'testDB',
			testDir: './tests/integration',
			testMatch: '*-db.spec.ts',
			dependencies: ['setup_DB'],
		},
		{
			name: 'setup_sauceDemo',
			testDir: './tests/setup',
			testMatch: 'login.setup.ts',
		},
		{
			name: 'sauceDemo',
			testDir: './tests/e2e/sauceDemo',
			testMatch: '*.spec.ts',
			dependencies: ['setup_sauceDemo'],
			use: {
				...devices['Desktop Chrome'],
				storageState: existsSync('tests/.auth/loginSetup.json')
					? 'tests/.auth/loginSetup.json'
					: undefined,
			},
		},
		{
			name: 'td',
			testDir: './tests/e2e/todoMVC',
			testMatch: '*spec.ts',
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: baseURL,
	//   reuseExistingServer: !process.env.CI,
	// },
});
