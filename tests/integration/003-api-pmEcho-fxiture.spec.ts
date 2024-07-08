import { expect } from '@playwright/test';
import { test } from '~fixtures/pmEcho';
import { jwtDecode } from 'jwt-decode';
/**
 * This suite uses fixture style.
 * To put it simple we move beforeEach() to fixture instead
 * So we can customize each setup for each tests individually
 * And also reuse existing fixture if it's suite your test
 */
test.use({ baseURL: 'https://postman-echo.com' });

test.describe.configure({ mode: 'parallel' });
test.describe('Postman Echo API with Fixture', () => {
	test('#GET Get echo with Auth should also return Auth in headers', async ({
		withAuth,
	}) => {
		const res = await withAuth.request.get(withAuth.getEndpoint, {
			headers: withAuth.headers,
			params: withAuth.params,
		});
		const body = await res.json();

		expect(res.status()).toBe(200);
		expect(body.args).toStrictEqual({ foo: 'bar', far: 'boo' });
		expect(body.headers.authorization).not.toBe('');

		const token = withAuth.getHeaderTokenBearer(body.headers);
		const decoded = jwtDecode(token);

		expect(decoded).toHaveProperty('firstName', 'fixtureFirstName');
		expect(decoded).toHaveProperty('lastName', 'fixtureLastName');
		expect(decoded).toHaveProperty(
			'email',
			'firstName.lastName.fixture@email.com'
		);
		expect(decoded).toHaveProperty('isActive', true);
		expect(decoded).toHaveProperty('iat');
		expect(decoded).toHaveProperty('exp');
	});

	test('#GET Get Echo with invalid header should return the invalid auth in header', async ({
		withInvalidAuth,
	}) => {
		const res = await withInvalidAuth.request.get(withInvalidAuth.getEndpoint, {
			headers: withInvalidAuth.headers,
			params: withInvalidAuth.params,
		});
		const body = await res.json();

		expect(res.status()).toBe(200);
		expect(body.args).toStrictEqual({ foo: 'bar', far: 'boo' });

		const token = withInvalidAuth.getHeaderTokenBearer(body.headers);
		expect(token).toBe('something.not.right');
	});
});
