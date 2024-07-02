import { test } from '@playwright/test';
import { PrismaService } from '~databases/prisma/dbService';
import {
	permissions,
	roles,
	users,
	role_permissions,
} from '~databases/prisma/seeders/';
const prisma = new PrismaService.PrismaManager();

test.describe('Prisma DB', () => {
	test.beforeAll(async () => {
		await prisma.truncateTables([
			'permissions',
			'role_permissions',
			'roles',
			'users',
		]);
		await Promise.all([
			prisma.insertIntoTable('permissions', permissions),
			prisma.insertIntoTable('roles', roles),
		]);
		await Promise.all([
			prisma.insertIntoTable('role_permissions', role_permissions),
			prisma.insertIntoTable('users', users),
		]);
	});

	test('Test Something', async () => {
		console.log('something');
	});
});
