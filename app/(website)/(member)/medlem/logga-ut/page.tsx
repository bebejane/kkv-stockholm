import { UserSignOutForm } from '@/components/forms/UserSignOutForm';
import { Metadata } from 'next';

export default async function SignOutPage() {
	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<UserSignOutForm />
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Loggar ut',
};
