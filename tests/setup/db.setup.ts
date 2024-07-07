import { test as setup } from '@playwright/test';
import { PrismaService } from '~databases/prisma/dbService';
import {
	permissions,
	roles,
	users,
	role_permissions,
} from '~databases/prisma/seeders/';

setup('Setup Common Data', async () => {
	console.log('Setting Up DB');
	const prisma = new PrismaService.PrismaManager();
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
