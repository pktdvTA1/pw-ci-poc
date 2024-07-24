import { PrismaClient } from '@prisma/client';

export class RepositoryManager {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}
	async connect() {
		return this.prisma.$connect;
	}
}
