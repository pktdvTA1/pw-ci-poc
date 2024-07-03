import { permissions } from './permissions';

const saPermissions = Object.keys(permissions).map((v, i) => {
	return {
		role_id: 1,
		permission_id: i + 1,
		is_active: true,
	};
});

export const role_permissions = [
	...saPermissions,
	{
		role_id: 2,
		permission_id: 5,
	},
	{
		role_id: 2,
		permission_id: 6,
	},
];
