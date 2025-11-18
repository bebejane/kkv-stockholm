import { betterAuth } from 'better-auth';
import { datoCmsAdapter } from '@/lib/auth/adapter/DatoCmsBetterAuthAdapter';

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
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
		//debugLogs: false,
	}),
});
