import { buildMetadata } from '@/app/(website)/layout';
import { UserCreateForm } from '@/components/forms/UserCreateForm';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function UserCreatePage({ searchParams }: PageProps<'/skapa-konto'>) {
	const params = await searchParams;
	const token =
		typeof params.token === 'string'
			? params.token
			: Array.isArray(params.token)
				? params.token[0]
				: null;

	if (!token) throw new Error('Ogiltig request: token saknas');

	return (
		<article>
			<h1>Skapa konto</h1>
			<section className='intro'>
				Välj ett lösenord för ditt konto. När kontot är skapat kan du logga in.
			</section>
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
