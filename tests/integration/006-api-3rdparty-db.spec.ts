import { test, expect } from '@playwright/test';
import { envConfig } from '~src/configs/env';

/**
 * this is simple test api
 * using local server with nothing being alter
 */
const activeUserList = [1, 2];

test.use({ baseURL: `http://${envConfig.HOST}:${envConfig.PORT}` });

test.describe.configure({ mode: 'parallel' });
test.describe('Local Server With 3rd Party', () => {
	test.describe('#GET /posts', () => {
		test('When get all posts should return only posts of active user.', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/posts');
			const body = await res.json();

			const inactiveUsrPost = body.filter(
				(v) => !activeUserList.includes(v.userId)
			);

			await expect(res).toBeOK();
			expect(inactiveUsrPost).toHaveLength(0);
		});
	});

	test.describe('#GET /user-posts/:id', () => {
		test('When get post of active user, Posts should be returned', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/user-posts/2');
			const body = await res.json();

			expect(body.length).toBeGreaterThan(0);
			const filterUser = body.filter((v) => v.userId !== 2);
			expect(filterUser).toHaveLength(0);
		});

		test('When get post of inactive user, Posts should be returned', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/user-posts/3');
			const body = await res.json();

			expect(body.length).toBeGreaterThan(0);
			const filterUser = body.filter((v) => v.userId !== 3);
			expect(filterUser).toHaveLength(0);
		});

		test('When get post of deleted user, no post should be returned', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/user-posts/4');
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({ msg: 'User Not Found' });
		});

		test('When get post of not exist user, no post should be returned', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/user-posts/99');
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({ msg: 'User Not Found' });
		});
	});

	test.describe('#GET /post/:id', () => {
		test('Get Post of active user, should return post data', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/post/1');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).not.toBe({});
			expect(body.userId).toBeTruthy();
			expect(body.id).toBeTruthy();
			expect(body.title).toBeTruthy();
			expect(body.body).toBeTruthy();
		});

		test('Get Post of inactive user, should return post data', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/post/3');
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body).not.toBe({});
			expect(body.userId).toBeTruthy();
			expect(body.id).toBeTruthy();
			expect(body.title).toBeTruthy();
			expect(body.body).toBeTruthy();
		});

		test('Get Post of deleted user should return no post', async ({
			request,
		}) => {
			const res = await request.get('/api/jph/post/40');
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({
				msg: 'Post Not Found',
			});
		});

		test('Get Not exist post should return no post', async ({ request }) => {
			const res = await request.get('/api/jph/post/0');
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({
				msg: 'Post Not Found',
			});
		});
	});

	test.describe('#POST /post/:id', () => {
		test('Create new post for active user should be have post data returned.', async ({
			request,
		}) => {
			const res = await request.post('/api/jph/post/1', {
				data: {
					title: 'Active User Post title',
					body: 'Active User Post body',
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();

			expect(body.refId).toBeTruthy();
			expect(body).toHaveProperty(
				'detail',
				'User Id of 1 has created new post with Active User Post title and Active User Post body.'
			);
		});

		test('Create new post for inactive user should be failure', async ({
			request,
		}) => {
			const res = await request.post('/api/jph/post/3', {
				data: {
					title: 'Active User Post title',
					body: 'Active User Post body',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toHaveProperty('msg', 'User Not Found');
		});

		test('Create new post for deleted user should be failure', async ({
			request,
		}) => {
			const res = await request.post('/api/jph/post/4', {
				data: {
					title: 'Active User Post title',
					body: 'Active User Post body',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toHaveProperty('msg', 'User Not Found');
		});
	});
});
