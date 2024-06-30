import { type APIRequestContext } from '@playwright/test';
// import { JWTManager } from '~poms/auth';

interface Payload {
	[key: string]: any;
}

export interface Headers {
	[key: string]: string;
}

export class PostmanEchoManager {
	readonly request: APIRequestContext;
	public headers: Headers;
	public payload: Payload;
	public params: Payload;
	public readonly getEndpoint: string;
	public readonly postEndPoint: string;

	constructor(request: APIRequestContext) {
		this.request = request;
		this.headers = {
			'Content-type': 'application/json',
		};
		this.getEndpoint = '/get';
		this.postEndPoint = '/posts';
		this.params = {
			foo: 'bar',
			far: 'boo',
		};
		this.payload = {
			bodyfoo: 'bodybar',
			bodyfar: 'bodyboo',
		};
	}
}
