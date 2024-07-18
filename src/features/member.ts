import { EcoSystem } from '../enums/group';

type Origin = `${EcoSystem.GroupName | EcoSystem.Inner | EcoSystem.Aliaz}`;
interface Criteria {
	type: Origin;
	age: number;
	nationality: EcoSystem.Nationality[];
	accepted_source: EcoSystem.Source[];
}
export namespace MemberHelper {
	export interface GetMember {
		email?: string;
		phoneNumber?: string;
		origin: Origin;
	}

	export const emailRegisterAbleSource: Partial<Origin[]> = [
		EcoSystem.GroupName.PALACE_BLADE,
		EcoSystem.GroupName.NEUNGZER,
		EcoSystem.GroupName.PALACE_BLADE_INTERNATIONAL,
		EcoSystem.GroupName.ENERGY_FISHING_TEA,
		EcoSystem.Aliaz.EI8HT,
	];

	export const phoneRegisterAbleSource: Partial<Origin[]> = [
		EcoSystem.GroupName.PALACE_BLADE,
		EcoSystem.GroupName.NEUNGZER,
		EcoSystem.GroupName.STROKUA,
		EcoSystem.GroupName.THEYTALK,
		EcoSystem.Inner.PUSHMAN,
		EcoSystem.Inner.COMMITMAN,
		EcoSystem.Inner.XCALIBER,
		EcoSystem.Aliaz.SE7ENT,
	];

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
			nationality: [EcoSystem.Nationality.MARS],
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

	export const getCriteria = (origin: Origin) => {
		return criteria.filter((v) => v.type === origin)[0];
	};
}
