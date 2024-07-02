import type { Prisma } from '@prisma/client';

export type PrismaModelNames = Prisma.ModelName;

// this should be somehow dynamically
// but still have no idea how.
export type PrismaModelDataMapper = {
	users: Prisma.usersCreateManyInput;
	roles: Prisma.rolesCreateManyInput;
	permissions: Prisma.permissionsCreateManyInput;
	role_permissions: Prisma.role_permissionsCreateManyInput;
};
