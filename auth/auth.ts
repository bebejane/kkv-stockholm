import { betterAuth, User } from 'better-auth';
import { datoCmsAdapter } from '@/auth/adapter/DatoCmsBetterAuthAdapter';
import { sendEmailVerificationEmail, sendPasswordResetEmail } from '@/lib/postmark';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
	database: datoCmsAdapter({
		client: {
			apiToken: process.env.DATOCMS_API_TOKEN,
		},
		itemTypeId: {
			user: process.env.BETTER_AUTH_DATOCMS_USER_TYPE_ID as string,
			account: process.env.BETTER_AUTH_DATOCMS_ACCOUNT_TYPE_ID as string,
			session: process.env.BETTER_AUTH_DATOCMS_SESSION_TYPE_ID as string,
			verification: process.env.BETTER_AUTH_DATOCMS_SESSION_TYPE_ID as string,
		},
		debugLogs: true,
	}),
	plugins: [
		admin({
			bannedUserMessage: 'Du har blivit inaktiverad i systemet. Kontakta oss för att få tillgång till kontot.',
		}),
	],
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		afterEmailVerification: async (user, request) => {
			console.log('better auth: afterEmailVerification', user.email, user.emailVerified, request?.url);
		},
		sendVerificationEmail: async ({ user, url, token }: { user: User; url: string; token: string }) => {
			console.log('better auth (global): send verification email', user.email);
			await sendEmailVerificationEmail({
				to: user.email,
				url,
				token,
			});
			console.log('better auth: send verification email', user.email, 'done');
		},
		onEmailVerification: async ({ email }, request) => {
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
		sendResetPassword: async ({ user, url, token }, request) => {
			await sendPasswordResetEmail({
				to: user.email,
				url,
				token,
			});
		},
		onPasswordReset: async ({ user }, request) => {
			console.log(`Password for user ${user.email} has been reset.`);
		},
	},
});
