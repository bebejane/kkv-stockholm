import { buildMetadata } from '@/app/(website)/layout';
import { UserRequestResetPasswordForm } from '@/components/forms/UserRequestResetPasswordForm';
import { Metadata } from 'next';

export default async function RequestNewPasswordPage() {
	return (
		<>
			<article>
				<h1>Återställ ditt lösenord</h1>
				<section className='intro'>För att återställa ditt lösenord, skriv in din e-postadress.</section>
				<UserRequestResetPasswordForm />
			</article>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Återställ ditt lösenord',
		pathname: '/aterstall-losenord',
	});
}
