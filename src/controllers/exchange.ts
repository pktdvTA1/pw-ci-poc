import { FastifyReply, FastifyRequest } from 'fastify';
import { ExchangeHelper } from '~src/features/exchanges';
import { ExchangeRepository } from '~src/repositories/exchanges';
import { StatusCode } from '~src/enums/statuCode';

import { CustomError } from '~src/utils/customError';

export namespace ExchangeController {
	const exchangeRepository = new ExchangeRepository();

	export const createExchangeConfiguration = async (
		request: FastifyRequest<{ Body: ExchangeHelper.ExchangeConfigCreation }>,
		reply: FastifyReply
	) => {
		const {
			name,
			currency_code,
			inbound_ratio_them,
			inbound_ratio_us,
			outbound_ratio_them,
			outbound_ratio_us,
			is_active,
			minimum_amount,
			partner_id,
		} = request.body;

		try {
			await Promise.all([
				ExchangeHelper.isNameValid(reply, name),
				ExchangeHelper.isCurrencyCodeValid(reply, currency_code),
				ExchangeHelper.isPartnerExist(reply, partner_id),
			]);
		} catch (e) {
			return e;
		}
		try {
			const result = await exchangeRepository.createExchangeConfiguration({
				name: name.trim(),
				currency_code: currency_code.trim(),
				inbound_ratio_them: inbound_ratio_them,
				inbound_ratio_us: inbound_ratio_us,
				outbound_ratio_us: outbound_ratio_us,
				outbound_ratio_them: outbound_ratio_them,
				is_active: is_active,
				minimum_amount: minimum_amount,
				partner_id: partner_id,
			});
			return reply.code(StatusCode.OK_200).send(result);
		} catch (e: any) {
			if (
				e['code'] === 'P2002' &&
				e['name'] === 'PrismaClientKnownRequestError' &&
				JSON.stringify(e['meta']) ===
					JSON.stringify({
						modelName: 'exchanges',
						target: ['name', 'currency_code'],
					})
			) {
				return CustomError.exchangeConfig(
					reply,
					'Currency Name and Currency Code, them combined may already exist'
				);
			}
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'Something wrong when creating configuration > ' + e,
			});
		}
	};

	export const getExchanges = async (
		request: FastifyRequest,
		reply: FastifyReply
	) => {
		const exchanges = await exchangeRepository.getExchangeConfigurations();
		const transformed =
			ExchangeHelper.transformExchangeWithPartnerData(exchanges);
		return reply.code(StatusCode.OK_200).send({ data: transformed });
	};

	export const updateExchange = async (
		request: FastifyRequest<{
			Body: ExchangeHelper.ExchangeConfigCreation;
			Params: ExchangeHelper.UpdateExchangeParams;
		}>,
		reply: FastifyReply
	) => {
		const { id } = request.params;
		const {
			name,
			currency_code,
			inbound_ratio_them,
			inbound_ratio_us,
			outbound_ratio_them,
			outbound_ratio_us,
			is_active,
			minimum_amount,
			partner_id,
		} = request.body;

		const dataToUpdate = {
			name: name,
			currency_code: currency_code,
			inbound_ratio_them: inbound_ratio_them,
			inbound_ratio_us: inbound_ratio_us,
			outbound_ratio_us: outbound_ratio_us,
			outbound_ratio_them: outbound_ratio_them,
			is_active: is_active,
			minimum_amount: minimum_amount,
			partner_id: partner_id,
		};
		try {
			await Promise.all([
				ExchangeHelper.isNameValid(reply, name),
				ExchangeHelper.isCurrencyCodeValid(reply, currency_code),
				ExchangeHelper.isPartnerExist(reply, partner_id),
				exchangeRepository.findById(id),
			]);
		} catch (e: any) {
			if (e['code'] === 'P2025' && e['name'] === 'NotFoundError') {
				//{"statusCode":500,"code":"P2025","error":"Internal Server Error","message":"No exchanges found"}
				return CustomError.exchangeNotFound(reply);
			}
			return e;
		}
		try {
			await Promise.all([exchangeRepository.updateExchange(dataToUpdate, id)]);
			return reply.code(StatusCode.OK_200).send({ msg: 'Update successful' });
		} catch (e: any) {
			if (
				e['code'] === 'P2002' &&
				e['name'] === 'PrismaClientKnownRequestError' &&
				JSON.stringify(e['meta']) ===
					JSON.stringify({
						modelName: 'exchanges',
						target: ['name', 'currency_code'],
					})
			) {
				return CustomError.exchangeConfig(
					reply,
					'Currency Name and Currency Code, them combined may already exist'
				);
			}
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'Something wrong when creating configuration > ' + e,
			});
		}
	};
}
