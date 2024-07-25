// import type { PrismaT } from '@prisma/client';
import { Prisma } from '@prisma/client';
export namespace ExchangeHelper {
	export interface ExchangeConfigCreation {
		id?: number;
		name: string;
		currency_code: string;
		inbound_ratio_them: number;
		inbound_ratio_us: number;
		outbound_ratio_us: number;
		outbound_ratio_them: number;
		is_active?: boolean;
		is_delete?: boolean;
		minimum_amount?: number;
		create_date?: Date;
		update_date?: Date;
		partner_id: number;
	}
	export interface RawExchangeWithpPartnerData {
		id: number;
		name: string;
		currency_code: string;
		partner_id: number;
		inbound_ratio_them: Prisma.Decimal;
		inbound_ratio_us: Prisma.Decimal;
		outbound_ratio_us: Prisma.Decimal;
		outbound_ratio_them: Prisma.Decimal;
		is_active: boolean | null;
		is_delete: boolean | null;
		minimum_amount: Prisma.Decimal | null;
		create_date: Date | null;
		update_date: Date | null;
		partnerId: {
			id: number;
			name: string;
		};
	}

	export const transformExchangeWithPartnerData = (
		d: RawExchangeWithpPartnerData[]
	) => {
		return d.map((v) => {
			return {
				id: v.id,
				name: v.name,
				currencyCode: v.currency_code,
				partner: {
					id: v.partnerId.id,
					name: v.partnerId.name,
				},
				inboundRatio: {
					us: v.inbound_ratio_us.toNumber(),
					them: v.inbound_ratio_them.toNumber(),
				},
				outboundRatio: {
					us: v.outbound_ratio_us.toNumber(),
					them: v.outbound_ratio_them.toNumber(),
				},
				isActive: v.is_active,
				minimumAmount: v.minimum_amount?.toNumber(),
				createDate: v.create_date,
				updateDate: v.update_date,
			};
		});
	};
}
