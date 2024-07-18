import { EcoSystem } from '../enums/group';

export namespace MemberHelper {
	export interface getExtMember {
		email?: string;
		phoneNumber?: string;
		external_id?: string;
		origin: EcoSystem.Origin;
	}
}
