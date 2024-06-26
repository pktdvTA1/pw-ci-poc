import { test, expect } from '@playwright/test';
test.use({ baseURL: 'https://postman-echo.com' });
test.describe('Test API Describe', async () => {
	test(`#GET with no params`, async ({ request }) => {
		const res = await request.get('/get');
		expect(res.status()).toBe(200);
	});
	test(`#GET with query params and body params`, async ({ request }) => {
		const res = await request.get('/get', {
			params: {
				foo: 'bar',
				far: 'boo',
			},
			data: {
				bodyfoo: 'bodybar',
				bodyfar: 'bodyboo',
			},
		});
		expect(res.status()).toBe(200);
		const body = await res.json();
		expect(body.args).toHaveProperty('foo', 'bar');
		expect(body.args).toHaveProperty('far', 'boo');
		expect(body.args).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.args).toHaveProperty('bodyfar', 'bodyboo');
	});
	test(`#POST`, async ({ request }) => {
		const res = await request.post('/post', {
			headers: {
				'Content-type': 'application/json',
			},
			data: {
				bodyfoo: 'bodybar',
				bodyfar: 'bodyboo',
			},
		});
		expect(res.status()).toBe(404);
		const body = await res.json();
		expect(body.data).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.data).toHaveProperty('bodyfar', 'bodyboo');
	});
});
