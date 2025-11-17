import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';

export default async function Home({ params }: PageProps<'/'>) {
	const { start, draftUrl } = await apiQuery(StartDocument);

	if (!start) return notFound();

	return (
		<>
			<article>
				<h1>Start</h1>
			</article>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
