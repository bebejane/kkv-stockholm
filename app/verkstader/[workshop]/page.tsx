import s from './page.module.scss';
import cn from 'classnames';
import { Image } from 'react-datocms';
import { WorkshopDocument, AllWorkshopsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Content from '@/components/content/Content';
import Link from 'next/link';
import Calender from '@/components/calender';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';
import { Button } from '@mantine/core';

export default async function Workshop({ params }: PageProps<'/verkstader/[workshop]'>) {
	const { workshop: slug } = await params;
	const { workshop, draftUrl } = await apiQuery(WorkshopDocument, { variables: { slug } });

	if (!workshop) return notFound();

	return (
		<>
			<article className={cn(s.workshop)}>
				<h1>{workshop.titleLong}</h1>
				<Button className={cn(s.newBooking)}>Boka</Button>
				<section className='margin-right, margin-bottom intro'>
					<Content content={workshop.intro} />
				</section>
				<section className={cn('margin-right margin-bottom line', s.equipment)}>
					<header>
						<h2>Utrustning</h2>
					</header>
					<ul>
						{workshop.equipment.map(({ id, title, summary, image, manual, price }) => (
							<li key={id}>
								<figure>{image?.responsiveImage && <Image data={image?.responsiveImage} />}</figure>
								<div>
									<header>
										<h4>{title}</h4>
										{manual && (
											<span className='button-small very-small'>
												<Link href={manual.url} className={s.manual} download={true}>
													Manual
												</Link>
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
					Hör av dig till <a href={`mailto:${workshop.email}`}>{workshop.email}</a> om du har frågor.
				</section>
				<section className={cn('margin-right margin-bottom line', s.prices)}>
					<h2>Priser</h2>
					<div>
						<span>Timme:</span> <span>{workshop.priceHour}</span>
						<br />
						<span>Dag:</span> <span>{workshop.priceDay}</span>
						<br />
						<span>Månad:</span> <span>{workshop.priceMonth}</span>
						<br />
						<span>Vecka:</span> <span>{workshop.priceWeek}</span>
					</div>
					<div>
						<span>Stor ugn, bränning, per kWh</span> <span>Följer inköpspris</span>
						<span>Lilla ugn, bränning</span> <span>150 kr</span>
					</div>
				</section>
				<section className={cn('margin-bottom line', s.calendar)}>
					<h2>Kalender</h2>
					<Calender />
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
