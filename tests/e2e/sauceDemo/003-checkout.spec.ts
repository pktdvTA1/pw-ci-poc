import { expect, test } from '@playwright/test';
import { CheckoutService } from '~poms/checkout.page';
import { InventoryService } from '~poms/inventory.page';

let checkout: CheckoutService.CheckoutAssertion;
let inv: InventoryService.InventoryAssertion;

test.describe.configure({ mode: 'parallel' });
test.describe('Checkout tests', () => {
	test.beforeEach(async ({ page, request }) => {
		checkout = new CheckoutService.CheckoutAssertion(page);
		inv = new InventoryService.InventoryAssertion(page, request);
		await inv.goto();
	});
	test.afterEach(async () => {
		await checkout.close();
	});

	test('Checkout with many products should successfully create an order', async () => {
		await inv.addProductToCart('Sauce Labs Backpack');
		await inv.addProductToCart('Sauce Labs Bike Light');
		await inv.addProductToCart('Sauce Labs Bolt T-Shirt');
		await checkout.cartIconButton.click();
		await checkout.checkoutButton.click();
		await checkout.fillPersonalInformation();
		await checkout.continueButton.click();
		const checkoutProductNames = await checkout.getProductNames();
		expect(checkoutProductNames[0]).toBe('Sauce Labs Backpack');
		expect(checkoutProductNames[1]).toBe('Sauce Labs Bike Light');
		expect(checkoutProductNames[2]).toBe('Sauce Labs Bolt T-Shirt');
		await checkout.finishButton.click();
		await checkout.toBeOnCheckoutCompletePage('Checkout: Complete!');
	});
});
