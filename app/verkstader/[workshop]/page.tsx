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
import { BookingCalender } from '@/components/booking/BookingCalender';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';
import { Button } from '@mantine/core';

export default async function WorkshopPage({ params }: PageProps<'/verkstader/[workshop]'>) {
	const { workshop: slug } = await params;
	const { workshop, draftUrl } = await apiQuery(WorkshopDocument, { variables: { slug } });

	if (!workshop) return notFound();

	const {
		title,
		titleLong,
		intro,
		text,
		email,
		image,
		gallery,
		equipment,
		priceDay,
		priceHour,
		priceMonth,
		priceWeek,
	} = workshop;

	return (
		<>
			<article className={cn(s.workshop)}>
				<h1>{titleLong}</h1>
				<Link href={`/medlem/bokningar/ny?wid=${workshop.id}`}>
					<Button>Boka</Button>
				</Link>
				<section className='margin-right, margin-bottom intro'>
					<Content content={intro} />
				</section>
				<section className={cn(s.gallery, "margin-bottom margin-right")}>
					{gallery.length > 0 ? (
						<Gallery images={gallery as FileField[]} />
					) : image.responsiveImage ? (
						<Image data={image?.responsiveImage} />
					) : null}
				</section>
				<section className={cn('margin-right margin-bottom line', s.equipment)}>
					<header>
						<h2>Utrustning</h2>
					</header>
					<ul>
						{equipment.map(({ id, title, summary, image, manual, price }) => (
							<li key={id}>
								<figure>{image?.responsiveImage && <Image data={image?.responsiveImage} />}</figure>
								<div>
									<header>
										<h4>{title}</h4>
										{manual && (
											<span className='button-small very-small'>
												<a href={manual.url} className={s.manual} download={true}>
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
				<section className={cn('margin-right margin-bottom line', s.email)}>
					<h2>Avdelninsansvarig</h2>
					Hör av dig till <a href={`mailto:${email}`}>{email}</a> om du har frågor.
				</section>
				<section className={cn('margin-right margin-bottom line', s.prices)}>
					<h2>Priser</h2>
					<div className={s.wrap}>
						<span>Timme:</span> <span>{priceHour}</span>
						<br />
						<span>Dag:</span> <span>{priceDay}</span>
						<br />
						<span>Månad:</span> <span>{priceMonth}</span>
						<br />
						<span>Vecka:</span> <span>{priceWeek}</span>
					</div>
				</section>
				<section className={'margin-bottom line'}>
					<h2>Kalender</h2>
				</section>
			</article>
			<DraftMode url={draftUrl} path={`/verkstader/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });
	return allWorkshops.map(({ slug: workshop }) => ({ workshop }));
}

export async function generateMetadata({ params }: PageProps<'/verkstader/[workshop]'>): Promise<Metadata> {
	const { workshop: slug } = await params;
	const { workshop, draftUrl } = await apiQuery(WorkshopDocument, { variables: { slug } });

	if (!workshop) return notFound();

	return buildMetadata({
		title: `Verkstäder — ${workshop.title}`,
		pathname: `/verkstader/${slug}`,
	});
}
