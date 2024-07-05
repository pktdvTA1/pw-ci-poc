import type { FastifyInstance } from 'fastify';
import { userRoutes } from './users';

export const routes = async (app: FastifyInstance) => {
	app.register(userRoutes.users);

	app.get('/health-check', (request, reply) => {
		reply.send({ msg: 'ok', time: new Date() });
	});
};
