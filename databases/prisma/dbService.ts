import { PrismaClient } from '@prisma/client';
import type {
	PrismaModelNames,
	PrismaModelDataMapper,
} from './dataMapper.type';

export namespace PrismaService {
	export class PrismaManager {
		prisma: PrismaClient;

		constructor() {
			this.prisma = new PrismaClient();
		}

		async insertIntoTable<T extends PrismaModelNames>(
			table: T,
			data: PrismaModelDataMapper[T][]
		) {
			const model = this.prisma[table] as any;
			if (!model) {
				throw new Error(`Medle ${table} not found`);
			}
			try {
				const inserted = await model.createManyAndReturn({
					data: data,
					skipDuplicates: true,
				});
				if (inserted[0]['id']) {
					const sorted = inserted.sort((a: any, b: any) => b.id - a.id);
					const tableSeqName = `${table}_id_seq`;
					await this.prisma
						.$queryRaw`SELECT setval(${tableSeqName}, ${sorted[0].id}, true);`;
				}
			} catch (e) {
				throw new Error(`Unable to insert into table ${table} due to > ${e}`);
			}
		}

		async truncateTables(tables: PrismaModelNames[]) {
			const t = tables.join(',');
			try {
				await this.prisma.$executeRawUnsafe(
					`TRUNCATE TABLE ${t} RESTART IDENTITY CASCADE;`
				);
				console.log(`Truncated ${t}`);
			} catch (e) {
				throw new Error(`Unable to truncate tables due to > ${e}`);
			}
		}

		async queryAll<T extends PrismaModelNames>(table: T) {
			const model = this.prisma[table] as any;
			if (!model) {
				throw new Error(`Medle ${table} not found`);
			}
			try {
				return model.findMany();
			} catch (e) {
				throw new Error(`Unable to findAll (queryAll) due to > ${e}`);
			}
		}

		async queryById<T extends PrismaModelNames>(table: T, id: number) {
			const model = this.prisma[table] as any;
			if (!model) {
				throw new Error(`Medle ${table} not found`);
			}
			try {
				// yes it's findMany not findUnique or findOne
				// and yes we're query for id
				// if it's many then we've got some real problem here
				return model.findMany({
					where: {
						id: id,
					},
				});
			} catch (e) {
				throw new Error(`Unable to findAll (queryAll) due to > ${e}`);
			}
		}
	}
}
