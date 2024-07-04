import { expect, test } from '@playwright/test';
import { LoginService } from '~poms/basicLogin.page';
import { InventoryService } from '~poms/inventory.page';

let loginPage: LoginService.LoginPage;
let loginPageAssertions: LoginService.LoginPageAssertions;
let inventoryAssertion: InventoryService.InventoryAssertion;
let inventoryManager: InventoryService.InventoryManager;

test.use({ storageState: { cookies: [], origins: [] } });
test.describe.configure({ mode: 'parallel' });

test.describe('Basic Login', () => {
	test.beforeEach(async ({ page }) => {
		loginPage = new LoginService.LoginPage(page);
		loginPageAssertions = new LoginService.LoginPageAssertions(page);
		inventoryAssertion = new InventoryService.InventoryAssertion(page);

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

test.describe('Access without login', () => {
	test.beforeEach(async ({ page }) => {
		loginPageAssertions = new LoginService.LoginPageAssertions(page);
		inventoryManager = new InventoryService.InventoryManager(page);
	});

	test('Arbitrary access inventory page without login should be failure', async () => {
		await inventoryManager.goto();
		await expect(loginPageAssertions.errorMessage).toHaveText(
			"Epic sadface: You can only access '/inventory.html' when you are logged in."
		);
	});
});
