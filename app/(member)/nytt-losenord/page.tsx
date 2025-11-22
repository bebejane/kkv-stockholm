import { buildMetadata } from '@/app/layout';
import { UserResetPasswordForm } from '@/components/forms/UserResetPasswordForm';
import { Metadata } from 'next';

export default async function NewPasswordPage({ searchParams }: PageProps<'/nytt-losenord'>) {
	const params = await searchParams;
	const token = typeof params.token === 'string' ? params.token : Array.isArray(params.token) ? params.token[0] : null;

	if (!token) throw new Error('Ogiltig request');

	return (
		<>
			<article>
				<h1>Nytt lösenord</h1>
				<section className='intro'>Skapa ditt nya lösenord.</section>
				<UserResetPasswordForm token={token} />
			</article>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Nytt lösenord',
		pathname: '/nytt-losenord',
	});
}
