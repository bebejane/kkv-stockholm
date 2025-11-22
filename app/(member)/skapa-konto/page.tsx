import { buildMetadata } from '@/app/layout';
import { UserCreateForm } from '@/components/forms/UserCreateForm';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function UserCreatePage({ searchParams }: PageProps<'/skapa-konto'>) {
	const params = await searchParams;
	const token = typeof params.token === 'string' ? params.token : Array.isArray(params.token) ? params.token[0] : null;

	if (!token) throw new Error('Ogiltig request');

	return (
		<article>
			<UserCreateForm token={token} />
		</article>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Skapa konto',
		pathname: '/skapa-konto',
	});
}
