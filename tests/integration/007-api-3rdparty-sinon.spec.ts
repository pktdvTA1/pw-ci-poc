import { test, expect } from '@playwright/test';
import { JPHManager } from '~src/features/jsonPlaceholder';
import { UserManagement } from '~src/repositories/users';
import { envConfig } from '~src/configs/env';
import { app } from '~src/index';
import * as sinon from 'sinon';
/**
 * This stubs out the 3rd party which is jsonPlaceholder
 * This suite initiates the servier so no server running in background needed
 * Also stub the repository meaning no DB connection need either
 * Hopefully the realworld structure will be as easy as this one
 * Copium**
 * Pro
 * - we don't need to care about seeder data at all
 * - extremely fast
 * Con
 * - Extremely hard because we need to find the right function
 */

const getPostStub = sinon.stub(JPHManager.prototype, 'getAllPosts');
const getUserListStub = sinon.stub(UserManagement.prototype, 'getUserLists');
const defaultPost = [
	{
		userId: 1,
		id: 1,
		title: 'stubTitle',
		body: 'stubBody',
	},
];
const defaultUser = [{ id: 1, is_active: true, is_deleted: false }];

test.use({ baseURL: `http://${envConfig.HOST}:${envConfig.PORT}` });
test.describe.configure({ mode: 'default' });

test.describe('Stub with sinon', () => {
	test.describe('Get All Posts of all users (except deleted)', () => {
		test.beforeAll(async () => {
			await app.ready();
		});
		// becaise no server nor db is running .restore() will cause the failure
		// test.afterEach(async () => {
		// 	getPostStub.restore();
		// 	getUserListStub.restore();
		// });

		test('When user is active should return post data', async ({ request }) => {
			getUserListStub.resolves(defaultUser as never);
			getPostStub.resolves(defaultPost);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.length).toBeGreaterThanOrEqual(1);
		});

		test('When has no users should return empty array', async ({ request }) => {
			getUserListStub.resolves([]);
			getPostStub.resolves(defaultPost);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toHaveLength(0);
		});

		test('When all users are deleted should return empty array', async ({
			request,
		}) => {
			const u = [...defaultUser];
			u[0].is_deleted = true;
			getUserListStub.resolves(u as never);
			getPostStub.resolves(defaultPost);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toHaveLength(0);
		});

		test('When there is no post, should return empty array', async ({
			request,
		}) => {
			getUserListStub.resolves(defaultUser as never);
			getPostStub.resolves([]);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toStrictEqual([]);
		});

		test('When user has no posts should return empty array', async ({
			request,
		}) => {
			const u = [...defaultUser];
			u[0].id = 999;
			getUserListStub.resolves(u as never);
			getPostStub.resolves([]);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toStrictEqual([]);
		});
	});
});
