import fetch from 'node-fetch';
export interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}
export class JPHManager {
	baseURL: string = 'https://jsonplaceholder.typicode.com';
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
}
