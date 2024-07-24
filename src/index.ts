import { app } from './app';
import { envConfig } from './configs/env';
import { RepositoryManager } from './repositories';

const host = envConfig.HOST;
const port = envConfig.PORT;

export const start = async () => {
	try {
		// not really necessary due to lazy connect but well to be sure
		const repo = new RepositoryManager();
		await Promise.all([
			repo.connect,
			app.listen({ host: host, port: port as number }),
		]);
		console.log('Connected to DB');
		console.log(`#### Server Started @ ${host}:${port} ####`);
	} catch (e) {
		app.log.error(e);
		process.exit(1);
	}
};

start();
