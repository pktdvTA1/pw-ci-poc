import { expect, test } from '@playwright/test';
import { PrismaService } from '~databases/prisma/dbService';
import { registered_members } from '~databases/prisma/seeders/';
import { envConfig } from '~src/configs/env';
test.use({ baseURL: `http://${envConfig.HOST}:${envConfig.PORT}` });

test.describe.configure({ mode: 'parallel' });
test.describe('Update Loyalty Member Management', () => {
	test.beforeAll(async () => {
		console.log(test.info().workerIndex);
		if (test.info().workerIndex === 1) {
			const prisma = new PrismaService.PrismaManager();
			await prisma.truncateTables(['registered_members']);
			await Promise.all([
				prisma.insertIntoTable('registered_members', registered_members),
			]);
		}
	});
	test.describe('#PATCH /member/:id', () => {
		test('Should return success when updating a member with valid information', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/1`, {
				data: {
					firstName: 'Updated-FirstName',
					lastName: 'Updated-LastName',
					nationality: 'TH',
					age: 23,
					phoneNumber: '123456789',
				},
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.firstName).toBe('Updated-FirstName');
			expect(body.lastName).toBe('Updated-LastName');
			expect(body.nationality).toBe('TH');
			expect(body.age).toBe(23);
			expect(body.phoneNumber).toBe('123456789');
			expect(body.is_active).toBe(true);
		});

		test('Should return error when updating a member with too long firstName', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/2`, {
				data: { firstName: 'A'.repeat(51), lastName: 'UpdatedLastName' },
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('FirstName or Lastname is longer than 50');
		});

		test('Should return error when updating a member with too long lastName', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/2`, {
				data: { firstName: 'UpdatedFirstName', lastName: 'A'.repeat(61) },
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('FirstName or Lastname is longer than 50');
		});

		test('Should return error when updating a member with unsupported nationality', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/3`, {
				data: { nationality: 'LA' },
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Nationality is not support');
		});

		test('Should return error when updating a member with age less than 5', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/4`, {
				data: { age: 4 },
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Age cant be lower than 5');
		});

		test('Should return error when updating a member with a negative age', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/5`, {
				data: { age: -1 },
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Age cant be lower than 5');
		});

		test('Should return error when updating a member with the same phone number', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/1`, {
				data: { phoneNumber: '0812345678' },
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('PhoneNumber should not be the same');
		});

		test('Should return error when updating a member with passport data when no passport is registered', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/23`, {
				data: { passportNumber: 'A12345678', passportExpiryDate: '2030-01-01' },
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe(
				'No Passport number or Expiry found, Please register passport first.'
			);
		});

		test('Should return error when updating a member with expired passport', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/1`, {
				data: { passportExpiryDate: '2020-01-01' }, // Expired date
			});
			const body = await res.json();

			expect(res.status()).toBe(400);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe(
				'Passport Expiry cant be lower or equal to current year.'
			);
		});

		test('Should return not found when updating a non-existent member', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/9999`, {
				data: {
					firstName: 'UpdatedFirstName',
					lastName: 'UpdatedLastName',
					nationality: 'Thai',
					age: 30,
					phoneNumber: '0987654321',
					passportNumber: 'A12345678',
					passportExpiryDate: '2030-12-15T00:00:00Z',
				},
			});
			const body = await res.json();

			expect(res.status()).toBe(404);
			expect(body.result).toBe('FAIL');
			expect(body.msg).toBe('Registered Member is not found.');
		});

		test('Should return the previous email if the email is not editable', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/1`, {
				data: { email: 'newemail@gmail.com' },
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.email).toBe('prinnada.c@gmail.com');
		});

		test('Should return the previous status is_delete is not editable', async ({
			request,
		}) => {
			const res = await request.patch(`api/member/1`, {
				data: { is_delete: true },
			});
			const body = await res.json();

			await expect(res).toBeOK();
			expect(body.is_delete).toBe(false);
		});
	});
});
