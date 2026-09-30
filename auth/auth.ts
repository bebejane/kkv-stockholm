import { betterAuth, User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import {
	sendCreateYourAccountEmail,
	sendEmailVerificationEmail,
	sendResetPasswordEmail,
} from '@/lib/controllers/email';
import { db, schema } from '../db';
import { admin } from 'better-auth/plugins';

/**
 * better-auth's reset callback bounces with `?error=INVALID_TOKEN` when the
 * `callbackURL` query param is missing or empty, so make sure it's always set.
 */
function withResetCallback(url: string): string {
	try {
		const parsed = new URL(url);
		if (!parsed.searchParams.get('callbackURL')) {
			parsed.searchParams.set(
				'callbackURL',
				`${process.env.NEXT_PUBLIC_SITE_URL}/nytt-losenord`,
			);
		}
		return parsed.href;
	} catch {
		return url;
	}
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
	}),
	// Needed for absolute URLs in emails when the API is called server-side
	// (e.g. the account invite from the member-status webhook, with no request).
	baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
	logger: {
		level: 'debug',
		disabled: false,
	},
	trustedOrigins: [
		process.env.NEXT_PUBLIC_SITE_URL!,
		process.env.NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL!,
	],
	advanced: {
		defaultCookieAttributes: {
			sameSite: 'none',
			secure: true,
		},
	},
	plugins: [
		admin({
			bannedUserMessage:
				'Du har blivit inaktiverad i systemet. Kontakta oss för att få tillgång till kontot.',
		}),
	],
	user: {
		additionalFields: {
			role: {
				type: 'string',
				input: false,
			},
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		afterEmailVerification: async (user, request) => {
			console.log(
				'better auth: afterEmailVerification',
				user.email,
				user.emailVerified,
				request?.url,
			);
		},
		sendVerificationEmail: async ({
			user,
			url,
			token,
		}: {
			user: User;
			url: string;
			token: string;
		}) => {
			console.log('better auth (global): send verification email', user.email);
			await sendEmailVerificationEmail({
				to: user.email,
				url,
				token,
			});
			console.log('better auth: send verification email', user.email, 'done');
		},
		onEmailVerification: async ({ email }: { email: string }) => {
			console.log(`Email for user ${email} has been verified.`);
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		maxPasswordLength: 20,
		minPasswordLength: 6,
		emailVerification: {
			enabled: true,
		},
		sendResetPassword: async ({ user, url, token }) => {
			const link = withResetCallback(url);
			// The first-time invite sets `redirectTo=/skapa-konto`, so send the
			// "create your account" copy instead of the reset copy.
			if (decodeURIComponent(link).includes('/skapa-konto')) {
				await sendCreateYourAccountEmail({ name: user.name, email: user.email, url: link });
			} else {
				await sendResetPasswordEmail({
					to: user.email,
					url: link,
					token,
				});
			}
		},
		onPasswordReset: async ({ user }, request) => {
			console.log(`Password for user ${user.email} has been reset.`);
		},
	},
});
