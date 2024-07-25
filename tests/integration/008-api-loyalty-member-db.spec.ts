import { expect, test } from '@playwright/test';
import { envConfig } from '~src/configs/env';

test.use({ baseURL: `http://${envConfig.HOST}:${envConfig.PORT}` });

test.describe.configure({ mode: 'parallel' });
test.describe('Loyalty Member Management', () => {
	test.describe('#POST /members', () => {
		test('Should return success when creating a user with valid information', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'pipat.k@gmail.com',
					phoneNumber: '0123456789',
					origin: 'Palace Blade',
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.firstName).toBe('Pipat');
			expect(body.lastName).toBe('Kaewsakulchai');
			expect(body.nationality).toBe('TH');
			expect(body.email).toBe('pipat.k@gmail.com');
			expect(body.age).toBe(18);
			expect(body.origin).toBe('Palace Blade');
			expect(body.is_active).toBe(true);
		});

		test('Should return member not found when creating a user with invalid information', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'parn@gmail.com',
					phoneNumber: '0123456789',
					origin: 'Palace Blade',
				},
			});

			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.msg).toBe('External Member Not Found');
		});

		test('Should return error for a user aged < 18', async ({ request }) => {
			const res = await request.post('api/member', {
				data: {
					email: 'prinnada.c@gmail.com',
					phoneNumber: '0123456789',
					origin: 'Palace Blade',
				},
			});

			const body = await res.json();

			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Age criteria is not met');
		});

		test('Should return success for a valid user aged > 18', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'neungz.k@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade',
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.email).toBe('neungz.k@gmail.com');
			expect(body.age).toBe(30);
			expect(body.origin).toBe('Palace Blade');
		});

		test('Should return error message when nationality doesnt meet criteria', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'jjzhu@gmail.com',
					phoneNumber: '0123456789',
					origin: 'Palace Blade',
				},
			});

			const body = await res.json();

			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Nationality criteria is not met');
		});

		test('Should return error message when origin is not matched', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'prinnada.c@gmail.com',
					phoneNumber: '0123456789',
					origin: 'Twice',
				},
			});
			const body = await res.json();
			const origin = 'Twice';
			const originMessagePattern = new RegExp(
				`Origin of '?${origin}'? is not support`
			);

			expect(res.status()).toBe(400);
			expect(body.msg).toMatch(originMessagePattern);
		});

		test('Should return error message when email and phone number is empty string', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: '',
					phoneNumber: '',
					origin: 'Palace Blade',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.msg).toBe(
				'Origin and Source is not matched. Email or Phone Or External ID you provided may not met the aceeptance sources'
			);
		});

		test('Should return required message when email and phone number is null', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: null,
					phoneNumber: null,
					origin: 'Palace Blade',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.msg).toBe('Email or Phone are required');
		});

		test('Should return error for a user aged < 20', async ({ request }) => {
			const res = await request.post('api/member', {
				data: {
					email: 'mingming.w@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade International',
				},
			});
			const body = await res.json();

			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Age criteria is not met');
		});

		test('Should return success for a valid user aged 20', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'yuyuyang.y@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade International',
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.email).toBe('yuyuyang.y@gmail.com');
			expect(body.age).toBe(20);
			expect(body.origin).toBe('Palace Blade International');
		});

		test('Should return success for a valid user aged > 20', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'xunxu@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade International',
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.email).toBe('xunxu@gmail.com');
			expect(body.age).toBe(30);
			expect(body.origin).toBe('Palace Blade International');
		});

		test('Should return error for a inactive user', async ({ request }) => {
			const res = await request.post('api/member', {
				data: {
					email: 'huaxu@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade International',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.msg).toBe('External Member Not Found');
		});

		test('Should return error for a inactive user and deleted', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'luheng@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade International',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.msg).toBe('External Member Not Found');
		});

		test('Should return success for an active user who is not deleted', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'xiaotao@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade International',
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.email).toBe('xiaotao@gmail.com');
			expect(body.is_active).toBe(true);
		});

		test('Should return error for an active user who is deleted', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'longlong.c@gmail.com',
					phoneNumber: '0812345679',
					origin: 'Palace Blade International',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.msg).toBe('External Member Not Found');
		});
	});
});
