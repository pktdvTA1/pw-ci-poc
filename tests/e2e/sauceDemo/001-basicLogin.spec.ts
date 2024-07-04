import { expect, test } from '@playwright/test';
import { loginService } from '~poms/basicLogin.page';
import { InventoryService } from '~poms/inventory.page';

let loginPage: loginService.LoginPage;
let loginPageAssertions: loginService.LoginPageAssertions;
let inventoryAssertion: InventoryService.InventoryAssertion;

test.use({ storageState: { cookies: [], origins: [] } });
test.describe.configure({ mode: 'parallel' });

test.describe('Basic Login tests', () => {
	test.beforeEach(async ({ page, request }) => {
		loginPage = new loginService.LoginPage(page);
		loginPageAssertions = new loginService.LoginPageAssertions(page);
		inventoryAssertion = new InventoryService.InventoryAssertion(page, request);

		await loginPage.goto();
	});
	test.afterEach(async () => {
		await loginPage.page.close();
	});

	test('Login with standard_user should login successfully', async () => {
		await loginPage.fillUsernameAndPassword('standard_user', 'secret_sauce');
		await loginPage.loginButton.click();
		await inventoryAssertion.toBeOnInventoryPage();
	});

	test('Login with locked_out_user should fail', async () => {
		await loginPage.fillUsernameAndPassword('locked_out_user', 'secret_sauce');
		await loginPage.loginButton.click();
		await expect(loginPageAssertions.errorMessage).toContainText(
			'Sorry, this user has been locked out.'
		);
	});

	test('Login with blank username and password should fail', async () => {
		await loginPage.fillUsernameAndPassword('', '');
		await loginPage.loginButton.click();
		await expect(loginPageAssertions.errorMessage).toContainText(
			'Username is required'
		);
	});

	test('Login with blank username should fail', async () => {
		await loginPage.fillUsernameAndPassword('', 'secret_sauce');
		await loginPage.loginButton.click();
		await expect(loginPageAssertions.errorMessage).toContainText(
			'Username is required'
		);
	});

	test('Login with blank password should fail', async () => {
		await loginPage.fillUsernameAndPassword('standard_user', '');
		await loginPage.loginButton.click();
		await expect(loginPageAssertions.errorMessage).toContainText(
			'Password is required'
		);
	});

	test('Login with wrong username and password should fail', async () => {
		await loginPage.fillUsernameAndPassword('test01', 'password');
		await loginPage.loginButton.click();
		await expect(loginPageAssertions.errorMessage).toContainText(
			'Username and password do not match any user in this service'
		);
	});

	test('Login with wrong username should fail', async () => {
		await loginPage.fillUsernameAndPassword('test01', 'secret_sauce');
		await loginPage.loginButton.click();
		await expect(loginPageAssertions.errorMessage).toContainText(
			'Username and password do not match any user in this service'
		);
	});

	test('Login with wrong password should fail', async () => {
		await loginPage.fillUsernameAndPassword('standard_user', 'password');
		await loginPage.loginButton.click();
		await expect(loginPageAssertions.errorMessage).toContainText(
			'Username and password do not match any user in this service'
		);
	});
});
