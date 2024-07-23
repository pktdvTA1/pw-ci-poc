import { test, expect } from '@playwright/test';
import { JPHManager } from '~src/features/jsonPlaceholder';
import { UserManagement } from '~src/repositories/users';
import { envConfig } from '~src/configs/env';
import { app } from '~src/app';
import * as sinon from 'sinon';
/**
 * This stubs out the 3rd party which is jsonPlaceholder.
 * In order to do so This suite has to initiate the server by itself.
 * So no server running required.
 * Also stub the repository meaning no DB connection need either.
 * In conclusion, There's no need for internet connection, db or server.
 * Hopefully the realworld structure will be as easy as this one
 * Copium**
 * Pro
 * - we don't need to care about anything
 * - Extremely fast
 * Con
 * - Painfully hard because we need to find the right function.
 * - Stub with care, We want to test the logic or handler.
 * Not the data returned (cause its a data we provided).
 * - It looks very much like Unit Test, yes...
 * This only required project of `stub`
 */

const getPostStub = sinon.stub(JPHManager.prototype, 'getAllPosts');
const getUserstub = sinon.stub(UserManagement.prototype, 'getUsers');
const getUserByIdStub = sinon.stub(UserManagement.prototype, 'getUserById');
const postCreatePostStub = sinon.stub(
	JPHManager.prototype,
	'createNewPostWithUserId'
);

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
	test.beforeAll(async () => {
		const host = envConfig.HOST;
		const port = envConfig.PORT;
		await app.listen({ host: host, port: port as number });
		// await app.ready();
	});
	test.afterAll(async () => {
		await app.close();
	});
	test.describe('Get All Posts of all users (except deleted)', () => {
		// becaise no server nor db is running .restore() will cause the failure
		// test.afterEach(async () => {
		// 	getPostStub.restore();
		// 	getUserstub.restore();
		// });

		test('When user is active should return post data', async ({ request }) => {
			getUserstub.resolves(defaultUser as never);
			getPostStub.resolves(defaultPost);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.length).toBeGreaterThanOrEqual(1);
		});

		test('When has no users should return empty array', async ({ request }) => {
			getUserstub.resolves([]);
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
			getUserstub.resolves(u as never);
			getPostStub.resolves(defaultPost);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toHaveLength(0);
		});

		test('When there is no post, should return empty array', async ({
			request,
		}) => {
			getUserstub.resolves(defaultUser as never);
			getPostStub.resolves([]);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toStrictEqual([]);
		});

		test('When user has no posts should return empty array', async ({
			request,
		}) => {
			const u = [{ ...defaultUser[0] }];
			u[0].id = 999;
			getUserstub.resolves(u as never);
			getPostStub.resolves([]);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toStrictEqual([]);
		});
	});

	test.describe('Creating Post various user.', () => {
		test('Create Post of active user should be successful.', async ({
			request,
		}) => {
			const u = { ...defaultUser[0] };
			const post = {
				title: 'Stub Post',
				body: 'Stub Body',
			};
			getUserByIdStub.resolves(u as never);
			postCreatePostStub.resolves({
				userId: 1,
				id: 1,
				title: post.title,
				body: post.body,
			});

			const res = await request.post('/api/jph/post/1', {
				data: post,
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.refId).toBeTruthy();
			expect(body).toHaveProperty(
				'detail',
				`User Id of ${u.id} has created new post with ${post.title} and ${post.body}.`
			);
		});

		test('Create Post of inactive user should be failure.', async ({
			request,
		}) => {
			const u = { ...defaultUser[0], is_active: false };
			const post = {
				title: 'Stub Post',
				body: 'Stub Body',
			};
			getUserByIdStub.resolves(u as never);
			postCreatePostStub.resolves({
				userId: 1,
				id: 1,
				title: post.title,
				body: post.body,
			});

			const res = await request.post('/api/jph/post/1', {
				data: post,
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({
				msg: 'User Not Found',
			});
		});

		test('When JPH returns empty string for both title and body, Should be able to transform data.', async ({
			request,
		}) => {
			const u = { ...defaultUser[0] };
			const post = {
				title: '',
				body: '',
			};
			getUserByIdStub.resolves(u as never);
			postCreatePostStub.resolves({
				userId: 1,
				id: 1,
				title: post.title,
				body: post.body,
			});

			const res = await request.post('/api/jph/post/1', {
				data: post,
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toHaveProperty(
				'detail',
				`User Id of ${u.id} has created new post with ${post.title} and ${post.body}.`
			);
		});

		test('When JPH returns boolean instead of string, should be failed due to scehama check.', async ({
			request,
		}) => {
			const u = { ...defaultUser[0] };
			const post = {
				title: true,
				body: false,
			};
			getUserByIdStub.resolves(u as never);
			postCreatePostStub.resolves({
				userId: 1,
				id: 1,
				title: post.title,
				body: post.body,
			});

			const res = await request.post('/api/jph/post/1', {
				data: post,
			});
			const body = await res.json();
			expect(res.status()).toBe(400);
			expect(body).toStrictEqual({
				statusCode: 400,
				code: 'FST_ERR_VALIDATION',
				error: 'Bad Request',
				message: 'body/title must be string',
			});
		});
		test('When JPH returns undefined properties.', async ({ request }) => {
			const u = { ...defaultUser[0] };
			getUserByIdStub.resolves(u as never);
			postCreatePostStub.resolves({
				userId: 1,
				id: 1,
				title: undefined,
				body: undefined,
			});

			const res = await request.post('/api/jph/post/1', {
				data: {},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toHaveProperty(
				'detail',
				`User Id of ${u.id} has created new post with undefined and undefined.`
			);
		});
	});
});
