import s from './page.module.scss';
import cn from 'classnames';
import Content from '@/components/content/Content';
import { AllWorkshopsDocument, WorkshopStartDocument } from '@/graphql';
import { Thumbnail } from '@/components/common/Thumbnail';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function WorkshopsPage({ params }: PageProps<'/verkstader'>) {
	const { workshopsStart, draftUrl } = await apiQuery(WorkshopStartDocument);
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });

	if (!workshopsStart) return notFound();

	return (
		<>
			<article className={cn(s.workshops)}>
				<h1>{workshopsStart.title}</h1>
				<section className='margin-right intro'>
					<Content content={workshopsStart.intro} />
				</section>
				<ul>
					{allWorkshops.map(({ id, title, image, slug }) => (
						<li key={id}>
							<Thumbnail image={image as FileField} title={title} layout='center' href={`/verkstader/${slug}`} />
						</li>
					))}
				</ul>
			</article>
			<DraftMode url={draftUrl} path={`/verkstader`} />
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Verkstäder',
		pathname: '/verkstader',
	});
}
