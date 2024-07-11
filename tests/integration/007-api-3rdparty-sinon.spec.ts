import { test, expect } from '@playwright/test';
import { JPHManager } from '~src/features/jsonPlaceholder';
import { UserManagement } from '~src/repositories/users';
import { envConfig } from '~src/configs/env';
import { app } from '~src/app';
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
			const u = [{ ...defaultUser[0] }];
			u[0].id = 999;
			getUserListStub.resolves(u as never);
			getPostStub.resolves([]);

			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).toStrictEqual([]);
		});
	});

	test.describe('Creating Post various user.', () => {
		/*
		Control every ingest data both db and form 3rd party
		w/o db or internet connection needed
		 */
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

		/*
		simulating when test uncontrolable 3rd party to see our handler
		 */
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

		test('When JPH returns boolean instead of string, should be able to handle as normal string.', async ({
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

			await expect(res).toBeOK();
			expect(body).toHaveProperty(
				'detail',
				`User Id of ${u.id} has created new post with ${post.title} and ${post.body}.`
			);
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
