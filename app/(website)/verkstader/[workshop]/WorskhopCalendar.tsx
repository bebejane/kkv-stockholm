'use client';

import { authClient } from '@/auth/auth-client';
import { Calendar } from '@/components/calendar/Calendar';
import DotLoader from '@/components/common/DotLoader';
import Link from 'next/link';

export function WorskhopCalendar({ workshopId, slug }: { workshopId: string; slug: string }) {
	const { data: session, error, isPending } = authClient.useSession();

	if (isPending) return <DotLoader message='Laddar bokningar' />;
	if (error) return <div className={'error'}>{error.message}</div>;
	if (!session?.user.id)
		return (
			<>
				Du måste vara inloggad för att se bokningar.{' '}
				<Link href={`/logga-in?redirect=/verkstader/${slug}`}>Logga in här.</Link>
			</>
		);

	return <Calendar workshopId={workshopId} equipmentIds={[]} mode='view' />;
}
