import { buildMetadata } from '@/app/(website)/layout';
import s from './page.module.scss';
import Content from '@/components/content/Content';
import { InEnglishDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';

export default async function inEnglishPage({ params }: PageProps<'/in-english'>) {
	const { inEnglish, draftUrl } = await apiQuery(InEnglishDocument);

	if (!inEnglish) return notFound();

	return (
		<>
			<article>
				<h1>{inEnglish.title}</h1>
				<Content content={inEnglish.content} />
			</article>
			<DraftMode url={draftUrl} path={`/in-english`} />
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'In English',
		pathname: '/in-english',
		locale: 'en-US',
	});
}
