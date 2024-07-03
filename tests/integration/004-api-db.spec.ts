import { test, expect } from '@playwright/test';
import { PrismaService } from '~databases/prisma/dbService';

const prisma = new PrismaService.PrismaManager();

test.describe('Prisma DB and Setup', () => {
	test('Query All User should return 2', async () => {
		const data = await prisma.queryAll('users');

		expect(data).toHaveLength(2);
	});

	test('Query By Id should return only 1 and correct user.', async () => {
		const data = await prisma.queryById('users', 2);
		expect(data).toHaveLength(1);

		const userData = data[0];

		expect(userData.id).toBe(2);
		expect(userData.email).toBe('prinada.c@email.com');
	});
});
