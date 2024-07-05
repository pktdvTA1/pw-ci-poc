import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

export namespace userRoutes {
	const prisma = new PrismaClient();
	export const users = async (app: FastifyInstance) => {
		app.get('/users', () => {
			const users = prisma.users.findMany({
				where: {
					is_active: true,
				},
			});
			return users;
		});
	};
}
