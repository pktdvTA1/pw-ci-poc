import type { FastifySchema } from 'fastify';
export namespace memberSchema {
	export const createMember: FastifySchema = {
		body: {
			type: 'object',
			properties: {
				email: { type: 'string', nullable: true },
				phoneNumber: {
					type: 'string',
					nullable: true,
				},
				external_id: {
					type: 'string',
					nullable: true,
				},
			},
		},
	};
	export const UpdateMemberById: FastifySchema = {
		params: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
				},
			},
		},
		body: {
			type: 'object',
			properties: {
				firstName: {
					type: 'string',
				},
				lastName: {
					type: 'string',
				},
				nationality: {
					type: 'string',
				},
				age: {
					type: 'number',
				},
				isActive: {
					type: 'boolean',
				},
				phoneNumber: {
					type: 'string',
				},
				passportNumber: {
					type: 'string',
				},
				passportExpiryDate: {
					type: 'string',
				},
			},
		},
	};
}
