import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
const baseURL = 'https://www.saucedemo.com';
export namespace InventoryService {
	export class InventoryManager {
		page: Page;
		endPoint: string = `${baseURL}/inventory.html`;
		title: Locator;
		inventoryContainer: Locator;
		constructor(page: Page) {
			this.page = page;
			this.title = page.locator('span.title');
			this.inventoryContainer = page.locator('div.inventory_container');
		}
		async goto() {
			await this.page.goto(this.endPoint);
		}

		async close() {
			await this.page.close();
		}
	}
	export class InventoryAssertion extends InventoryManager {
		constructor(page: Page) {
			super(page);
		}
		async toBeOnInventoryPage() {
			await expect(this.page).toHaveURL(/.*\/inventory.html/);
			await expect(this.inventoryContainer).toBeVisible();
			await expect(this.title).toHaveText('Products');
		}
	}
}
