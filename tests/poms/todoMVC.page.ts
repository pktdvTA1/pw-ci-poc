import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export namespace todoMVCServie {
	export class TodoMVCManager {
		readonly baseURL: string = 'https://todomvc.com/examples/react/dist/';
		page: Page;
		input: Locator;
		addedNotes: Locator;

		constructor(page: Page) {
			this.page = page;
			this.input = page.getByTestId('text-input');
			this.addedNotes = page.getByTestId('todo-item-label');
		}
		async goto() {
			await this.page.goto(this.baseURL);
		}
		async inputNote(text: string) {
			await this.input.fill(text);
			await this.page.keyboard.press('Enter');
		}
		async getAllAddedNotes() {
			return await this.addedNotes.allInnerTexts();
		}
	}

	export class TodoMVCAssertion extends TodoMVCManager {
		constructor(page: Page) {
			super(page);
			this.page = page;
		}
		async verifyAddedNote(notes: string[]) {
			const addedNote = await this.getAllAddedNotes();
			expect(addedNote).toStrictEqual(notes);
		}
	}
}
