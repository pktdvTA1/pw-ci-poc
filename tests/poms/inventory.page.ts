import type { APIRequestContext, Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
const baseURL = 'https://www.saucedemo.com';
type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
export namespace InventoryService {
	export class InventoryManager {
		page: Page;
		request: APIRequestContext;
		endPoint: string = `${baseURL}/inventory.html`;
		title: Locator;
		inventoryContainer: Locator;
		shoppingCartBadge: Locator;
		productName: Locator;
		productPrice: Locator;
		constructor(page: Page, request: APIRequestContext) {
			this.page = page;
			this.request = request;
			this.title = page.locator('span.title');
			this.inventoryContainer = page.locator('div.inventory_container');
			this.shoppingCartBadge = page.locator('.shopping_cart_badge');
			this.productName = page.locator('.inventory_item_name');
		}
		async goto() {
			await this.page.goto(this.endPoint);
		}

		async close() {
			await this.page.close();
		}

		async addProductToCart(productName: string) {
			const productLocator = this.page
				.locator('.inventory_item')
				.filter({ hasText: productName });
			const addProductButton = productLocator.locator(
				'button:has-text("Add to cart")'
			);
			await addProductButton.click();
		}

		async removeProductFromCart(productName: string) {
			const productLocator = this.page
				.locator('.inventory_item')
				.filter({ hasText: productName });
			const removeProductButton = productLocator.locator(
				'button:has-text("Remove")'
			);
			await removeProductButton.click();
		}

		async sortProductsBy(option: SortOption) {
			await this.page.selectOption('.product_sort_container', option);
		}

		async getProductNames() {
			return await this.productName.allInnerTexts();
		}

		async getProductPrices() {
			const productPrices = this.page.locator('.inventory_item_price');
			const pricesText = await productPrices.allInnerTexts();
			return pricesText.map((price) =>
				parseFloat(price.replace('$', '').trim())
			);
		}
	}
	export class InventoryAssertion extends InventoryManager {
		constructor(page: Page, request: APIRequestContext) {
			super(page, request);
		}
		async toBeOnInventoryPage() {
			await expect(this.page).toHaveURL(/.*\/inventory.html/);
			await expect(this.inventoryContainer).toBeVisible();
			await expect(this.title).toHaveText('Products');
		}
		async toHaveShoppingCartBadge(productCount: string) {
			await expect(this.shoppingCartBadge).toBeVisible();
			await expect(this.shoppingCartBadge).toHaveText(productCount);
		}
	}
}
