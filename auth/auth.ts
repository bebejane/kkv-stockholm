import { betterAuth, User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sendEmailVerificationEmail, sendResetPasswordEmail } from '@/lib/controllers/email';
import { db, schema } from '../db';
import { admin } from 'better-auth/plugins';
//import { apiKey } from 'better-auth/plugins';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
	}),
	plugins: [
		admin({
			bannedUserMessage:
				'Du har blivit inaktiverad i systemet. Kontakta oss för att få tillgång till kontot.',
		}),
		//apiKey({}),
	],
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		afterEmailVerification: async (user, request) => {
			console.log(
				'better auth: afterEmailVerification',
				user.email,
				user.emailVerified,
				request?.url
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
			await sendResetPasswordEmail({
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
