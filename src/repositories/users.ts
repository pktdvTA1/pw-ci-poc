import { PrismaClient } from '@prisma/client';
export class UserRepository {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}
	async getUsers(isActive: true = true) {
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
