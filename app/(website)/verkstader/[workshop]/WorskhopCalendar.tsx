'use client';

import s from './WorskhopCalendar.module.scss';
import { authClient } from '@/auth/auth-client';
import { Calendar } from '@/components/calendar/Calendar';
import DotLoader from '@/components/common/DotLoader';
import { Group, Select, SelectProps } from '@mantine/core';
import { Image } from 'react-datocms';
import Link from 'next/link';
import { useState } from 'react';
import { sortSwedish } from 'next-dato-utils/utils';

export function WorskhopCalendar({
	workshop,
	slug,
}: {
	workshop: WorkshopQuery['workshop'];
	slug: string;
}) {
	const options = sortSwedish(workshop?.equipment ?? [], 'title').map(
		({ id: value, title: label }) => ({ value, label }),
	);
	const [equipmentId, setEquipmentId] = useState<string | null>(null);
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

	const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => {
		const responsiveImage = workshop?.equipment.find((e) => e.id === option.value)?.image
			?.responsiveImage;
		return (
			<Group flex='1' gap='xs'>
				{responsiveImage && (
					<Image
						data={responsiveImage}
						style={{ height: '1rem', width: '1rem', objectFit: 'cover' }}
					/>
				)}
				{option.label}
			</Group>
		);
	};

	return (
		<div>
			<Select
				className={s.select}
				placeholder='Välj utrustning'
				data={options}
				renderOption={renderSelectOption}
				onChange={(id) => setEquipmentId(id)}
			/>
			{workshop && (
				<Calendar
					workshopId={workshop?.id}
					equipmentIds={equipmentId ? [equipmentId] : []}
					mode='view'
				/>
			)}
		</div>
	);
}
