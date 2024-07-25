import type { FastifySchema } from 'fastify';

export namespace ExchangeSchema {
	export const createExchange: FastifySchema = {
		body: {
			type: 'object',
			additionalProperties: false,
			properties: {
				name: {
					type: 'string',
				},
				currency_code: {
					type: 'string',
				},
				partner_id: {
					type: 'integer',
				},
				inbound_ratio_them: {
					type: 'number',
					minimum: 1,
					maximum: 9999,
				},
				inbound_ratio_us: {
					type: 'number',
					minimum: 1,
					maximum: 9999,
				},
				outbound_ratio_us: {
					type: 'number',
					minimum: 1,
					maximum: 9999,
				},
				outbound_ratio_them: {
					type: 'number',
					minimum: 1,
					maximum: 9999,
				},
				minimum_amount: {
					type: 'number',
					minimum: 0,
				},
				is_active: {
					type: 'boolean',
				},
			},
		},
	};
	export const updateExchange: FastifySchema = {
		params: {
			type: 'object',
			properties: {
				id: {
					type: 'integer',
				},
			},
		},
		...createExchange,
	};
}
