import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import Content from '@/components/content/Content';
import { SignUpForm } from '@/components/forms/SignUpForm';
import { AllWorkshopsDocument, SignUpStartDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import cn from 'classnames';
import { ShortcutButton } from './ShortcutButton';


export default async function SignUpPage() {
	const { signUpStart, draftUrl } = await apiQuery(SignUpStartDocument);
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });

	if (!signUpStart) return notFound();
	const formTargetId = 'member-application-form';

	return (
		<>
			<article className={s.member}>
				<div className={s.wrapper}>
					<h1>{signUpStart.title}</h1>
					<div className={s.shortcut}>
						<ShortcutButton targetId={formTargetId}>
							Ansök
						</ShortcutButton>
					</div>
					<section className='margin-right content'>
						<Content className='intro' content={signUpStart.intro} />
						<Content content={signUpStart.text} />
					</section>
				</div>
				<h2 id={formTargetId} className={cn('mid', s.headline)}>
					Ansökningsformulär
				</h2>
				<SignUpForm allWorkshops={allWorkshops} />
			</article >
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
