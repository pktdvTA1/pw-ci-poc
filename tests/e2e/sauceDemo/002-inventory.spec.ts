import { expect, test } from '@playwright/test';
import { InventoryService } from '~poms/inventory.page';

let inv: InventoryService.InventoryAssertion;

test.describe.configure({ mode: 'parallel' });
test.describe('Inventory tests', () => {
	test.beforeEach(async ({ page, request }) => {
		inv = new InventoryService.InventoryAssertion(page, request);
		await inv.goto();
	});
	test.afterEach(async () => {
		await inv.close();
	});
	test('When enter page directly with auth Should display the Products page', async () => {
		await inv.toBeOnInventoryPage();
	});

	test('Add many products to cart should have shopping cart badge on cart icon with count', async () => {
		await inv.toBeOnInventoryPage();
		await inv.addProductToCart('Sauce Labs Backpack');
		await inv.addProductToCart('Sauce Labs Bike Light');
		await inv.addProductToCart('Sauce Labs Bolt T-Shirt');
		await inv.toHaveShoppingCartBadge('3');
	});

	test('Add many products to cart then remove should update shopping cart badge count on cart icon', async () => {
		await inv.toBeOnInventoryPage();
		await inv.addProductToCart('Sauce Labs Backpack');
		await inv.addProductToCart('Sauce Labs Bike Light');
		await inv.addProductToCart('Sauce Labs Bolt T-Shirt');
		await inv.removeProductFromCart('Sauce Labs Backpack');
		await inv.toHaveShoppingCartBadge('2');
	});

	test('Filter products name by (A to Z) should sort products by name (A to Z)', async ({}) => {
		await inv.sortProductsBy('az');

		const productNames = await inv.getProductNames();
		const sortedProductNames = [...productNames].sort();

		expect(productNames).toEqual(sortedProductNames);
	});

	test('Filter products name by (Z to A) should sort products by name (Z to A)', async ({}) => {
		await inv.sortProductsBy('za');

		const productNames = await inv.getProductNames();
		const sortedProductNames = [...productNames].sort().reverse();

		expect(productNames).toEqual(sortedProductNames);
	});

	test('Filter products price by (low to high) should sort products by price (low to high)', async ({}) => {
		await inv.sortProductsBy('lohi');

		const productPrices = await inv.getProductPrices();
		const sortedProductPrices = [...productPrices].sort((a, b) => a - b);

		expect(productPrices).toEqual(sortedProductPrices);
	});

	test('Filter products price by (high to low) should sort products by price (high to low)', async ({}) => {
		await inv.sortProductsBy('hilo');

		const productPrices = await inv.getProductPrices();
		const sortedProductPrices = [...productPrices].sort((a, b) => b - a);

		expect(productPrices).toEqual(sortedProductPrices);
	});
});
