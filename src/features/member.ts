import { EcoSystem } from '../enums/group';

type Resources = `${EcoSystem.GroupName | EcoSystem.Inner | EcoSystem.Aliaz}`;

export namespace MemberHelper {
	export interface GetMember {
		email?: string;
		phoneNumber?: string;
		source: Resources;
	}

	export const emailRegisterAbleSource: Partial<Resources[]> = [
		EcoSystem.GroupName.PALACE_BLADE,
		EcoSystem.GroupName.NEUNGZER,
		EcoSystem.GroupName.PALACE_BLADE_INTERNATIONAL,
		EcoSystem.GroupName.ENERGY_FISHING_TEA,
		EcoSystem.Aliaz.EI8HT,
	];

	export const phoneRegisterAbleSource: Partial<Resources[]> = [
		EcoSystem.GroupName.PALACE_BLADE,
		EcoSystem.GroupName.NEUNGZER,
		EcoSystem.GroupName.STROKUA,
		EcoSystem.GroupName.THEYTALK,
		EcoSystem.Inner.PUSHMAN,
		EcoSystem.Inner.COMMITMAN,
		EcoSystem.Inner.XCALIBER,
		EcoSystem.Aliaz.SE7ENT,
	];
}
