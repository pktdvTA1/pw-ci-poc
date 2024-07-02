import { test } from '@playwright/test';
import { PrismaService } from '~databases/prisma/dbService';
import { permissions } from '~databases/prisma/seeders/';
const prisma = new PrismaService.PrismaManager();

test.describe('Prisma DB', () => {
	test.beforeAll(async () => {
		await prisma.truncateTables(['permissions']);
		await prisma.insertIntoTable('permissions', permissions);
	});
	test('Test Something', async () => {
		console.log('something');
	});
});
