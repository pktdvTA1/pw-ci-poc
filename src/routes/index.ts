import type { FastifyInstance } from 'fastify';
import { userRoutes } from './users';
const prefix = 'api';
export const routes = async (app: FastifyInstance) => {
	app.register(userRoutes.users, { prefix: prefix });
	app.get('/health-check', (request, reply) => {
		reply.send({ msg: 'ok', time: new Date() });
	});
};
