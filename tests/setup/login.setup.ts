import { test as setup } from '@playwright/test';
import { loginService } from '~poms/basicLogin.page';

let loginPage: loginService.LoginPage;
let loginPageAssertions: loginService.LoginPageAssertions;

setup.describe.configure({ mode: 'parallel' });

setup.describe('login setup tests', () => {

	setup.beforeEach(async ({ page }) => {
        loginPage = new loginService.LoginPage(page);
		loginPageAssertions = new loginService.LoginPageAssertions(page);
		await loginPage.goto();
	})

	setup('login_setup', async ({ page }) => {
		await loginPage.fillUsernameAndPassword('standard_user','secret_sauce')
		await loginPage.loginButton.click()
		await loginPageAssertions.toBeOnInventoryPage()
			await page
				.context()
				.storageState({ path: 'tests/.auth/loginSetup.json' });
		
	});
});
