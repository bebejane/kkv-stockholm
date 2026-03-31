'use client';

import 'datocms-react-ui/styles.css';
import s from './CalendarAdmin.module.scss';
import { Calendar } from '@/components/calendar/Calendar';
import { Checkbox, Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { sortSwedish } from 'next-dato-utils/utils';

type PropTypes = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function CalendarAdmin({ allWorkshops }: PropTypes) {
	const [workshop, setWorkshop] = useState<WorkshopQuery['workshop'] | null>(null);
	const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
	const equipment = sortSwedish(workshop?.equipment.filter((e) => e.bookable) ?? [], 'title').sort(
		(a, b) => {
			const endsWitNumbers =
				Number.isInteger(parseInt(a.title.split(' ').at(-1) ?? '')) &&
				Number.isInteger(parseInt(b.title.split(' ').at(-1) ?? ''));
			if (endsWitNumbers) {
				return (
					parseInt(a.title.split(' ').at(-1) ?? '') - parseInt(b.title.split(' ').at(-1) ?? '')
				);
			}
			return 0;
		},
	);

	useEffect(() => {
		setEquipmentIds([]);
	}, [workshop]);

	return (
		<div className={s.container}>
			<div className={s.selector}>
				<Select
					className={s.select}
					checkIconPosition='left'
					placeholder='Välj verkstad'
					comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
					onChange={(id) =>
						setWorkshop(allWorkshops?.find((workshop) => workshop.id === id)) ?? null
					}
					data={sortSwedish(allWorkshops ?? [], 'title').map(({ id: value, title: label }) => ({
						value,
						label,
					}))}
				/>
				{workshop && equipment?.length > 0 && (
					<>
						<ul className={s.equipment}>
							{equipment.map(({ id, title }) => (
								<li key={id}>
									<Checkbox
										key={id}
										value={id}
										label={title}
										checked={equipmentIds.includes(id)}
										onChange={({ currentTarget: { checked } }) =>
											setEquipmentIds((prev) =>
												prev.includes(id) && !checked
													? prev.filter((i) => i !== id)
													: [...prev, id],
											)
										}
									/>
								</li>
							))}
						</ul>
					</>
				)}
				{workshop && equipment?.length === 0 && (
					<p className={s.empty}>Det finns ingen bookningsbar utrustningar för verkstaden.</p>
				)}
			</div>
			<div className={s.calendar}>
				<Calendar
					workshopId={workshop?.id}
					equipmentIds={equipmentIds}
					mode='view'
					height='calc(100vh - 55px)'
				/>
			</div>
		</div>
	);
}
