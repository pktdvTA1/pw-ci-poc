import { test, expect } from '@playwright/test';
import { todoMVCServie } from '~poms/todoMVC.page';

let td: todoMVCServie.TodoMVCManager;
let tda: todoMVCServie.TodoMVCAssertion;

test.describe.configure({ mode: 'parallel' });

test.describe('Verify UI of homepage.', () => {
	test.beforeEach(async ({ page }) => {
		td = new todoMVCServie.TodoMVCManager(page);
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
	test.beforeAll(async () => {});
	test.beforeEach(async ({ page }) => {
		td = new todoMVCServie.TodoMVCManager(page);
		tda = new todoMVCServie.TodoMVCAssertion(page);
		await td.goto();
	});

	test.afterEach(async () => {
		await td.page.close();
	});

	test('Input Note character should have new note added.', async () => {
		await td.inputNote('New Note');
		await td.page.screenshot({ path: 'ss.png' });
		await tda.verifyAddedNote(['New Note']);
	});
	test('Input 1 single character should not be allowed to add', async () => {
		await td.inputNote('x');
		await expect(td.addedNotes).not.toBeVisible();
	});
});
