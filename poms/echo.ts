import { type APIRequestContext } from '@playwright/test';
import { IncomingHttpHeaders } from 'http';

interface Payload {
	[key: string]: any;
}

export interface Headers {
	[key: string]: string;
}

export class PostmanEchoService {
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
