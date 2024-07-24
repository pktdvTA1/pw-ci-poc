import { PrismaClient } from '@prisma/client';
// import type { Prisma } from '@prisma/client';

export class PartnerRepository {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}

	async getPartner() {
		return this.prisma.partners.findMany({
			where: {
				is_delete: false,
			},
			orderBy: {
				id: 'asc',
			},
		});
	}
}
