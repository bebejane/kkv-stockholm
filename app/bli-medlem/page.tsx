import { buildMetadata } from '@/app/layout';
import Content from '@/components/content/Content';
import { MemberSignUpForm } from '@/components/forms/MemberSignUpForm';
import { AllWorkshopsDocument, SignUpStartDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';

export default async function SignUpPage() {
	const { signUpStart, draftUrl } = await apiQuery(SignUpStartDocument);
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });

	if (!signUpStart) return notFound();

	return (
		<>
			<article>
				<h1>{signUpStart.title}</h1>
				<Content className='intro margin-right margin-bottom' content={signUpStart.intro} />
				<MemberSignUpForm allWorkshops={allWorkshops} />
			</article>
			<DraftMode url={draftUrl} path={`/bli-medlem`} />
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Bli medlem',
		pathname: '/bli-medlem',
	});
}
