import { buildMetadata } from '@/app/layout';
import { SignOutForm } from '@/components/forms';
import { Metadata } from 'next';

export default async function SignOut() {
	return (
		<article>
			<SignOutForm />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/logga-ut'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Logga ut`,
		pathname: `/medlem/logga-ut`,
	});
}
