import s from './CalendarAside.module.scss';
import { Checkbox } from '@mantine/core';
import { sortSwedish } from 'next-dato-utils/utils';
import { useEffect, useRef, useState } from 'react';

const status = [
	{ id: 'unavailable', title: 'Upptagen' },
	{ id: 'shared', title: 'Kan delas' },
	{ id: 'available', title: 'Ledig' },
	{ id: 'you', title: 'Din tid' },
];

export type CalendarAsideProps = {
	workshop?: WorkshopQuery['workshop'] | AllWorkshopsQuery['allWorkshops'][number] | null;
	onEquipmentChange?: (equipmentIds: string[]) => void;
};

export function CalendarAside({ workshop, onEquipmentChange }: CalendarAsideProps) {
	const asideRef = useRef<HTMLDivElement>(null);
	const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
	const bookableEquipment = sortSwedish(
		workshop?.equipment.filter((e) => e.bookable) ?? [],
		'title',
	);

	useEffect(() => {
		onEquipmentChange?.(equipmentIds);
	}, [equipmentIds]);

	return (
		<aside id='calendar-aside' className={s.aside} ref={asideRef}>
			<h2>Förklaring</h2>
			<ul className={s.state}>
				{status.map(({ id, title }) => (
					<li key={id}>
						<div className={id} />
						<span>{title}</span>
					</li>
				))}
			</ul>
			{bookableEquipment.length > 0 && (
				<>
					<h2>Utrustning</h2>
					<ul className={s.equipment}>
						{bookableEquipment.map(({ id, title }) => (
							<li key={id}>
								<Checkbox
									checked={equipmentIds.includes(id)}
									label={title}
									size={'xs'}
									onChange={({ currentTarget: { checked } }) =>
										setEquipmentIds((prev) =>
											prev.includes(id) && !checked ? prev.filter((i) => i !== id) : [...prev, id],
										)
									}
								/>
							</li>
						))}
					</ul>
				</>
			)}
		</aside>
	);
}
