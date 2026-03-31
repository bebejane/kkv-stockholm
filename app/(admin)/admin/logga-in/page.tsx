import s from './page.module.scss';
import { AdminLoginForm } from './AdminLoginForm';
import { buildMetadata } from '@/app/(website)/layout';
import { Metadata } from 'next';

export default async function SignInAdminPage() {
	return (
		<>
			<article className={s.login}>
				<h1>Logga in</h1>
				<section className='intro'>Här kan du som är administrator logga in</section>
				<AdminLoginForm />
			</article>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Logga in - Admin',
		pathname: '/admin/logga-in',
	});
}
