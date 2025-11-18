import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// export const withAuth = async <P extends PageProps<any>>(
// 	Page: any,
// 	options?: {
// 		redirectTo?: string;
// 	}
// ) : Promise<PageProps<any> & {session}> => {
// 	return async (props: P) => {
// 		const session = await auth.api.getSession({ headers: await headers() });
// 		if (!session) {
// 			if (options?.redirectTo) {
// 				redirect(options.redirectTo);
// 			}
// 			return null;
// 		}
// 		return <Page {...props} />;
// 	};
// };

export async function getSession(options?: { redirectTo?: string }) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect(options?.redirectTo ?? '/logga-in');
	return session;
}
