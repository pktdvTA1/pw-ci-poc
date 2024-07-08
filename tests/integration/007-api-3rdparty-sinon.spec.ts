import { test, expect } from '@playwright/test';
import { JPHManager } from '~src/features/jsonPlaceholder';
import { envConfig } from '~src/configs/env';
import { app } from '~src/index';
import * as sinon from 'sinon';

const getPostStub = sinon.stub(JPHManager.prototype, 'getAllPosts');

test.use({ baseURL: `http://${envConfig.HOST}:${envConfig.PORT}` });
test.describe('Stub with sinon', () => {
	test.beforeAll(async () => {
		await app.ready();
	});
	test.afterEach(async () => {
		sinon.restore();
	});

	test('Stub Response Get Post', async ({ request }) => {
		getPostStub.resolves([
			{
				userId: 99,
				id: 199,
				title: 'stubTitle',
				body: 'stubBody',
			},
		]);
		const res = await request.get('/api/jph/posts');
		const body = await res.json();

		await expect(res).toBeOK();
		expect(body).toHaveLength(0);
	});
});
