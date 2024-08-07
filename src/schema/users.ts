export namespace userSchema {
	export const getByIndex = {
		params: {
			type: 'object',
			properties: {
				id: {
					type: 'integer',
				},
			},
		},
	};
	export const filter = {
		querystring: {
			type: 'object',
			nullable: true,
			properties: {
				is_active: {
					type: 'boolean',
					nullable: true,
				},
			},
			additionalProperties: false,
		},
	};
	export const updateById = {
		params: {
			type: 'object',
			properties: {
				id: {
					type: 'integer',
				},
			},
		},
		body: {
			type: 'object',
			properties: {
				firstName: {
					type: 'string' || undefined,
				},
				lastName: { type: 'string' || undefined },
				isActive: { type: 'boolean' || undefined },
				isDelete: { type: 'boolean' || undefined },
			},
		},
	};
}
