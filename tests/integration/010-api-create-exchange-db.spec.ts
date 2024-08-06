import { expect, test } from '@playwright/test';
import { PrismaService } from '~databases/prisma/dbService';
import { envConfig } from '~src/configs/env';

test.use({ baseURL: `http://${envConfig.HOST}:${envConfig.PORT}` });

test.describe.configure({ mode: 'default' });
test.describe('Exchange Configuration Management', () => {
	test.beforeAll(async () => {
		const prisma = new PrismaService.PrismaManager();
		await prisma.truncateTables(['exchanges']);
	});

	test.describe('#POST /exchange', () => {
		test('Should return success when creating an exchange configuration with valid data', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'KFC Active Exchange USD 1',
					currency_code: 'EUR',
					inbound_ratio_them: 1.1,
					inbound_ratio_us: 1.1,
					outbound_ratio_us: 1.05,
					outbound_ratio_them: 2,
					is_active: true,
					minimum_amount: 100.0,
					partner_id: 1,
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.name).toBe('KFC Active Exchange USD 1');
			expect(body.currency_code).toBe('EUR');
			expect(body.inbound_ratio_them).toBe('1.1');
			expect(body.inbound_ratio_us).toBe('1.1');
			expect(body.outbound_ratio_us).toBe('1.05');
			expect(body.outbound_ratio_them).toBe('2');
			expect(body.is_active).toBe(true);
			expect(body.minimum_amount).toBe('100');
			expect(body.partner_id).toBe(1);
		});

		test('Should return an error when creating an exchange configuration with an invalid currency code', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Invalid Currency Code Exchange',
					currency_code: 'E',
					inbound_ratio_them: 1.1,
					inbound_ratio_us: 1.1,
					outbound_ratio_us: 1.05,
					outbound_ratio_them: 1.05,
					is_active: true,
					minimum_amount: 150.0,
					partner_id: 1,
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Invalid input of Currency Code');
		});

		test('Should return an error for invalid currency name', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Invalid Name@123',
					currency_code: 'USD',
					inbound_ratio_them: 1.1,
					inbound_ratio_us: 1.1,
					outbound_ratio_us: 1.05,
					outbound_ratio_them: 1.05,
					is_active: true,
					minimum_amount: 150.0,
					partner_id: 1,
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toContain('Invalid input of Currency Name');
		});

		test('Should return an error when creating an exchange configuration with duplicate name and currency code', async ({
			request,
		}) => {
			// Add initial valid entry
			await request.post('api/exchange', {
				data: {
					name: 'Duplicate Exchange',
					currency_code: 'GBP',
					inbound_ratio_them: 1.1,
					inbound_ratio_us: 1.1,
					outbound_ratio_us: 1.05,
					outbound_ratio_them: 1.05,
					is_active: true,
					minimum_amount: 150.0,
					partner_id: 1,
				},
			});

			const res = await request.post('api/exchange', {
				data: {
					name: 'Duplicate Exchange',
					currency_code: 'GBP',
					inbound_ratio_them: 1.1,
					inbound_ratio_us: 1.1,
					outbound_ratio_us: 1.05,
					outbound_ratio_them: 1.05,
					is_active: true,
					minimum_amount: 150.0,
					partner_id: 1,
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe(
				'Invalid input of Currency Name and Currency Code, them combined may already exist'
			);
		});

		test('Should return an error when creating an exchange configuration with an invalid partner ID', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Invalid Partner ID Exchange',
					currency_code: 'JPY',
					inbound_ratio_them: 1.2,
					inbound_ratio_us: 1.2,
					outbound_ratio_us: 1.15,
					outbound_ratio_them: 1.15,
					is_active: true,
					minimum_amount: 150.0,
					partner_id: 999,
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Partner Not Found');
		});

		test('Should return error message when ratio is not number', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Error Prone Exchange',
					currency_code: 'ERR',
					inbound_ratio_them: 'Invalid Data',
					inbound_ratio_us: 1.2,
					outbound_ratio_us: 1.15,
					outbound_ratio_them: 1.15,
					is_active: true,
					minimum_amount: 150.0,
					partner_id: 1,
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.message).toBe('body/inbound_ratio_them must be number');
		});

		test('Should return error message when ratio is less than 1', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Error Prone Exchange',
					currency_code: 'ERR',
					inbound_ratio_them: 1,
					inbound_ratio_us: 0.9,
					outbound_ratio_us: 1.15,
					outbound_ratio_them: 1.15,
					is_active: true,
					minimum_amount: 150.0,
					partner_id: 1,
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.message).toBe('body/inbound_ratio_us must be >= 1');
		});

		test('Should return error message when input data without partner', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Error Prone Exchange',
					currency_code: 'ERR',
					inbound_ratio_them: 1,
					inbound_ratio_us: 1,
					outbound_ratio_us: 1.15,
					outbound_ratio_them: 1.15,
					is_active: true,
					minimum_amount: 150.0,
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toContain('Something wrong when creating configuration');
		});

		test('Should returen success when create exchange with inactive status', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Inactive exchange',
					currency_code: 'THB',
					inbound_ratio_them: 1,
					inbound_ratio_us: 1,
					outbound_ratio_us: 2,
					outbound_ratio_them: 3,
					is_active: false,
					minimum_amount: 150.0,
					partner_id: 1,
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.name).toBe('Inactive exchange');
			expect(body.currency_code).toBe('THB');
			expect(body.inbound_ratio_them).toBe('1');
			expect(body.inbound_ratio_us).toBe('1');
			expect(body.outbound_ratio_us).toBe('2');
			expect(body.outbound_ratio_them).toBe('3');
			expect(body.is_active).toBe(false);
			expect(body.minimum_amount).toBe('150');
			expect(body.partner_id).toBe(1);
		});

		test('Should create success with inactive partner', async ({ request }) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Inactive exchange 2',
					currency_code: 'THB',
					inbound_ratio_them: 1,
					inbound_ratio_us: 1,
					outbound_ratio_us: 2,
					outbound_ratio_them: 3,
					is_active: false,
					minimum_amount: 150.0,
					partner_id: 2, //Inactive partner
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.name).toBe('Inactive exchange 2');
			expect(body.currency_code).toBe('THB');
			expect(body.inbound_ratio_them).toBe('1');
			expect(body.inbound_ratio_us).toBe('1');
			expect(body.outbound_ratio_us).toBe('2');
			expect(body.outbound_ratio_them).toBe('3');
			expect(body.is_active).toBe(false);
			expect(body.minimum_amount).toBe('150');
			expect(body.partner_id).toBe(2);
		});

		test('Should return an error when creating an exchange configuration with a deleted partner', async ({
			request,
		}) => {
			const res = await request.post('api/exchange', {
				data: {
					name: 'Exchange with Deleted Partner',
					currency_code: 'USD',
					inbound_ratio_them: 1.1,
					inbound_ratio_us: 1.1,
					outbound_ratio_us: 1.05,
					outbound_ratio_them: 2,
					is_active: true,
					minimum_amount: 100.0,
					partner_id: 3, //Deleted partner
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Partner Not Found');
		});
	});
});
