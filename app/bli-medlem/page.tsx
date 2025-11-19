import { buildMetadata } from '@/app/layout';
import { SignUpForm } from '@/components/forms';
import { Metadata } from 'next';

export default async function SignUp() {
	return (
		<>
			<article>
				<h1>Bli medlem</h1>
				<SignUpForm />
			</article>
			{/* <DraftMode url={draftUrl} path={`/`} /> */}
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Bli medlem',
		pathname: '/bli-medlem',
	});
}
