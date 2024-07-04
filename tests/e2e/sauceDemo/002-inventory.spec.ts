import { test } from '@playwright/test';
import { InventoryService } from '~poms/inventory.page';

let inv: InventoryService.InventoryAssertion;

test.describe('test auth', async () => {
	test.beforeEach(async ({ page }) => {
		inv = new InventoryService.InventoryAssertion(page);
		await inv.goto();
	});
	test.afterEach(async () => {
		await inv.close();
	});
	test('bypass login', async () => {
		await inv.close();
	});
});
