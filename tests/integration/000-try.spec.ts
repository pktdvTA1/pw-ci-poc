import { test } from '@playwright/test';

class Rand {
	num: string;
	constructor() {
		this.num = this.randomString();
	}
	randomString() {
		const r = (Math.random() + 1).toString(36).substring(7);
		this.num = r;
		return r;
	}
}
let r: Rand;
r = new Rand();
console.log('n0', r.num);
test.describe.configure({ mode: 'parallel' });
test.describe('random', () => {
	test.beforeAll(() => {});
	test('t1', () => {
		console.log('n1', r.num);
	});
	test('t2', () => {
		console.log('n1', r.num);
	});
	test('t3', () => {
		console.log('n1', r.num);
	});
	test('t4', () => {
		console.log('n1', r.num);
	});
	test('t5', () => {
		console.log('n1', r.num);
	});
	test('t6', () => {
		console.log('n1', r.num);
	});
});
