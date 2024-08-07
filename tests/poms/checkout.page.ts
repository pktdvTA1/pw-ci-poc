import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
const baseURL = 'https://www.saucedemo.com';
export namespace CheckoutService {
	export class CheckoutManager {
		page: Page;
		endPoint: string = `${baseURL}/cart.html`;
		title: Locator;
		cartIconButton: Locator;
		cartContainer: Locator;
		checkoutButton: Locator;
		firstNameInput: Locator;
		lastNameInput: Locator;
		postalCodeInput: Locator;
		continueButton: Locator;
		finishButton: Locator;
		completeHeader: Locator;
		completeBody: Locator;
		constructor(page: Page) {
			this.page = page;
			this.title = page.locator('span.title');
			this.cartIconButton = page.locator('.shopping_cart_link');
			this.cartContainer = page.locator('.cart-list');
			this.checkoutButton = page.locator('#checkout');
			this.firstNameInput = page.locator('#first-name');
			this.lastNameInput = page.locator('#last-name');
			this.postalCodeInput = page.locator('#postal-code');
			this.continueButton = page.locator('#continue');
			this.finishButton = page.locator('#finish');
			this.completeHeader = page.locator('.complete-header');
			this.completeBody = page.locator('.complete-text');
		}
		async goto() {
			await this.page.goto(this.endPoint);
		}

		async close() {
			await this.page.close();
		}

		async fillPersonalInformation() {
			await this.firstNameInput.fill('Sauce');
			await this.lastNameInput.fill('Demo');
			await this.postalCodeInput.fill('12345');
		}

		async getProductNames() {
			return await this.page
				.locator('.cart_item .inventory_item_name')
				.allInnerTexts();
		}
	}
	export class CheckoutAssertion extends CheckoutManager {
		constructor(page: Page) {
			super(page);
		}
		async toBeOnCartPage() {
			await expect(this.page).toHaveURL(/.*\/cart.html/);
			await expect(this.cartContainer).toBeVisible();
			await expect(this.title).toHaveText('Your Cart');
		}

		async toBeOnCheckoutCompletePage() {
			await expect(this.page).toHaveURL(/.*\/checkout-complete.html/);
			await expect(this.title).toHaveText('Checkout: Complete!');
			await expect(this.completeHeader).toHaveText('Thank you for your order!');
			await expect(this.completeBody).toHaveText(
				'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
			);
		}
	}
}
