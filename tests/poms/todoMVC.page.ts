import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export namespace TodoMVCServie {
	export class TodoMVCManager {
		readonly baseURL: string = 'https://todomvc.com/examples/react/dist/';
		page: Page;
		input: Locator;
		addedNote: Locator;
		addedNoteLabel: Locator;
		addedNoteOptions: Locator;
		todoCountNumber: Locator;
		footerNavigator: Locator;
		filterAllNote: Locator;
		filterActiveNote: Locator;
		filterCompleteNote: Locator;
		filterClearComplete: Locator;
		deleteNoteButton: Locator;
		noteItemToggle: Locator;

		constructor(page: Page) {
			this.page = page;
			this.input = page.getByTestId('text-input');
			this.addedNote = page.getByTestId('todo-item');
			this.addedNoteLabel = page.getByTestId('todo-item-label');
			this.deleteNoteButton = page.getByTestId('todo-item-button');
			this.addedNoteOptions = page.getByTestId('footer');
			this.todoCountNumber = this.addedNoteOptions.locator('span.todo-count');
			this.footerNavigator = this.addedNoteOptions
				.getByTestId('footer-navigation')
				.locator('a');
			this.filterAllNote = this.footerNavigator.nth(0);
			this.filterActiveNote = this.footerNavigator.nth(1);
			this.filterCompleteNote = this.footerNavigator.nth(2);
			this.filterClearComplete = this.page
				.getByTestId('footer')
				.locator('button.clear-completed');
			this.noteItemToggle = this.page.getByTestId('todo-item-toggle');
		}

		async goto() {
			await this.page.goto(this.baseURL);
		}

		async inputNote(text: string) {
			await this.input.fill(text);
			await this.page.keyboard.press('Enter');
		}

		async hoverNote(index: number) {
			const locator = this.addedNoteLabel.nth(index);
			await locator.hover();
		}

		async removeNote(index: number) {
			await expect(this.addedNoteLabel.nth(index)).toBeVisible();
			await this.hoverNote(index);
			await this.deleteNoteButton.nth(index).click();
		}

		async toggleTheCheckBox(index: number) {
			await this.noteItemToggle.nth(index).check();
		}
	}

	export class TodoMVCAssertion extends TodoMVCManager {
		constructor(page: Page) {
			super(page);
			this.page = page;
		}

		async verifyAddedNote(notes: string[]) {
			await expect(this.addedNoteLabel).toHaveText(notes);
		}

		async verifyAddedNoteOptionsWithTotalAvailableNumber(noteNum: number) {
			const itemText = noteNum < 2 ? 'item' : 'items';
			await expect(this.todoCountNumber).toHaveText(
				`${noteNum} ${itemText} left!`
			);
			await expect(this.footerNavigator).toHaveCount(3);

			await expect(this.filterAllNote).toHaveText('All');
			await expect(this.filterAllNote).toBeEnabled();

			await expect(this.filterActiveNote).toHaveText('Active');
			await expect(this.filterActiveNote).toBeEnabled();

			await expect(this.filterCompleteNote).toHaveText('Completed');
			await expect(this.filterCompleteNote).toBeEnabled();

			await expect(this.filterClearComplete).toHaveText('Clear completed');
			await expect(this.filterClearComplete).toBeVisible();
		}

		async verifyAddedNoteIsChecked(index: number, isCheck = true) {
			if (isCheck) {
				await expect(this.addedNote.nth(index)).toHaveClass('completed');
			} else {
				await expect(this.addedNote.nth(index)).not.toHaveClass('completed');
			}
		}
	}
}
