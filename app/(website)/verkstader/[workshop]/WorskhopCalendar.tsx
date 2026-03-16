'use client';

import s from './WorskhopCalendar.module.scss';
import { authClient } from '@/auth/auth-client';
import { Calendar } from '@/components/calendar/Calendar';
import DotLoader from '@/components/common/DotLoader';
import { MultiSelect } from '@mantine/core';
import { useState } from 'react';
import { sortSwedish } from 'next-dato-utils/utils';
import Link from 'next/link';

export function WorskhopCalendar({
	workshop,
	slug,
}: {
	workshop: WorkshopQuery['workshop'];
	slug: string;
}) {
	const { data: session, error, isPending } = authClient.useSession();
	const [equipmentIds, setEquipmentIds] = useState<string[] | null>(null);
	const options = sortSwedish(workshop?.equipment ?? [], 'title').map(
		({ id: value, title: label }) => ({ value, label }),
	);
	if (isPending) return <DotLoader message='Laddar bokningar' />;
	if (error) return <div className={'error'}>{error.message}</div>;
	if (!session?.user.id)
		return (
			<>
				Du måste vara inloggad för att se bokningar.{' '}
				<Link href={`/logga-in?redirect=/verkstader/${slug}`}>Logga in här.</Link>
			</>
		);

	return (
		<div>
			<MultiSelect
				className={s.select}
				checkIconPosition='left'
				placeholder='Välj utrustning'
				data={options}
				onChange={(id) => setEquipmentIds(id)}
			/>
			{workshop && (
				<Calendar workshopId={workshop?.id} equipmentIds={equipmentIds ?? []} mode='view' />
			)}
		</div>
	);
}
