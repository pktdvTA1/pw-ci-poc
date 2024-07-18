import { EcoSystem } from '../enums/group';

interface Criteria {
	type: EcoSystem.Origin;
	age: number;
	nationality: EcoSystem.Nationality[];
	accepted_source: EcoSystem.Source[];
}
export namespace ExtMemberHelper {
	export interface GetExtMember {
		email?: string;
		phoneNumber?: string;
		external_id?: string;
		origin: EcoSystem.Origin;
	}

	export interface ExtMember {
		id: number;
		firstName: string | null;
		lastName: string | null;
		nationality: string;
		email: string;
		age: number;
		is_active: boolean;
		is_delete: boolean;
		phoneNumber: string;
		created_at: Date;
		origin: string;
		external_id: string | null;
	}

	export const criteria: Criteria[] = [
		{
			type: EcoSystem.GroupName.PALACE_BLADE,
			age: 18,
			nationality: [EcoSystem.Nationality.TH],
			accepted_source: [EcoSystem.Source.EMAIL, EcoSystem.Source.PHONE],
		},
		{
			type: EcoSystem.GroupName.NEUNGZER,
			age: 18,
			nationality: [EcoSystem.Nationality.TH],
			accepted_source: [EcoSystem.Source.EMAIL, EcoSystem.Source.PHONE],
		},
		{
			type: EcoSystem.GroupName.PALACE_BLADE_INTERNATIONAL,
			age: 20,
			nationality: [EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.EMAIL],
		},
		{
			type: EcoSystem.GroupName.ENERGY_FISHING_TEA,
			age: 18,
			nationality: [EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.EMAIL],
		},
		{
			type: EcoSystem.GroupName.STROKUA,
			age: 20,
			nationality: [EcoSystem.Nationality.TH, EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.PHONE, EcoSystem.Source.EXTERNAL],
		},
		{
			type: EcoSystem.GroupName.THEYTALK,
			age: 20,
			nationality: [EcoSystem.Nationality.MARS, EcoSystem.Nationality.TH],
			accepted_source: [EcoSystem.Source.PHONE, EcoSystem.Source.EXTERNAL],
		},
		{
			type: EcoSystem.Inner.PUSHMAN,
			age: 18,
			nationality: [EcoSystem.Nationality.TH, EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.PHONE],
		},
		{
			type: EcoSystem.Inner.COMMITMAN,
			age: 18,
			nationality: [EcoSystem.Nationality.TH, EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.PHONE],
		},
		{
			type: EcoSystem.Inner.XCALIBER,
			age: 20,
			nationality: [EcoSystem.Nationality.TH, EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.PHONE],
		},
		{
			type: EcoSystem.Aliaz.SE7ENT,
			age: 20,
			nationality: [EcoSystem.Nationality.TH, EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.PHONE],
		},
		{
			type: EcoSystem.Aliaz.EI8HT,
			age: 20,
			nationality: [EcoSystem.Nationality.TH, EcoSystem.Nationality.MARS],
			accepted_source: [EcoSystem.Source.EMAIL],
		},
	];

	export const getCriteria = (origin: EcoSystem.Origin) => {
		return criteria.filter((v) => v.type === origin)[0];
	};
}
