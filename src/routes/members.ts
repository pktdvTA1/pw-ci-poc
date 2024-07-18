import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { memberSchema } from '~src/schema/members';
// import type { EcoSystem } from '~src/enums/group';
import { StatusCode } from '~src/enums/statuCode';
import { ExtMemberHelper } from '~src/features/extMember';
import { MemberManager } from '~src/repositories/members';
import { EcoSystem } from '~src/enums/group';

export namespace memberRoute {
	// create member different source, not via current app itself so we need source to handle error
	const memberRepository = new MemberManager();

	export const members = async (app: FastifyInstance) => {
		app.post(
			'/api/member',
			{
				schema: memberSchema.createMember,
			},
			async (
				request: FastifyRequest<{
					Body: ExtMemberHelper.GetExtMember;
				}>,
				reply: FastifyReply
			) => {
				console.log('request.body', request.body);
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
					if (
						email &&
						criteria.accepted_source.includes(EcoSystem.Source.EMAIL)
					) {
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
					if (!member.nationality.includes(member.nationality)) {
						return reply.code(StatusCode.OK_200).send({
							result: 'FAIL',
							msg: 'Nationality criteria is not met',
						});
					}
					const register = await memberRepository.insertIntoRegisterMember(
						member
					);
					return reply.code(StatusCode.OK_200).send(register);
				} catch (e) {
					return reply.code(StatusCode.BAD_REQUEST).send({ msg: e });
				}
			}
		);
	};
}
// app.post('/api/member', {
//             schema: memberSchema.createMember,
