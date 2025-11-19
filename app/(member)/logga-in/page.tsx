import { buildMetadata } from '@/app/layout';
import { SignInForm } from '@/components/forms';
import { Metadata } from 'next';

export default async function SignIn() {
	return (
		<article>
			<SignInForm />
		</article>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Logga in',
		pathname: '/logga-in',
	});
}
