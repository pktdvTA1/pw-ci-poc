import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserManagement } from '~src/repositories/users';
import { JPHManager, Post } from '~src/features/jsonPlaceholder';
import { StatusCode } from '~src/enums/statuCode';
import { JPHSchema } from '~src/schema/jsonPlaceHolder';

type FastifyGetById = FastifyRequest<{ Params: { id: number } }>;

export namespace jsonPlaceholderRoute {
	const user = new UserManagement();
	const JPH = new JPHManager();
	// get post of active users in various style (for now )
	// to do add filter
	export const jsonPlaceHolder = async (app: FastifyInstance) => {
		// get all posts
		// while those post should be of active user
		app.get('/api/jph/posts', async (request, reply: FastifyReply) => {
			let users;
			let posts: Post[];
			try {
				[users, posts] = await Promise.all([
					user.getUserLists(true),
					JPH.getAllPosts(),
				]);
			} catch (e) {
				throw new Error(`Unable to either get user list or posts due to ${e}`);
			}
			const userid = users.map((v) => {
				return v.id;
			});
			const list = posts.filter((v) => userid.includes(v.userId));
			return reply.code(StatusCode.OK_200).send(list);
		});
		// get post by userid may return many posts
		app.get(
			'/api/jph/user-posts/:id',
			{ schema: JPHSchema.getByIndex },
			async (request: FastifyGetById, reply: FastifyReply) => {
				const { id } = request.params;
				let usr;
				let posts: Post[];
				[usr, posts] = await Promise.all([
					user.getUserById(id),
					JPH.getAllPosts(),
				]);
				if (!usr) {
					return reply
						.code(StatusCode.NOT_FOUND_404)
						.send({ msg: 'User Not Found' });
				}
				const usrPost = posts.filter((v) => (v.userId = usr.id));
				return reply.code(StatusCode.OK_200).send(usrPost);
			}
		);
		// get specific post by postid
		// only if post's user is active
		app.get(
			'/api/jph/post/:id',
			{ schema: JPHSchema.getByIndex },
			async (request: FastifyGetById, reply: FastifyReply) => {
				const { id } = request.params;
				let users;
				let pst: Post;

				[users, pst] = await Promise.all([
					user.getUserLists(true),
					JPH.getPostByPostId(id),
				]);
				const userid = users.map((v) => v.id);
				if (!userid.includes(pst.userId) || Object.keys(pst).length === 0) {
					return reply.code(StatusCode.NOT_FOUND_404).send({
						msg: 'Post Not Found',
					});
				}
				return reply.code(StatusCode.OK_200).send(pst);
			}
		);
	};
}
