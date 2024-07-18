import { test as setup } from '@playwright/test';
import { PrismaService } from '~databases/prisma/dbService';
import {
	external_members,
	permissions,
	registered_members,
	role_permissions,
	roles,
	users,
} from '~databases/prisma/seeders/';

setup('Setup Common Data', async () => {
	console.log('Setting Up DB');
	const prisma = new PrismaService.PrismaManager();
	await prisma.truncateTables([
		'permissions',
		'role_permissions',
		'roles',
		'users',
		'external_members',
		'registered_members',
	]);
	await Promise.all([
		prisma.insertIntoTable('permissions', permissions),
		prisma.insertIntoTable('roles', roles),
	]);
	await Promise.all([
		prisma.insertIntoTable('role_permissions', role_permissions),
		prisma.insertIntoTable('users', users),
	]);
	await Promise.all([
		prisma.insertIntoTable('external_members', external_members),
		prisma.insertIntoTable('registered_members', registered_members),
	]);
});
