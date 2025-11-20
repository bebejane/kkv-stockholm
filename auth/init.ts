import 'dotenv/config';
import { auth } from '@/auth/auth';
import { User } from 'better-auth';

async function getAdmin(): Promise<{ user: User; headers: Headers }> {
	const {
		headers,
		response: { user },
	} = await auth.api.signInEmail({
		returnHeaders: true,
		body: {
			email: process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL as string,
			password: process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD as string,
		},
	});
	console.log(user);

	return { user, headers };
}

async function createAdmin() {
	const { user } = await auth.api.signUpEmail({
		body: {
			name: process.env.BETTER_AUTH_DEFAULT_ADMIN_NAME as string,
			email: process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL as string,
			password: process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD as string,
		},
	});
	return user;
}

// async function apiKeyExists(userId: string, headers: Headers): Promise<boolean> {
// 	const apiKeys = await auth.api.listApiKeys({ headers });
// 	return apiKeys.find((apiKey) => apiKey.userId === userId) ? true : false;
// }

// async function createApiKey(headers: Headers, userId: string) {
// 	return await auth.api.createApiKey({
// 		headers,
// 		body: {
// 			userId,
// 			name: 'Admin API Key',
// 			prefix: 'admin',
// 			rateLimitEnabled: true,
// 			rateLimitTimeWindow: 60,
// 			rateLimitMax: 10,
// 			expiresIn: 60 * 60 * 24 * 365 * 10,
// 		},
// 	});
//}

(async function init() {
	console.log('[better-auth]: setup admin user');

	let admin: User | null = null;
	let headers: Headers | null = null;

	try {
		try {
			const { user, headers: _headers } = await getAdmin();
			if (!user.emailVerified) return console.log('[better-auth]: admin user not verified yet');
			admin = user;
			headers = _headers;
			//if (await apiKeyExists(user.id, headers)) return console.log('[better-auth]: admin user already has api key');
		} catch (e) {
			console.log(e);
			console.log('[better-auth]: admin user does not exist');
			admin = await createAdmin();
			console.log('[better-auth]: admin user created', admin.email);
		}

		if (!admin || !headers) throw new Error('admin user not found');
		console.log('[better-auth]: admin user exists', admin.email);

		// try {
		// 	console.log('[better-auth]: create api key');
		// 	const key = await createApiKey(headers, admin.id);
		// 	console.log('[better-auth]: admin user created with api key', admin.email, key.key);
		// 	return;
		// } catch (e) {
		// 	console.log('[better-auth]: error creating api key');
		// 	console.log(e);
		// }
	} catch (e) {
		console.log('[better-auth]: error creating admin');
		console.log(e);
	}
})();
