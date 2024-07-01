import { test, expect } from '@playwright/test';
import { PostmanEchoManager } from '~poms/echo';
import { JWTManager } from '~poms/auth';

let echo: PostmanEchoManager;
const jwt = new JWTManager({
	firstName: 'ThisisFirstName',
	lastName: 'ThisisLastName',
	email: 'firstName.lastName@email.com',
	isActive: true,
});

test.use({ baseURL: 'https://postman-echo.com' });
test.describe.configure({ mode: 'parallel' });

test.describe('Test API Describe', () => {
	test.beforeAll(async ({ request }) => {
		echo = new PostmanEchoManager(request);
	});
	test.beforeEach(async () => {
		echo.headers = { ...echo.headers, Authorization: `Bearer ${jwt.token}` };
	});

	test('001 #GET with no params', async ({ request }) => {
		const res = await request.get(echo.getEndpoint);
		expect(res.status()).toBe(200);
	});

	test('002 #GET with headers, query params and body params (use as template).', async ({
		request,
	}) => {
		// Arrange
		const params = { ...echo.params };
		const payload = { ...echo.payload };
		delete echo.headers['Authorization'];
		// Act
		const res = await request.get(echo.getEndpoint, {
			headers: echo.headers,
			params: params,
			data: payload,
		});
		const body = await res.json();
		//Assert
		expect(res.status()).toBe(200);
		expect(body.headers).not.toHaveProperty('Authorization');
		expect(body.args).toHaveProperty('foo', 'bar');
		expect(body.args).toHaveProperty('far', 'boo');
		expect(body.args).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.args).toHaveProperty('bodyfar', 'bodyboo');
	});

	test('003 #GET with custom query params and body params.', async ({
		request,
	}) => {
		// Arrange
		const params = { ...echo.params, extraParams: 'extraValue' };
		const payload = {
			...echo.payload,
			bodyfar: 'newBodyBoo',
			extraPayload: 'extraPayloadValue',
		};
		const headers = { ...echo.headers };
		delete params['foo'];
		// Act
		const res = await request.get(echo.getEndpoint, {
			headers: headers,
			params: params,
			data: payload,
		});
		const body = await res.json();
		//Assert
		expect(res.status()).toBe(200);
		expect(body.headers.authorization).not.toBe('');
		expect(body.args).not.toHaveProperty('foo', 'bar');
		expect(body.args).toHaveProperty('far', 'boo');
		expect(body.args).toHaveProperty('extraParams', 'extraValue');
		expect(body.args).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.args).toHaveProperty('bodyfar', 'newBodyBoo');
		expect(body.args).toHaveProperty('extraPayload', 'extraPayloadValue');
	});

	test('004 #POST with custom headers, auth, payload', async ({ request }) => {
		// can also directly modify the echo.headers
		const payload = { ...echo.payload, extraPayload: 'extraPayloadValue' };
		echo.headers.Authorization = 'definitely not bearer';

		const res = await request.post('/post', {
			headers: echo.headers,
			data: payload,
		});
		const body = await res.json();

		expect(res.status()).toBe(200);
		expect(body.headers.authorization).toBe('definitely not bearer');
		expect(body.data).toHaveProperty('bodyfoo', 'bodybar');
		expect(body.data).toHaveProperty('bodyfar', 'bodyboo');
		expect(body.data).toHaveProperty('extraPayload', 'extraPayloadValue');
	});
});
