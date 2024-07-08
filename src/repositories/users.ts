import { PrismaClient } from '@prisma/client';
export class UserManagement {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}
	async getUserLists(isActive: true = true) {
		return await this.prisma.users.findMany({
			where: {
				is_active: isActive,
				is_deleted: false,
			},
		});
	}
	async getUserById(userId: number) {
		return await this.prisma.users.findUnique({
			where: {
				id: userId,
				is_deleted: false,
			},
		});
	}
}
