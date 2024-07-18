import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { memberSchema } from '~src/schema/members';
// import type { EcoSystem } from '~src/enums/group';
import { StatusCode } from '~src/enums/statuCode';
import { MemberHelper } from '~src/features/member';
import { MemberManager } from '~src/repositories/members';

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
					Body: MemberHelper.GetMember;
				}>,
				reply: FastifyReply
			) => {
				console.log('request.body', request.body);
				const { email, phoneNumber, source } = request.body;
				if (email === null && phoneNumber === null) {
					return reply.code(StatusCode.BAD_REQUEST).send({
						msg: 'Email or Phone are required',
					});
				}
				const member = await memberRepository.getMember({
					email: email,
					phoneNumber: phoneNumber,
					source: source,
				});
				return reply.code(StatusCode.OK_200).send(member);
			}
		);
	};
}
// app.post('/api/member', {
//             schema: memberSchema.createMember,
