'use client';

import 'datocms-react-ui/styles.css';
import s from './CalendarPage.module.scss';
import { authClient } from '@/auth/auth-client';
import { Calendar } from '@/components/calendar/Calendar';
import DotLoader from '@/components/common/DotLoader';
import { MantineProvider, MultiSelect, Select } from '@mantine/core';
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

	useEffect(() => {
		setEquipmentIds([]);
	}, [workshop]);

	if (error) return <div className={'error'}>{error.message}</div>;

	return (
		<Canvas ctx={ctx}>
			<div className={s.container}>
				<MantineProvider theme={theme}>
					{!session?.user.id || isPending ? (
						<Login />
					) : (
						<>
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
								<>
									<MultiSelect
										key={workshop.id}
										className={s.select}
										checkIconPosition='left'
										placeholder='Välj utrustning'
										comboboxProps={{
											position: 'bottom',
											middlewares: { flip: false, shift: false },
										}}
										clearable={true}
										onChange={(id) => setEquipmentIds(id)}
										data={sortSwedish(workshop.equipment ?? [], 'title').map(
											({ id: value, title: label }) => ({ value, label }),
										)}
									/>
									<Calendar workshopId={workshop.id} equipmentIds={equipmentIds} mode='view' />
								</>
							)}
						</>
					)}
				</MantineProvider>
			</div>
		</Canvas>
	);
}
