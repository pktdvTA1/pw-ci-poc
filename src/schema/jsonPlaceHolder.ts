export namespace JPHSchema {
	export const getByIndex = {
		params: {
			type: 'object',
			properties: {
				id: {
					type: 'number',
				},
			},
		},
	};
	export const createNewPost = {
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
