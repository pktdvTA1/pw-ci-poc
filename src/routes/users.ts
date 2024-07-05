import { FastifyInstance, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

export namespace userRoutes {
	const prisma = new PrismaClient();
	export const users = async (app: FastifyInstance) => {
		app.get('/users', () => {
			const users = prisma.users.findMany({
				where: {
					is_active: true,
					is_deleted: false,
				},
			});
			return users;
		});
		app.get(
			'/user/:id',
			{
				schema: {
					params: {
						type: 'object',
						properties: {
							id: {
								type: 'integer',
							},
						},
					},
				},
			},
			(request: FastifyRequest<{ Params: { id: number } }>) => {
				const { id } = request.params;
				const user = prisma.users.findUniqueOrThrow({
					where: {
						id: id,
						is_active: true,
						is_deleted: false,
					},
				});
				return user;
			}
		);
	};
}
