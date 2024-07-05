import { app } from './app';

const host = 'localhost';
const port = 3000;
const start = async () => {
	try {
		await app.listen({ host: host, port: port as number });
		console.log(`Server Started @ ${host}:${port}`);
	} catch (e) {
		app.log.error(e);
		process.exit(1);
	}
};

start();
