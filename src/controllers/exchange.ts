import { FastifyReply, FastifyRequest } from 'fastify';
import { ExchangeHelper } from '~src/features/exchanges';
import { ExchangeRepository } from '~src/repositories/exchanges';
import { PartnerRepository } from '~src/repositories/partners';
import { StatusCode } from '~src/enums/statuCode';
import { VerifyRegex } from '~src/utils/regex';
import { CustomError } from '~src/utils/customError';

export namespace ExchangeController {
	const exchangeRepository = new ExchangeRepository();
	const partnerRepository = new PartnerRepository();

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

		// validate the name
		if (!VerifyRegex.verifyLetterNumberSpace(name)) {
			return CustomError.exchangeConfig(reply, 'Currency Name');
		}
		// validate the currency code
		if (
			!VerifyRegex.verifyLetterNumberSpace(currency_code) ||
			currency_code.length != 3
		) {
			return CustomError.exchangeConfig(reply, 'Currency Code');
		}
		// validate the name and code if it's already exist
		const existingExchanges =
			await exchangeRepository.getExchangeConfigurations();
		const existingNameAndCode = existingExchanges.map(
			(v) => v.name.trim() + v.currency_code.trim()
		);
		if (existingNameAndCode.includes(name.trim() + currency_code.trim())) {
			return CustomError.exchangeConfig(
				reply,
				'Currency Name and Currency Code, them combined may already exist'
			);
		}

		// find if id exist
		const partnerids = (await partnerRepository.getPartner()).map((v) => v.id);
		if (partner_id && !partnerids.includes(partner_id)) {
			return CustomError.partnerNotFound(reply);
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
		} catch (e) {
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'Something wrong when creating configuration > ' + e,
			});
		}
	};
}
