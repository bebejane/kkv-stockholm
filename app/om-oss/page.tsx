import { AboutDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Content from '@/components/content/Content';

export default async function AboutUs({ params }: PageProps<'/om-oss'>) {
	const { about, draftUrl } = await apiQuery(AboutDocument, { variables: { slug: 'om-oss' } });

	if (!about) return notFound();

	return (
		<>
			<article>
				<h1>{about.title}</h1>
				<Content content={about.intro} />
				<Content content={about.content} />
			</article>
			{<DraftMode url={draftUrl} path={`/om-oss`} />}
		</>
	);
}
