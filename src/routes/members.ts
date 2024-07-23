import { FastifyInstance } from 'fastify';
import { memberSchema } from '~src/schema/members';

import { MemberController } from '~src/controllers/members';
export namespace memberRoute {
	// create member different source, not via current app itself so we need source to handle error

	export const members = async (app: FastifyInstance) => {
		app.post(
			'/api/member',
			{
				schema: memberSchema.createMember,
			},
			MemberController.createMember
		);
		app.patch(
			'/api/member/:id',
			{
				schema: {
					params: memberSchema.UpdateMemberById.params,
					body: memberSchema.UpdateMemberById.body,
				},
			},
			MemberController.updateMember
		);
	};
}
