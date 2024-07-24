import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EcoSystem } from '~src/enums/group';
import { StatusCode } from '~src/enums/statuCode';
import { ExtMemberHelper } from '~src/features/extMember';
import { MemberHelper } from '~src/features/member';
import { MemberManager } from '~src/repositories/members';
import { getYear } from 'date-fns';

export namespace MemberController {
	const memberRepository = new MemberManager();
	export const createMember = async (
		request: FastifyRequest<{
			Body: ExtMemberHelper.GetExtMember;
		}>,
		reply: FastifyReply
	) => {
		const { email, phoneNumber, external_id, origin } = request.body;
		if (email === null && phoneNumber === null) {
			return reply.code(StatusCode.BAD_REQUEST).send({
				msg: 'Email or Phone are required',
			});
		}
		const criteria = ExtMemberHelper.getCriteria(origin);
		if (!criteria) {
			return reply.code(StatusCode.BAD_REQUEST).send({
				msg: `Origin of '${origin}' is not support`,
			});
		}
		let member: ExtMemberHelper.ExtMember | null = null;
		try {
			if (email && criteria.accepted_source.includes(EcoSystem.Source.EMAIL)) {
				member = await memberRepository.getExtMember({
					email: email,
					origin: origin,
				});
			} else if (
				phoneNumber &&
				criteria.accepted_source.includes(EcoSystem.Source.PHONE)
			) {
				member = await memberRepository.getExtMember({
					phoneNumber: phoneNumber,
					origin: origin,
				});
			} else if (
				external_id &&
				criteria.accepted_source.includes(EcoSystem.Source.EXTERNAL)
			) {
				member = await memberRepository.getExtMember({
					external_id: external_id,
					origin: origin,
				});
			}
			if (!member) {
				return reply.code(StatusCode.NOT_FOUND_404).send({
					msg: 'Origin and Source is not matched. Email or Phone Or External ID you provided may not met the aceeptance sources',
				});
			}
			if (member.age < criteria.age) {
				return reply.code(StatusCode.OK_200).send({
					result: 'FAIL',
					msg: 'Age criteria is not met',
				});
			}
			if (
				!criteria.nationality.includes(
					member.nationality as EcoSystem.Nationality
				)
			) {
				return reply.code(StatusCode.OK_200).send({
					result: 'FAIL',
					msg: 'Nationality criteria is not met',
				});
			}
			const register = await memberRepository.insertIntoRegisterMember(member);

			return reply.code(StatusCode.OK_200).send(register);
		} catch (e) {
			if (
				e instanceof PrismaClientKnownRequestError &&
				e.name === 'NotFoundError'
			) {
				return reply
					.code(StatusCode.NOT_FOUND_404)
					.send({ msg: 'External Member Not Found' });
			} else {
				return reply.code(StatusCode.BAD_REQUEST).send({ msg: e });
			}
		}
	};

	export const updateMember = async (
		request: FastifyRequest<{
			Params: { id: string };
			Body: MemberHelper.UpdateMember;
		}>,
		reply: FastifyReply
	) => {
		const { id } = request.params;
		const {
			firstName,
			lastName,
			nationality,
			age,
			phoneNumber,
			passportNumber,
			passportExpiryDate,
		} = request.body;

		let member;
		try {
			member = await memberRepository.getMemberById(parseInt(id));
		} catch (e) {
			return reply
				.code(StatusCode.NOT_FOUND_404)
				.send({ result: 'FAIL', msg: 'Registered Member is not found.' });
		}
		// validation part

		if (
			(firstName && !ExtMemberHelper.validateFNandLN(firstName)) ||
			(lastName && !ExtMemberHelper.validateFNandLN(lastName))
		) {
			console.log('here in validation of fn/ln');
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'FirstName or Lastname format is invalid',
			});
		}
		if (
			(firstName && firstName?.trim().split('').length > 50) ||
			(lastName && lastName?.trim().split('').length > 50)
		) {
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'FirstName or Lastname is longer than 50',
			});
		}
		if (
			nationality &&
			!Object.values(EcoSystem.Nationality).includes(
				nationality as EcoSystem.Nationality
			)
		) {
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'Nationality is not support',
			});
		}
		if (age && age <= 5) {
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'Age cant be lower than 5',
			});
		}
		if (phoneNumber && phoneNumber === member.phoneNumber) {
			return reply.code(StatusCode.BAD_REQUEST).send({
				result: 'FAIL',
				msg: 'PhoneNumber should not be the same',
			});
		}
		if (passportNumber || passportExpiryDate) {
			if (!member.passport_number || !member.passport_expiry_date) {
				return reply.code(StatusCode.BAD_REQUEST).send({
					result: 'FAIL',
					msg: 'No Passport number or Expiry found, Please register passport first.',
				});
			}
			const ppExpiry = getYear(passportExpiryDate as Date);
			const currentYear = getYear(new Date());
			if (ppExpiry <= currentYear) {
				return reply.code(StatusCode.BAD_REQUEST).send({
					result: 'FAIL',
					msg: 'Passport Expiry cant be lower or equal to current year.',
				});
			}
		}
		try {
			const updateResult = await memberRepository.updateMember(
				member.id,
				request.body
			);
			return reply.code(StatusCode.OK_200).send(updateResult);
		} catch (e) {
			return reply
				.code(StatusCode.BAD_REQUEST)
				.send({ result: 'FAIL', msg: e });
		}
	};
}
