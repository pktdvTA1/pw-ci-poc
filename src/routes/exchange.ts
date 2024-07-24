import { FastifyInstance } from 'fastify';

import { ExchangeController } from '~src/controllers/exchange';
import { ExchangeSchema } from '~src/schema/exchanges';
export namespace ExchangeRoute {
	export const exchanges = async (app: FastifyInstance) => {
		app.post(
			'/api/exchange',
			{ schema: ExchangeSchema.createExchange },
			ExchangeController.createExchangeConfiguration
		);
		app.get('/api/exchanges', ExchangeController.getExchanges);
	};
}
