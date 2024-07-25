import { FastifyReply } from 'fastify';
import { StatusCode } from '~src/enums/statuCode';
export namespace CustomError {
	export const exchangeConfig = (reply: FastifyReply, input: string) => {
		return reply.code(StatusCode.OK_200).send({
			result: 'FAIL',
			msg: `Invalid input of ${input}`,
		});
	};
	export const partnerNotFound = (reply: FastifyReply) => {
		return reply.code(StatusCode.NOT_FOUND_404).send({
			result: 'FAIL',
			msg: 'Partner Not Found',
		});
	};

	export const exchangeNotFound = (reply: FastifyReply) => {
		return reply.code(StatusCode.NOT_FOUND_404).send({
			result: 'FAIL',
			msg: 'Exchange Not Found',
		});
	};
}
