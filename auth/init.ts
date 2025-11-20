import 'dotenv/config';
import { auth } from '@/auth/auth';

(async function init() {
	const email = process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL as string;
	const password = process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD as string;
	const name = process.env.BETTER_AUTH_DEFAULT_ADMIN_NAME || 'Administrator';

	try {
		console.log('[better-auth]: setup admin user');

		await auth.api
			.signInEmail({
				body: {
					email,
					password,
				},
			})
			.then((admin) => {
				console.log('[better-auth]: admin user exist', admin.user.email);
			})
			.catch(async () => {
				await auth.api
					.signUpEmail({
						body: {
							name,
							email,
							password,
						},
					})
					.then((admin) => {
						console.log('[better-auth]: admin user created');
					});
			});
	} catch (error) {
		console.error(error);
	}
})();
