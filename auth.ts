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
			user: 'BmmC_204Q2q80pakRIUNhA',
			account: 'CANE8qJyT8OmtkreQWhLng',
			session: 'ddvS6N7lSsao3H2Rw9FJwQ',
			verification: 'VDNPpHABRT6-EHrYrfQeQQ',
		},
		debugLogs: true,
	}),
});
