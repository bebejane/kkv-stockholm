import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { FutureBookingsByMemberDocument, PastBookingsByMemberDocument } from '@/graphql';

export default async function BookingsPage({ params }: PageProps<'/medlem/bokningar'>) {
	const session = await getMemberSession();
	const now = new Date().toISOString();
	const [{ allBookings: pastBookings }, { allBookings: futureBookings }] = await Promise.all([
		apiQuery(PastBookingsByMemberDocument, {
			all: true,
			revalidate: 0,
			variables: { memberId: session.member.id, now },
		}),
		apiQuery(FutureBookingsByMemberDocument, {
			all: true,
			revalidate: 0,
			variables: { memberId: session.member.id, now },
		}),
	]);

	return (
		<article>
			<h1>Medlem hem</h1>
			<section>
				<header className='margin-bottom'>
					<h2>Nått här</h2>
				</header>
			</section>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem`,
		pathname: `/medlem`,
	});
}
