export namespace userSchema {
	export const getByIndex = {
		schema: {
			params: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
					},
				},
			},
		},
	};
}
