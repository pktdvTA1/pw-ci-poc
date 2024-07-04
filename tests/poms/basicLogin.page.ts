import { expect, Locator, Page } from "@playwright/test";

export namespace loginService {
    export class LoginPage {
        readonly baseUrl:string = 'https://www.saucedemo.com/';
        page: Page;
        usernameInput: Locator;
        passwordInput: Locator;
        loginButton: Locator;

        constructor(page: Page){
            this.page = page;
            this.usernameInput = page.locator('#user-name') 
            this.passwordInput = page.locator('#password') 
            this.loginButton = page.locator('#login-button') 
        }

        async goto(){
            await this.page.goto(this.baseUrl);
        }

        async fillUsernameAndPassword(username:string, password:string){
            await this.usernameInput.fill(username)
            await this.passwordInput.fill(password)
        }
    }

    export class LoginPageAssertions extends LoginPage {
        page: Page;
        errorMessage: Locator;
        inventoryContainer: Locator;
 
        constructor(page: Page){
            super(page)
            this.page = page;
            this.errorMessage = page.locator('.error-message-container.error')
            this.inventoryContainer = page.locator('.inventory_container')
        }

        async toBeOnInventoryPage(){
		    await expect(this.page).toHaveURL(/.*\/inventory.html/);
            await expect(this.inventoryContainer).toBeVisible()
        }
    }
}