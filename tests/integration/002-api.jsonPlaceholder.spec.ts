import { test, expect } from '@playwright/test';
// No POMS, no external import nothing but playwright itself.
test.use({ baseURL: 'https://jsonplaceholder.typicode.com' });

test.describe('Test API On jsonPlaceHolder', () => {
	test.describe('#GET Method', () => {
		test('Get All Posts should return multiple posts', async ({ request }) => {
			const res = await request.get('/posts');
			const body = await res.json();

			expect(res).toBeOK();
			expect(body).toHaveLength(100);
			expect(body[0]).toStrictEqual({
				userId: 1,
				id: 1,
				title:
					'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
				body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
			});
			expect(body[99]).toStrictEqual({
				userId: 10,
				id: 100,
				title: 'at nam consequatur ea labore ea harum',
				body: 'cupiditate quo est a modi nesciunt soluta\nipsa voluptas error itaque dicta in\nautem qui minus magnam et distinctio eum\naccusamus ratione error aut',
			});
		});

		test('Get existing Posts should return posts details', async ({
			request,
		}) => {
			const res = await request.get('/posts/10');
			const body = await res.json();

			expect(res).toBeOK();
			expect(body).toStrictEqual({
				userId: 1,
				id: 10,
				title: 'optio molestias id quia eum',
				body: 'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error',
			});
		});

		test('Get not existing Post should return error', async ({ request }) => {
			const res = await request.get('/posts/101');
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({});
		});

		test('Get posts with alphabet should return errors', async ({
			request,
		}) => {
			const res = await request.get('/posts/a');
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({});
		});

		test('Get Post comments should list of available comments under given post id.', async ({
			request,
		}) => {
			const res = await request.get('/posts/12/comments');
			const body = await res.json();

			expect(res.status()).toBe(200);
			expect(body[0]).toStrictEqual({
				postId: 12,
				id: 56,
				name: 'et dolorem corrupti sed molestias',
				email: 'Vince_Crist@heidi.biz',
				body: 'cum esse odio nihil reiciendis illum quaerat\nest facere quia\noccaecati sit totam fugiat in beatae\nut occaecati unde vitae nihil quidem consequatur',
			});
			expect(body[4]).toStrictEqual({
				postId: 12,
				id: 60,
				name: 'expedita libero quos cum commodi ad',
				email: 'Americo@estrella.net',
				body: 'error eum quia voluptates alias repudiandae\naccusantium veritatis maiores assumenda\nquod impedit animi tempore veritatis\nanimi et et officiis labore impedit blanditiis repudiandae',
			});
		});

		test('Get comment list form not exist Posts should return empty', async ({
			request,
		}) => {
			const res = await request.get('post/101/comments');
			const body = await res.json();

			expect(res.status()).toBe(200);
			expect(body).toHaveLength(0);
		});
	});

	test.describe('#POST Method', () => {
		test('Create New post should be successful', async ({ request }) => {
			const res = await request.post('/posts', {
				data: {
					title: 'foo',
					body: 'bar',
					userId: 1,
				},
			});
			const body = await res.json();

			expect(res).toBeOK();
			expect(body).toStrictEqual({
				title: 'foo',
				body: 'bar',
				userId: 1,
				id: 101,
			});
		});
		test('Create New post with empty payload should be successful', async ({
			request,
		}) => {
			const res = await request.post('/posts', {
				data: {},
			});
			const body = await res.json();

			expect(res).toBeOK();
			expect(body).toStrictEqual({
				id: 101,
			});
		});
	});

	test.describe('#PUT Method', () => {
		test('Update existing posts should be successful', async ({ request }) => {
			const res = await request.put('/posts/1', {
				data: {
					title: 'editingTitle',
					body: 'editingBody',
				},
			});
			const body = await res.json();

			expect(res).toBeOK();
			expect(body).toStrictEqual({
				title: 'editingTitle',
				body: 'editingBody',
				id: 1,
			});
		});

		test('Editing non-exist posts should be failure', async ({ request }) => {
			const res = await request.post('/posts/999', {
				data: {
					title: 'editingTitle',
					body: 'editingBody',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body).toStrictEqual({});
		});
	});
});
