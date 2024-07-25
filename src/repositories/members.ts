import { ExtMemberHelper } from '../features/extMember';
import { MemberHelper } from '~src/features/member';
import { RepositoryManager } from '.';

export class MemberRepository extends RepositoryManager {
	constructor() {
		super();
	}
	async getExtMember(query: ExtMemberHelper.GetExtMember) {
		return this.prisma.external_members.findFirstOrThrow({
			where: {
				email: query.email || undefined,
				phoneNumber: query.phoneNumber || undefined,
				external_id: query.external_id || undefined,
				origin: query.origin,
				is_active: true,
				is_delete: false,
			},
		});
	}

	async getMemberById(query: number) {
		return this.prisma.registered_members.findUniqueOrThrow({
			where: {
				id: query,
				is_delete: false,
			},
		});
	}

	async insertIntoRegisterMember(data: ExtMemberHelper.ExtMember) {
		return this.prisma.registered_members.create({
			data: {
				external_member_id: data.id,
				firstName: data.firstName,
				lastName: data.lastName,
				nationality: data.nationality,
				email: data.email,
				age: data.age,
				origin: data.origin,
				phoneNumber: data.phoneNumber,
				identity_number: data.identity_number,
				passport_number: data.passport_number,
				passport_expiry_date: data.passport_expiry_date,
			},
		});
	}

	async updateMember(memberId: number, data: MemberHelper.UpdateMember) {
		return this.prisma.registered_members.update({
			where: {
				id: memberId,
				is_delete: false,
			},
			data: {
				firstName: data.firstName,
				lastName: data.lastName,
				nationality: data.nationality,
				age: data.age,
				is_active: data.isActive,
				phoneNumber: data.phoneNumber,
				passport_number: data.passportNumber,
				passport_expiry_date: data.passportExpiryDate,
			},
		});
	}
}
