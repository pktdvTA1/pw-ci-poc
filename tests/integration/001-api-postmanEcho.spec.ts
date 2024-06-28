import { test, expect } from '@playwright/test';
import { PostmanEchoService } from '~poms/echo';

let echo: PostmanEchoService;

test.use({ baseURL: 'https://postman-echo.com' });
test.describe.configure({ mode: 'parallel' });

test.describe('Test API Describe', async () => {
	test.beforeEach(async ({ request }) => {
		echo = new PostmanEchoService(request);
	});

	test(`001 #GET with no params`, async ({ request }) => {
		const res = await request.get(echo.getEndpoint);
		expect(res.status()).toBe(200);
	});

	test(`002 #GET with query params and body params (use as template).`, async ({
		request,
	}) => {
		// Arrange
		const params = { ...echo.payload };
		const payload = { ...echo.payload };
		// Act
		const res = await request.get(echo.getEndpoint, {
			params: params,
			data: payload,
		});
		const body = await res.json();
		//Assert
		expect(res.status()).toBe(200);
		expect(body.args).toHaveProperty('foo', 'bar');
		expect(body.args).toHaveProperty('far', 'boo');
		expect(body.args).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.args).toHaveProperty('bodyfar', 'bodyboo');
	});

	test(`003 #GET with query params and body params (modified template).`, async ({
		request,
	}) => {
		// ACT
		const params = { ...echo.params, extraParams: 'extraValue' };
		const payload = {
			...echo.payload,
			bodyfar: 'newBodyBoo',
			extraPayload: 'extraPayloadValue',
		};
		delete params['foo'];
		// Arrange
		const res = await request.get(echo.getEndpoint, {
			params: params,
			data: payload,
		});
		const body = await res.json();
		//Assert
		expect(res.status()).toBe(200);
		expect(body.args).not.toHaveProperty('foo', 'bar');
		expect(body.args).toHaveProperty('far', 'boo');
		expect(body.args).toHaveProperty('extraParams', 'extraValue');
		expect(body.args).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.args).toHaveProperty('bodyfar', 'newBodyBoo');
		expect(body.args).toHaveProperty('extraPayload', 'extraPayloadValue');
	});

	test(`004 #POST with custom headers and payload`, async ({ request }) => {
		const headers = { ...echo.headers, Authorization: 'Bearer xxx' };
		const payload = { ...echo.payload, extraPayload: 'extraPayloadValue' };

		const res = await request.post('/post', {
			headers: headers,
			data: payload,
		});
		const body = await res.json();

		expect(res.status()).toBe(200);
		expect(body.headers).toHaveProperty('authorization', 'Bearer xxx');
		expect(body.data).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.data).toHaveProperty('bodyfar', 'bodyboo');
		expect(body.data).toHaveProperty('extraPayload', 'extraPayloadValue');
	});
});
