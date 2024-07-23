import { EcoSystem } from '~src/enums/group';
export namespace MemberHelper {
	export interface UpdateMember {
		firstName?: string;
		lastName?: string;
		nationality?: `${EcoSystem.Nationality}`;
		age?: number;
		isActive?: boolean;
		isDelete?: boolean;
		phoneNumber?: string;
		passportNumber?: string;
		passportExpiryDate?: Date;
	}
}
