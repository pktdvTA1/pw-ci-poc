import { ExchangeHelper } from '~src/features/exchanges';
import { RepositoryManager } from '.';

export class ExchangeRepository extends RepositoryManager {
	constructor() {
		super();
	}
	async getExchangeConfigurations() {
		return this.prisma.exchanges.findMany({
			include: {
				partnerId: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			where: {
				is_delete: false,
				partnerId: {
					is_delete: false,
				},
			},
			orderBy: {
				currency_code: 'asc',
			},
		});
	}

	async createExchangeConfiguration(
		query: ExchangeHelper.ExchangeConfigCreation
	) {
		return this.prisma.exchanges.create({
			data: query,
		});
	}

	async updateExchange(
		query: ExchangeHelper.ExchangeConfigCreation,
		id: number
	) {
		return this.prisma.exchanges.update({
			data: query,
			where: {
				id: id,
			},
		});
	}

	async findById(id: number) {
		return this.prisma.exchanges.findFirstOrThrow({
			where: {
				id: id,
				is_delete: false,
			},
		});
	}
}
