import Content from '@/components/content/Content';
import s from './page.module.scss';
import { ContactDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/(website)/layout';
import { Metadata } from 'next';

export default async function ContactPage({ params }: PageProps<'/kontakt'>) {
	const { contact, draftUrl } = await apiQuery(ContactDocument);

	if (!contact) return notFound();

	return (
		<>
			<article className='content'>
				<h1>{contact.title}</h1>
				<section className='margin-right content margin-bottom' >
					<Content content={contact.content} />
				</section>
			</article>
			<DraftMode url={draftUrl} path={`/kontakt`} />
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Kontakt',
		pathname: '/kontakt',
	});
}
