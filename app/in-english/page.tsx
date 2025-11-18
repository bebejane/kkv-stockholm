import s from './page.module.scss';
import Content from '@/components/content/Content';
import { InEnglishDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';

export default async function Contact({ params }: PageProps<'/in-english'>) {
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
