import fetch from 'node-fetch';
export interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

export interface PostBody {
	id?: number;
	userId: number;
	title: string | boolean | undefined;
	body: string | boolean | undefined;
}
export class JPHManager {
	readonly baseURL: string = 'https://jsonplaceholder.typicode.com';
	constructor() {}

	async getAllPosts(): Promise<Post[]> {
		try {
			const body = await fetch(`${this.baseURL}/posts`);
			return (await body.json()) as Post[];
		} catch (e) {
			throw new Error(`Unable to fetch posts, ${e}`);
		}
	}

	async getPostByPostId(postID: number): Promise<Post> {
		try {
			const body = await fetch(`${this.baseURL}/posts/${postID}`);
			return (await body.json()) as Post;
		} catch (e) {
			throw new Error(`Unable to fetch posts, ${e}`);
		}
	}
	async createNewPostWithUserId(body: PostBody): Promise<PostBody> {
		try {
			const post = await fetch(`${this.baseURL}/posts`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify(body),
			});
			return post.json();
		} catch (e) {
			throw new Error(`Unabel to create new post due to > ${e}`);
		}
	}
}
