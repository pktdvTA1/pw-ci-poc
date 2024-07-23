import Fastify from 'fastify';
import { routes } from './routes';
import Ajv from 'ajv';

const ajv = new Ajv({
	removeAdditional: false,
	useDefaults: true,
});

const app = Fastify({ logger: true });

app.setValidatorCompiler(({ schema }) => ajv.compile(schema));
app.register(routes);

export { app };
