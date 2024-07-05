import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '~src/schema/users';
import { StatusCode } from '~src/enums/statuCode';

export namespace userRoutes {
	const prisma = new PrismaClient();
	export const users = async (app: FastifyInstance, reply: FastifyReply) => {
		app.get('/users', async () => {
			const users = await prisma.users.findMany({
				where: {
					is_active: true,
					is_deleted: false,
				},
			});
			return reply.code(StatusCode.OK_200).send(users);
		});

		app.get(
			'/user/:id',
			userSchema.getByIndex,
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
					return reply.code(StatusCode.OK_200).send(user);
				} catch (e) {
					return reply.code(StatusCode.NOT_FOUND_404).send({
						msg: 'user not found',
					});
				}
			}
		);
	};
}
