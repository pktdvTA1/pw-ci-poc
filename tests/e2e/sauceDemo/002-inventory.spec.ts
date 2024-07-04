import { test } from '@playwright/test';
import { InventoryService } from '~poms/inventory.page';

let inv: InventoryService.InventoryAssertion;

test.describe('test auth', () => {
	test.beforeEach(async ({ page }) => {
		inv = new InventoryService.InventoryAssertion(page);
		await inv.goto();
	});
	test.afterEach(async () => {
		await inv.close();
	});
	test('When enter page directly with auth Should display the Products page', async () => {
		await inv.toBeOnInventoryPage();
	});
});
