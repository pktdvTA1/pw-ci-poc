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
}
