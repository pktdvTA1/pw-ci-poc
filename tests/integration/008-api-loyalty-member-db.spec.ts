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
			console.log('res: ', res);

			// const body = await res.json();
			// await expect(res).toBeOK();
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

		test('Should return error message when age doesnt meet criteria', async ({
			request,
		}) => {
			const res = await request.post('api/member', {
				data: {
					email: 'prinnada.c@gmail.com',
					phoneNumber: '0123456789',
					origin: 'Palace Blade',
				},
			});
			console.log('res: ', res);

			const body = await res.json();
			console.log('body: ', body);

			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Age criteria is not met');
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

		test('Should return error message when email and phone number is missing', async ({
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
	});
});
