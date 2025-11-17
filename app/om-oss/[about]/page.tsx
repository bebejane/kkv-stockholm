import { AboutDocument, AllAboutsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Content from '@/components/content/Content';

export default async function About({ params }: PageProps<'/om-oss/[about]'>) {
	const { about: slug } = await params;
	const { about, draftUrl } = await apiQuery(AboutDocument, { variables: { slug } });

	if (!about) return notFound();

	return (
		<>
			<article>
				<h1>{about.title}</h1>
				<Content content={about.intro} />
				<Content content={about.content} />
			</article>
			{<DraftMode url={draftUrl} path={`/om-oss/${slug}`} />}
		</>
	);
}

export async function generateStaticParams() {
	const { allAbouts } = await apiQuery(AllAboutsDocument, { all: true });
	return allAbouts.map(({ slug }) => ({ slug }));
}
