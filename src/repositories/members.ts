import { PrismaClient } from '@prisma/client';
import { MemberHelper } from '../features/member';

export class MemberManager {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}
	async getMember(query: MemberHelper.GetMember) {
		if (!query.origin) {
			throw new Error(`Source is required.`);
		}
		console.log('query', query);
		return this.prisma.external_members.findFirst({
			where: {
				email: query.email || undefined,
				phoneNumber: query.phoneNumber || undefined,
				origin: query.origin,
				is_active: true,
				is_delete: false,
			},
		});
	}
}
