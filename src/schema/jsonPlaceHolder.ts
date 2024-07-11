export namespace JPHSchema {
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
	export const createNewPost = {
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
				title: {
					type: 'string',
				},
				body: {
					type: 'string',
				},
			},
		},
	};
}
