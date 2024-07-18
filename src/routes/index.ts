import type { FastifyInstance } from 'fastify';
import { userRoutes } from './users';
import { memberRoute } from './members';
import { jsonPlaceholderRoute } from './jsonPlaceholder';

export const routes = async (app: FastifyInstance) => {
	app.register(userRoutes.users);
	app.register(memberRoute.members);

	app.register(jsonPlaceholderRoute.jsonPlaceHolder);

	app.get('/health-check', (request, reply) => {
		reply.send({ msg: 'ok', time: new Date() });
	});
};
