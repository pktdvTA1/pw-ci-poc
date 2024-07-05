import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
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
			async (
				request: FastifyRequest<{ Params: { id: number } }>,
				reply: FastifyReply
			) => {
				const { id } = request.params;
				try {
					const user = await prisma.users.findUniqueOrThrow({
						where: {
							id: id,
							is_active: true,
							is_deleted: false,
						},
					});
					return reply.code(200).send(user);
				} catch (e) {
					return reply.code(404).send({
						msg: 'user not found',
					});
				}
			}
		);
	};
}
