import { PrismaClient } from '@prisma/client';
import { MemberHelper } from '../features/member';

export class MemberManager {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}
	async getMember(query: MemberHelper.GetMember) {
		if (!query.source) {
			throw new Error(`Source is required.`);
		}
		if (
			MemberHelper.emailRegisterAbleSource.includes(query.source) &&
			!query.email
		) {
			throw new Error(`Email is required for ${query.source}.`);
		}
		if (
			MemberHelper.phoneRegisterAbleSource.includes(query.source) &&
			!query.phoneNumber
		) {
			throw new Error(`Phone is required for ${query.source}.`);
		}
		console.log('query', query);
		return this.prisma.external_members.findFirst({
			where: {
				email: query.email || undefined,
				phoneNumber: query.phoneNumber || undefined,
				origin: query.source,
				is_active: true,
				is_delete: false,
			},
		});
	}
}
