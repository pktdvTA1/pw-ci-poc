import Fastify from 'fastify';
import { routes } from './routes';

const app = Fastify({ logger: true });

app.register(routes);

export { app };
