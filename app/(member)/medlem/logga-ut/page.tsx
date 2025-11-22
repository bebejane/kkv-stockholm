import { buildMetadata } from '@/app/layout';
import { UserSignOutForm } from '@/components/forms/UserSignOutForm';
import { Metadata } from 'next';

export default async function SignOutPage() {
	return (
		<article>
			<UserSignOutForm />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/logga-ut'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Logga ut`,
		pathname: `/medlem/logga-ut`,
	});
}
