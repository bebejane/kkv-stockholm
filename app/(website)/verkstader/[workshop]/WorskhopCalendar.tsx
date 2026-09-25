'use client';

import { authClient } from '@/auth/auth-client';
import { Calendar } from '@/components/calendar/Calendar';
import DotLoader from '@/components/common/DotLoader';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { CalendarAside } from '@/components/calendar/CalendarAside';

export function WorskhopCalendar({
	allWorkshops,
	workshop,
	slug,
}: {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
	workshop: WorkshopQuery['workshop'];
	slug: string;
}) {
	const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
	const asideRef = useRef<HTMLDivElement>(null);
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

	if (!workshop) return null;
	return (
		<>
			<CalendarAside
				workshop={workshop}
				onEquipmentChange={setEquipmentIds}
				asideRef={asideRef}
			/>
			<Calendar workshopId={workshop.id} equipmentIds={equipmentIds} mode='view' asideRef={asideRef} />
		</>
	);
}
