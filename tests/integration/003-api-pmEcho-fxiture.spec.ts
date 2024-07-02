import { expect } from '@playwright/test';
import { test } from '../fixtures/pmEcho';
import { jwtDecode } from 'jwt-decode';

test.use({ baseURL: 'https://postman-echo.com' });
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

		const token = body.headers.authorization.split(' ')[1];
		const decoded = jwtDecode(token);

		expect(decoded).toHaveProperty('firstName', 'fixtureFirstName');
		expect(decoded).toHaveProperty('lastName', 'fixtureLastName');
		expect(decoded).toHaveProperty(
			'email',
			'firstName.lastName.fixure@email.com'
		);
		expect(decoded).toHaveProperty('isActive', true);
		expect(decoded).toHaveProperty('iat');
		expect(decoded).toHaveProperty('exp');
	});
});
