import { app } from './app';
import { envConfig } from './configs/env';

const host = envConfig.HOST;
const port = envConfig.PORT;

export const start = async () => {
	try {
		await app.listen({ host: host, port: port as number });
		console.log(`#### Server Started @ ${host}:${port} ####`);
	} catch (e) {
		app.log.error(e);
		process.exit(1);
	}
};

start();
