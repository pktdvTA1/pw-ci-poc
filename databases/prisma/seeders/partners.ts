import type { Prisma } from '@prisma/client';

export const partners: Prisma.partnersCreateManyInput[] = [
	{
		name: 'partner1',
	},
	{
		name: 'partner2',
	},
	{
		name: 'partner3',
		is_acitve: false,
	},
	{
		name: 'partner4',
		is_delete: true,
	},
	{
		name: 'partner5',
		is_acitve: false,
		is_delete: true,
	},
];
