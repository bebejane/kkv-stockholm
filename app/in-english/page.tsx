import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';

export default async function InEnglish({ params }: PageProps<'/in-english'>) {
	//const { start, draftUrl } = await apiQuery(StartDocument);

	//if (!start) return notFound();

	return (
		<>
			<article>
				<h1>In English</h1>
			</article>
			{/* <DraftMode url={draftUrl} path={`/`} /> */}
		</>
	);
}
