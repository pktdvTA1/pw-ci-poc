import { ExchangeHelper } from '~src/features/exchanges';
import { RepositoryManager } from '.';

export class ExchangeRepository extends RepositoryManager {
	constructor() {
		super();
	}
	async getExchangeConfigurations() {
		return this.prisma.exchanges.findMany({
			where: {
				is_delete: false,
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
}
