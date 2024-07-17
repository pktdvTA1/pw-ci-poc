import { test, expect } from '@playwright/test';
import { TodoMVCServie } from '~poms/todoMVC.page';

let td: TodoMVCServie.TodoMVCManager;
let tda: TodoMVCServie.TodoMVCAssertion;

test.describe.configure({ mode: 'parallel' });
/**
 * This required project of `td`
 */
test.describe('Verify UI of homepage.', () => {
	test.beforeEach(async ({ page }) => {
		td = new TodoMVCServie.TodoMVCManager(page);
		await td.goto();
	});
	test.afterEach(async () => {
		await td.page.close();
	});

	test('Header should be todos', async () => {
		await expect(td.page.getByRole('heading')).toHaveText('todos');
	});

	test('Input should be visible with placeholder', async () => {
		const ph = await td.input.getAttribute('placeholder');
		expect(ph).toBe('What needs to be done?');
	});

	test('Footer should have instructions and credits.', async () => {
		const footer = await td.page.locator('footer.info > p').allInnerTexts();

		expect(footer[0]).toBe('Double-click to edit a todo');
		expect(footer[1]).toBe('Created by the TodoMVC Team');
		expect(footer[2]).toBe('Part of TodoMVC');
	});
});

test.describe('Verify Adding Function.', () => {
	test.beforeEach(async ({ page }) => {
		td = new TodoMVCServie.TodoMVCManager(page);
		tda = new TodoMVCServie.TodoMVCAssertion(page);
		await td.goto();
	});

	test.afterEach(async () => {
		await td.page.close();
	});

	test('Input Note character should have new note added with valid filter options and hidden remove button', async () => {
		await td.inputNote('New Note');
		await tda.verifyAddedNote(['New Note']);
		await tda.verifyAddedNoteOptionsWithTotalAvailableNumber(1);
		// because no note has been marked as completed yet
		// so by default it should be disabled
		await expect(td.noteItemToggle.nth(0)).not.toBeChecked();
		await expect(td.filterClearComplete).toBeDisabled();
		await expect(td.deleteNoteButton.nth(0)).not.toBeVisible();
	});

	test('Input 1 single character should not be allowed to add', async () => {
		await td.inputNote('x');
		await expect(td.addedNoteLabel).not.toBeVisible();
	});

	test('Delete 1 of added note should remove only 1 note.', async () => {
		await td.inputNote('Note 1');
		await td.inputNote('Note 2');
		await td.inputNote('Note 3');

		await td.removeNote(1);
		await tda.verifyAddedNote(['Note 1', 'Note 3']);
		await tda.verifyAddedNoteOptionsWithTotalAvailableNumber(2);
		await expect(td.filterClearComplete).toBeDisabled();
	});

	test('Remove All note should also make Options disappear.', async () => {
		await td.inputNote('Note 1');
		await td.removeNote(0);

		await expect(td.addedNoteLabel).toHaveCount(0);
		await expect(td.addedNoteOptions).not.toBeVisible();
		await expect(td.filterAllNote).not.toBeVisible();
		await expect(td.filterActiveNote).not.toBeVisible();
		await expect(td.filterCompleteNote).not.toBeVisible();
		await expect(td.filterClearComplete).not.toBeVisible();
	});

	test('Tick the Added Note should update the List of item left', async () => {
		await td.inputNote('Note 1');
		await td.inputNote('Note 2');

		await td.toggleTheCheckBox(1);
		await tda.verifyAddedNoteIsChecked(0, false);
		await tda.verifyAddedNoteIsChecked(1, true);
		await tda.verifyAddedNoteOptionsWithTotalAvailableNumber(1);
	});
});
