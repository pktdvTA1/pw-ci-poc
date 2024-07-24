import { PrismaClient } from '@prisma/client';
import { ExchangeHelper } from '~src/features/exchanges';
export class ExchangeRepository {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
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
