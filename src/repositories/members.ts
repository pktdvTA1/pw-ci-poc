import { PrismaClient } from '@prisma/client';
import { ExtMemberHelper } from '../features/extMember';

export class MemberManager {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
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
			},
		});
	}
}
