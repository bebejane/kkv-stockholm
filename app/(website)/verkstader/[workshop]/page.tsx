import s from './page.module.scss';
import cn from 'classnames';
import { Image } from 'react-datocms';
import { WorkshopDocument, AllWorkshopsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Gallery from '@/components/common/Gallery';
import Content from '@/components/content/Content';
import Link from 'next/link';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/(website)/layout';
import { BookingButton } from './BookingButton';
import { WorskhopCalendar } from './WorskhopCalendar';
import WorkshopContact from '@/app/(website)/verkstader/[workshop]/WorkshopContact';
import { WorkshopPriceSection } from '@/components/common/WorkshopPriceSection';

function hasDatoStructuredContent(content: any): boolean {
	if (!content) return false;
	if (Array.isArray(content?.blocks) && content.blocks.length > 0) return true;
	if (Array.isArray(content?.inlineBlocks) && content.inlineBlocks.length > 0) return true;

	const document = content?.value?.document;
	const visit = (node: any): boolean => {
		if (!node) return false;
		if (typeof node?.value === 'string' && node.value.trim().length > 0) return true;
		const children = node?.children;
		return Array.isArray(children) ? children.some(visit) : false;
	};

	return visit(document);
}

export default async function WorkshopPage({ params }: PageProps<'/verkstader/[workshop]'>) {
	const { workshop: slug } = await params;
	const { workshop, draftUrl } = await apiQuery(WorkshopDocument, { variables: { slug } });
	const { allWorkshops, draftUrl: allWorkshopsDraftUrl } = await apiQuery(AllWorkshopsDocument);

	if (!workshop) return notFound();

	const {
		titleLong,
		intro,
		text,
		email,
		image,
		gallery,
		equipment,
		hideFromBooking,
		hideCalendarOnWebsite,
	} = workshop;

	const equipmentItems = equipment.filter(({ hideFromWebsite }) => !hideFromWebsite);

	return (
		<>
			<article className={cn(s.workshop)}>
				<h1>{titleLong}</h1>
				{!hideFromBooking && <BookingButton workshop={workshop.id} />}
				<section className='margin-right margin-bottom intro'>
					<Content content={intro} />
				</section>
				<section className={cn(s.gallery, 'margin-bottom margin-right')}>
					<Gallery images={(gallery.length > 0 ? gallery : [image]) as FileField[]} />
				</section>
				{text && hasDatoStructuredContent(text) && (
					<section className={cn('margin-right margin-bottom content', s.text)}>
						<Content content={text} />
					</section>
				)}
				{equipmentItems.length > 0 && (
					<section className={cn('margin-right margin-bottom line', s.equipment)}>
						<header>
							<h2>Utrustning</h2>
						</header>
						<ul>
							{equipmentItems.map(({ id, title, summary, image, manual }) => (
								<li key={id}>
									<figure>
										{image?.responsiveImage && <Image data={image?.responsiveImage} />}
									</figure>
									<div>
										<header>
											<h4>{title}</h4>
											{manual && (
												<span className='button-small very-small'>
													<a href={manual.url} target='new' className={s.manual} download={true}>
														Manual
													</a>
												</span>
											)}
										</header>
										<Content className='mid' content={summary} />
									</div>
								</li>
							))}
						</ul>
					</section>
				)}
				{email && <WorkshopContact email={email} />}
				<WorkshopPriceSection workshop={workshop} />
				{!hideCalendarOnWebsite && (
					<section id='bookings' className={'margin-bottom line'}>
						<h2>Bokningar</h2>
						<WorskhopCalendar allWorkshops={allWorkshops} workshop={workshop} slug={slug} />
					</section>
				)}
				<nav className='line back'>
					<Link href={`/verkstader`}>Tillbaka</Link>
				</nav>
			</article>
			<DraftMode url={[draftUrl, allWorkshopsDraftUrl]} path={`/verkstader/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });
	return allWorkshops.map(({ slug: workshop }) => ({ workshop }));
}

export async function generateMetadata({
	params,
}: PageProps<'/verkstader/[workshop]'>): Promise<Metadata> {
	const { workshop: slug } = await params;
	const { workshop, draftUrl } = await apiQuery(WorkshopDocument, { variables: { slug } });

	if (!workshop) return notFound();

	return buildMetadata({
		title: `Verkstäder — ${workshop.title}`,
		pathname: `/verkstader/${slug}`,
	});
}
