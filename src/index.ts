import { app } from './app';

const start = async () => {
	try {
		await app.listen({ host: 'localhost', port: 3000 });
	} catch (e) {
		app.log.error(e);
		process.exit(1);
	}
};

start();
