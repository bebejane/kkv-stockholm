import 'dotenv/config';
import { auth } from '@/auth/auth';

/**
 * Ensures the default admin account used for server-side admin API calls
 * (`auth/auth-admin.ts`) exists, is verified, has role `admin`, and that its
 * password matches `BETTER_AUTH_DEFAULT_ADMIN_PASSWORD`.
 *
 * The env vars are the source of truth for this account, so this re-syncs the
 * password/role/verification on every run. Runs on `prebuild`, so a build needs
 * a live DB and the `BETTER_AUTH_DEFAULT_ADMIN_*` env vars.
 */
async function init() {
	const email = process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL;
	const password = process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD;

	if (!email || !password) {
		console.log(
			'[better-auth]: BETTER_AUTH_DEFAULT_ADMIN_EMAIL/PASSWORD not set — skipping admin setup',
		);
		return;
	}

	const name = process.env.BETTER_AUTH_DEFAULT_ADMIN_NAME ?? email;

	const ctx = await auth.$context;
	let user = (await ctx.internalAdapter.findUserByEmail(email))?.user ?? null;

	if (!user) {
		try {
			const created = await auth.api.signUpEmail({ body: { name, email, password } });
			user = created.user;
			console.log('[better-auth]: default admin created', email);
		} catch (e) {
			console.log('[better-auth]: could not create default admin');
			console.log(e);
			return;
		}
	}

	try {
		const hashed = await ctx.password.hash(password);
		await ctx.internalAdapter.updatePassword(user.id, hashed);
		await ctx.internalAdapter.updateUser(user.id, { role: 'admin', emailVerified: true });
	} catch (e) {
		console.log('[better-auth]: could not update default admin');
		console.log(e);
		return;
	}

	// Confirm the configured credentials actually sign in.
	try {
		const { response } = await auth.api.signInEmail({
			returnHeaders: true,
			body: { email, password },
		});
		console.log('[better-auth]: default admin ready', response.user.email);
	} catch (e) {
		console.log('[better-auth]: default admin sign-in failed');
		console.log(e);
	}
}

init();
