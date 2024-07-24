import { test, expect } from '@playwright/test';
import { envConfig } from '~src/configs/env';
/*
simeple style, All in one file
This required server to be running
And also required database setup

This required project of `setup_DB`
This suite will run under project of `testDB``
 */

test.use({ baseURL: `http://${envConfig.HOST}:${envConfig.PORT}` });
test.describe.configure({ mode: 'parallel' });

test.describe('#Get User List', () => {
	test('When get user list by default, should return all status and not deleted.', async ({
		request,
	}) => {
		const res = await request.get('/api/users');
		const body = (await res.json()) as any[];

		await expect(res).toBeOK();
		expect(body).toHaveLength(3);
		expect(body[0].is_active).toBe(true);
		expect(body[1].is_active).toBe(true);
		expect(body[2].is_active).toBe(false);
	});

	test('When filter with Active should return only active users', async ({
		request,
	}) => {
		const res = await request.get('/api/user/filter', {
			params: {
				is_active: true,
			},
		});
		const body = (await res.json()) as any[];
		console.log('body', body);
		await expect(res).toBeOK();
		expect(body).toHaveLength(2);
		expect(body.every((d) => d.is_active === true)).toBeTruthy();
	});

	test('When Filter with Inactive should return only inactive user', async ({
		request,
	}) => {
		const res = await request.get('/api/user/filter', {
			params: {
				is_active: false,
			},
		});

		const body = (await res.json()) as any[];
		await expect(res).toBeOK();
		expect(body).toHaveLength(1);
		expect(body[0].is_active).toBe(false);
	});

	test('When ftiler with no params, should return all users', async ({
		request,
	}) => {
		const res = await request.get('/api/user/filter');
		const body = (await res.json()) as any[];

		await expect(res).toBeOK();
		expect(body).toHaveLength(3);
		expect(body[0].is_active).toBe(true);
		expect(body[1].is_active).toBe(true);
		expect(body[2].is_active).toBe(false);
	});
});
