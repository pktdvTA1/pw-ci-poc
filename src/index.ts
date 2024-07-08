import { app } from './app';
import { envConfig } from './configs/env';
// import { PrismaService } from '~databases/prisma/dbService';

const host = envConfig.HOST;
const port = envConfig.PORT;

// export const prisma = new PrismaService.PrismaManager();

const start = async () => {
	try {
	} catch (e) {
		app.log.error(e);
		process.exit(1);
	}
	console.log('connect to database');
	try {
		await app.listen({ host: host, port: port as number });
		console.log(`Server Started @ ${host}:${port}`);
	} catch (e) {
		app.log.error(e);
		process.exit(1);
	}
};

start();

export { app };
