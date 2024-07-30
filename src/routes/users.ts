import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '~src/schema/users';
import { StatusCode } from '~src/enums/statuCode';

export namespace userRoutes {
	const prisma = new PrismaClient();

	export const users = async (app: FastifyInstance) => {
		app.get('/api/users', async (reqeust, reply: FastifyReply) => {
			const users = await prisma.users.findMany({
				where: {
					is_deleted: false,
				},
			});
			return reply.code(StatusCode.OK_200).send(users);
		});

		app.get(
			'/api/user/filter',
			{ schema: userSchema.filter },
			async (
				request: FastifyRequest<{
					Querystring: {
						is_active?: boolean;
					};
				}>,
				reply: FastifyReply
			) => {
				const { is_active } = request.query;
				try {
					const users = await prisma.users.findMany({
						where: {
							is_active: is_active,
							is_deleted: false,
						},
					});
					return reply.code(StatusCode.OK_200).send(users);
				} catch (e) {
					return reply.code(StatusCode.BAD_REQUEST_400).send({
						msg: e,
					});
				}
			}
		);

		app.get(
			'/api/user/:id',
			{
				schema: userSchema.getByIndex,
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
					return reply.code(StatusCode.OK_200).send(user);
				} catch (e) {
					return reply.code(StatusCode.NOT_FOUND_404).send({
						msg: 'user not found',
					});
				}
			}
		);

		app.patch(
			'/api/user/:id',
			{ schema: userSchema.updateById },
			async (
				request: FastifyRequest<{
					Params: { id: number };
					Body: { [key: string]: any };
				}>,
				reply: FastifyReply
			) => {
				const { id } = request.params;
				const { firstName, lastName, isActive, isDelete } = request.body;
				try {
					const r = await prisma.users.update({
						where: {
							id: id,
						},
						data: {
							first_name: firstName,
							last_name: lastName,
							is_active: isActive,
							is_deleted: isDelete,
						},
					});
					return reply.code(StatusCode.OK_200).send(r);
				} catch (e: any) {
					return reply.code(StatusCode.NOT_FOUND_404).send({
						msg: 'User or Data is invalid',
					});
				}
			}
		);
	};
}
