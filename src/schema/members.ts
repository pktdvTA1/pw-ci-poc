import type { FastifySchema } from 'fastify';
export namespace memberSchema {
	export const createMember: FastifySchema = {
		params: {
			type: 'object',
			properties: {
				email: { type: 'string', nullable: true },
				phoneNumber: {
					type: 'string',
					nullable: true,
				},
			},
		},
	};
}
