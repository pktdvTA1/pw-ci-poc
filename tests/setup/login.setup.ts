import { test as setup } from '@playwright/test';
import { LoginService } from '~poms/basicLogin.page';
import { InventoryService } from '~poms/inventory.page';

let loginPage: LoginService.LoginPage;
let inventoryAssertion: InventoryService.InventoryAssertion;

setup.describe.configure({ mode: 'parallel' });

setup.describe('login setup tests', () => {
	setup.beforeEach(async ({ page, request }) => {
		loginPage = new LoginService.LoginPage(page);
		inventoryAssertion = new InventoryService.InventoryAssertion(page, request);
		await loginPage.goto();
	});
	setup.afterAll(async () => {
		await loginPage.page.close();
	});

	setup('login_setup', async ({ page }) => {
		await loginPage.fillUsernameAndPassword('standard_user', 'secret_sauce');
		await loginPage.loginButton.click();
		await inventoryAssertion.toBeOnInventoryPage();
		await page.context().storageState({ path: 'tests/.auth/loginSetup.json' });
	});
});
