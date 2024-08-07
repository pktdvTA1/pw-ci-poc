import type { Prisma } from '@prisma/client';
export const exchanges: Prisma.exchangesCreateManyInput[] = [
	{
		id: 1,
		name: 'KFC-Active Exchange USD-1',
		currency_code: 'USD',
		partner_id: 1,
		inbound_ratio_them: 1.1,
		inbound_ratio_us: 1.1,
		outbound_ratio_us: 1.05,
		outbound_ratio_them: 2,
		is_active: true,
		is_delete: false,
		minimum_amount: 100.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 2,
		name: 'KFC-Active Exchange USD-2',
		currency_code: 'USD',
		partner_id: 2,
		inbound_ratio_them: 1.1,
		inbound_ratio_us: 1.1,
		outbound_ratio_us: 1.05,
		outbound_ratio_them: 1.05,
		is_active: true,
		is_delete: false,
		minimum_amount: 100.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 3,
		name: 'KFC-Active Exchange USD-3',
		currency_code: 'USD',
		partner_id: 3,
		inbound_ratio_them: 1.1,
		inbound_ratio_us: 1.1,
		outbound_ratio_us: 1.05,
		outbound_ratio_them: 1.05,
		is_active: true,
		is_delete: false,
		minimum_amount: 100.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 4,
		name: 'KFC-Active Exchange USD-4',
		currency_code: 'USD',
		partner_id: 4,
		inbound_ratio_them: 1.1,
		inbound_ratio_us: 1.1,
		outbound_ratio_us: 1.05,
		outbound_ratio_them: 1.05,
		is_active: true,
		is_delete: false,
		minimum_amount: 100.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 5,
		name: 'KFC-Inactive Exchange USD-5',
		currency_code: 'USD',
		partner_id: 1,
		inbound_ratio_them: 1.2,
		inbound_ratio_us: 1.2,
		outbound_ratio_us: 1.15,
		outbound_ratio_them: 1.15,
		is_active: false,
		is_delete: false,
		minimum_amount: 200.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 6,
		name: 'KFC-Inactive Exchange USD-6',
		currency_code: 'USD',
		partner_id: 2,
		inbound_ratio_them: 1.2,
		inbound_ratio_us: 1.2,
		outbound_ratio_us: 1.15,
		outbound_ratio_them: 1.15,
		is_active: false,
		is_delete: false,
		minimum_amount: 200.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 7,
		name: 'KFC-Inactive Exchange USD-7',
		currency_code: 'USD',
		partner_id: 3,
		inbound_ratio_them: 1.2,
		inbound_ratio_us: 1.2,
		outbound_ratio_us: 1.15,
		outbound_ratio_them: 1.15,
		is_active: false,
		is_delete: false,
		minimum_amount: 200.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 8,
		name: 'KFC-Inactive Exchange USD-8',
		currency_code: 'USD',
		partner_id: 4,
		inbound_ratio_them: 1.2,
		inbound_ratio_us: 1.2,
		outbound_ratio_us: 1.15,
		outbound_ratio_them: 1.15,
		is_active: false,
		is_delete: false,
		minimum_amount: 200.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 9,
		name: 'KFC-Active-Delete Exchange USD-9',
		currency_code: 'USD',
		partner_id: 1,
		inbound_ratio_them: 1.3,
		inbound_ratio_us: 1.3,
		outbound_ratio_us: 1.25,
		outbound_ratio_them: 1.25,
		is_active: true,
		is_delete: true,
		minimum_amount: 300.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 10,
		name: 'KFC-Active-Delete Exchange USD-10',
		currency_code: 'USD',
		partner_id: 2,
		inbound_ratio_them: 1.3,
		inbound_ratio_us: 1.3,
		outbound_ratio_us: 1.25,
		outbound_ratio_them: 1.25,
		is_active: true,
		is_delete: true,
		minimum_amount: 300.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 11,
		name: 'KFC-Active-Delete Exchange USD-11',
		currency_code: 'USD',
		partner_id: 3,
		inbound_ratio_them: 1.3,
		inbound_ratio_us: 1.3,
		outbound_ratio_us: 1.25,
		outbound_ratio_them: 1.25,
		is_active: true,
		is_delete: true,
		minimum_amount: 300.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 12,
		name: 'KFC-Active-Delete Exchange USD-12',
		currency_code: 'USD',
		partner_id: 4,
		inbound_ratio_them: 1.3,
		inbound_ratio_us: 1.3,
		outbound_ratio_us: 1.25,
		outbound_ratio_them: 1.25,
		is_active: true,
		is_delete: true,
		minimum_amount: 300.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 13,
		name: 'KFC-Inactive-Delete Exchange USD-13',
		currency_code: 'USD',
		partner_id: 1,
		inbound_ratio_them: 1.4,
		inbound_ratio_us: 1.4,
		outbound_ratio_us: 1.35,
		outbound_ratio_them: 1.35,
		is_active: false,
		is_delete: true,
		minimum_amount: 400.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 14,
		name: 'KFC-Inactive-Delete Exchange USD-14',
		currency_code: 'USD',
		partner_id: 2,
		inbound_ratio_them: 1.4,
		inbound_ratio_us: 1.4,
		outbound_ratio_us: 1.35,
		outbound_ratio_them: 1.35,
		is_active: false,
		is_delete: true,
		minimum_amount: 400.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 15,
		name: 'KFC-Inactive-Delete Exchange USD-15',
		currency_code: 'USD',
		partner_id: 3,
		inbound_ratio_them: 1.4,
		inbound_ratio_us: 1.4,
		outbound_ratio_us: 1.35,
		outbound_ratio_them: 1.35,
		is_active: false,
		is_delete: true,
		minimum_amount: 400.0,
		create_date: new Date(),
		update_date: new Date(),
	},
	{
		id: 16,
		name: 'KFC-Inactive-Delete Exchange USD-16',
		currency_code: 'USD',
		partner_id: 4,
		inbound_ratio_them: 1.4,
		inbound_ratio_us: 1.4,
		outbound_ratio_us: 1.35,
		outbound_ratio_them: 1.35,
		is_active: false,
		is_delete: true,
		minimum_amount: 400.0,
		create_date: new Date(),
		update_date: new Date(),
	},
];
