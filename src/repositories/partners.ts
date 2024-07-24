import { RepositoryManager } from '.';

export class PartnerRepository extends RepositoryManager {
	constructor() {
		super();
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
