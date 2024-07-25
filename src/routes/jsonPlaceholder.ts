import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserRepository } from '~src/repositories/users';
import { JPHManager, Post } from '~src/features/jsonPlaceholder';
import { StatusCode } from '~src/enums/statuCode';
import { JPHSchema } from '~src/schema/jsonPlaceHolder';

type FastifyGetById = FastifyRequest<{ Params: { id: number } }>;
type FastifyCreatePost = FastifyRequest<{
	Params: { id: number };
	Body: {
		title: string;
		body: string;
	};
}>;
export namespace jsonPlaceholderRoute {
	const user = new UserRepository();
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
					user.getUsers(true),
					JPH.getAllPosts(),
				]);
			} catch (e) {
				throw new Error(`Unable to either get user list or posts due to ${e}`);
			}
			const userid = users
				.filter((v) => !v.is_deleted)
				.map((v) => {
					return v.id;
				});
			const list = posts.filter((v) => userid.includes(v.userId));
			return reply.code(StatusCode.OK_200).send(list);
		});
		// get post by userid may return many posts
		app.get(
			'/api/jph/user-posts/:id',
			{
				schema: JPHSchema.getByIndex,
			},
			async (request: FastifyGetById, reply: FastifyReply) => {
				const { id } = request.params;
				console.log('typeof id', typeof id);
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
					user.getUsers(true),
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
		// create new post
		app.post(
			'/api/jph/post/:id',
			{ schema: JPHSchema.createNewPost },
			async (request: FastifyCreatePost, reply: FastifyReply) => {
				const { id } = request.params;
				const { title, body } = request.body;
				const usr = await user.getUserById(id);

				if (!usr || !usr.is_active) {
					return reply
						.code(StatusCode.NOT_FOUND_404)
						.send({ msg: 'User Not Found' });
				}
				const post = await JPH.createNewPostWithUserId({
					userId: usr.id,
					title: title,
					body: body,
				});
				// some random logic
				const refId = ((Math.random() + 1).toString(36).substring(7) +
					Math.floor(new Date().getTime() / 1000).toString()) as string;
				const transformData = {
					refId: refId,
					detail: `User Id of ${post.userId} has created new post with ${post.title} and ${post.body}.`,
				};
				return reply.code(StatusCode.OK_200).send(transformData);
			}
		);
	};
}
