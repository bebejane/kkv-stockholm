import s from './page.module.scss';
import cn from 'classnames';
import { AboutDocument, AllAboutsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Content from '@/components/content/Content';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';

export default async function AboutPage({ params }: PageProps<'/om-oss/[about]'>) {
	const { about: slug } = await params;
	const { about, draftUrl } = await apiQuery(AboutDocument, { variables: { slug } });

	if (!about) return notFound();

	return (
		<>
			<article className={cn(s.about)}>
				<h1>{about.title}</h1>
				<section className='margin-right content'>
					<Content className='intro' content={about.intro} />
					<Content content={about.content} />
				</section>
			</article>
			<DraftMode url={draftUrl} path={`/om-oss/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allAbouts } = await apiQuery(AllAboutsDocument, { all: true });
	return allAbouts.map(({ slug: about }) => ({ about }));
}

export async function generateMetadata({ params }: PageProps<'/om-oss/[about]'>): Promise<Metadata> {
	const { about: slug } = await params;
	const { about, draftUrl } = await apiQuery(AboutDocument, { variables: { slug } });

	if (!about) return notFound();

	return buildMetadata({
		title: `Om oss — ${about.title}`,
		pathname: `/om-oss/${slug}`,
	});
}
