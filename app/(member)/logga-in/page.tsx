import { buildMetadata } from '@/app/layout';
import { UserSignInForm } from '@/components/forms/UserSignInForm';
import { Metadata } from 'next';
import Link from 'next/link';

export default async function SignInPage() {
	return (
		<>
			<article>
				<h1>Logga in</h1>
				<section className='intro'>Här kan du som är medlem logga in och boka verkstäder och rapportera tid.</section>
				<UserSignInForm className="margin-bottom" />
				<p className='small'>
					<br></br>
					Har du glömt ditt lösenord? <Link href='/aterstall-losenord'>Återställ här</Link>.
				</p>
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
