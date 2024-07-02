import { test as base } from '@playwright/test';
import { PostmanEchoManager } from '../poms/echo';
import { JWTManager } from '../poms/auth';

type PMFixture = {
	withAuth: PostmanEchoManager;
	withInvalidAuth: PostmanEchoManager;
};

export const test = base.extend<PMFixture>({
	withAuth: async ({ request }, use) => {
		const jwt = new JWTManager({
			firstName: 'fixtureFirstName',
			lastName: 'fixtureLastName',
			email: 'firstName.lastName.fixure@email.com',
			isActive: true,
		});
		const pm = new PostmanEchoManager(request);
		Object.assign(pm.headers, { Authorization: `Bearer ${jwt.token}` });
		await use(pm);
	},
});
