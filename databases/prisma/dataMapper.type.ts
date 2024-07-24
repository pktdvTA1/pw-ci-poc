import type { Prisma } from '@prisma/client';

export type PrismaModelNames = Prisma.ModelName;

// this should be somehow dynamically
// but still have no idea how.
// https://github.com/prisma/prisma/discussions/12453
export type PrismaModelDataMapper = {
	users: Prisma.usersCreateManyInput;
	roles: Prisma.rolesCreateManyInput;
	permissions: Prisma.permissionsCreateManyInput;
	role_permissions: Prisma.role_permissionsCreateManyInput;
	external_members: Prisma.external_membersCreateManyInput;
	registered_members: Prisma.registered_membersCreateManyInput;
	partners: Prisma.partnersCreateManyInput;
	exchanges: Prisma.exchangesCreateManyInput;
};
