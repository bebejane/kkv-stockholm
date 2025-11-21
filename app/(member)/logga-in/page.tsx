import { buildMetadata } from '@/app/layout';
import { UserSignInForm } from '@/components/forms/UserSignInForm';
import { Metadata } from 'next';

export default async function SignIn() {
	return (
		<>
			<article>
				<h1>Logga in</h1>
				<section className='intro'>Här kan du som är medlem logga in och boka verkstäder och rapportera tid.</section>

				<UserSignInForm />
				<br />
				<p className='small'>Har du glömt ditt lösenord? Återställ här.</p>
			</article>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Logga in',
		pathname: '/logga-in',
	});
}
