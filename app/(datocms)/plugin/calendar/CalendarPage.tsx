'use client';

import 'datocms-react-ui/styles.css';
import s from './CalendarPage.module.scss';
import { authClient } from '@/auth/auth-client';
import { Calendar } from '@/components/calendar/Calendar';
import DotLoader from '@/components/common/DotLoader';
import {
	Checkbox,
	CheckIcon,
	MantineProvider,
	MultiSelect,
	Radio,
	Select,
	Stack,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { sortSwedish } from 'next-dato-utils/utils';
import { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';
import { theme } from '@/lib/mantine';
import { Login } from './Login';

type PropTypes = {
	ctx: RenderPageCtx;
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function CalendarPage({ ctx, allWorkshops }: PropTypes) {
	const defaultWorkshop = allWorkshops?.[0];
	const { data: session, error, isPending } = authClient.useSession();
	const [workshop, setWorkshop] = useState<WorkshopQuery['workshop'] | null>(defaultWorkshop);
	const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
	//const [height, setHeight] = useState<string>('100vh');

	useEffect(() => {
		setEquipmentIds([]);
	}, [workshop]);

	if (error) return <div className={'error'}>{error.message}</div>;
	console.log(equipmentIds);
	return (
		<Canvas ctx={ctx}>
			<div className={s.container}>
				<MantineProvider theme={theme}>
					{!session?.user.id || isPending ? (
						<Login />
					) : (
						<>
							<div className={s.selector}>
								<Select
									className={s.select}
									checkIconPosition='left'
									placeholder='Välj verkstad'
									defaultValue={defaultWorkshop?.id}
									comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
									onChange={(id) =>
										setWorkshop(allWorkshops?.find((workshop) => workshop.id === id)) ?? null
									}
									data={sortSwedish(allWorkshops ?? [], 'title').map(
										({ id: value, title: label }) => ({
											value,
											label,
										}),
									)}
								/>
								{workshop && (
									<Stack className={s.equipment}>
										{sortSwedish(workshop.equipment ?? [], 'title').map(({ id, title }) => (
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
										))}
									</Stack>
								)}
							</div>
							<div className={s.calendar}>
								{workshop && (
									<Calendar
										workshopId={workshop.id}
										equipmentIds={equipmentIds}
										mode='view'
										height='calc(100vh - 55px)'
									/>
								)}
							</div>
						</>
					)}
				</MantineProvider>
			</div>
		</Canvas>
	);
}
