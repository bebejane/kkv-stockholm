'use client';

import 'datocms-react-ui/styles.css';
import s from './CalendarPage.module.scss';
import { authClient } from '@/auth/auth-client';
import { Calendar } from '@/components/calendar/Calendar';
import DotLoader from '@/components/common/DotLoader';
import { MantineProvider, MultiSelect, Select } from '@mantine/core';
import { useState } from 'react';
import { sortSwedish } from 'next-dato-utils/utils';
import { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';
import { theme } from '@/lib/mantine';
import { Login } from '@/app/(datocms)/plugin/components/Login';

type PropTypes = {
	ctx: RenderPageCtx;
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function CalendarPage({ ctx, allWorkshops }: PropTypes) {
	const { data: session, error, isPending } = authClient.useSession();
	const [workshop, setWorkshop] = useState<WorkshopQuery['workshop'] | null>(
		allWorkshops?.[0] ?? null,
	);
	const [equipmentIds, setEquipmentIds] = useState<string[] | null>(null);

	if (isPending) return <DotLoader message='Laddar bokningar' />;
	if (error) return <div className={'error'}>{error.message}</div>;
	console.log('session', session, error, isPending);
	return (
		<Canvas ctx={ctx}>
			<MantineProvider theme={theme}>
				{!session?.user.id ? (
					<Login />
				) : (
					<>
						<Select
							className={s.select}
							checkIconPosition='left'
							placeholder='Välj verkstad'
							data={sortSwedish(allWorkshops ?? [], 'title').map(({ id: value, title: label }) => ({
								value,
								label,
							}))}
							comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
							onChange={(id) =>
								setWorkshop(allWorkshops?.find((workshop) => workshop.id === id)) ?? null
							}
						/>
						{workshop && (
							<>
								<MultiSelect
									className={s.select}
									checkIconPosition='left'
									placeholder='Välj utrustning'
									data={sortSwedish(workshop.equipment ?? [], 'title').map(
										({ id: value, title: label }) => ({ value, label }),
									)}
									comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
									onChange={(id) => setEquipmentIds(id)}
								/>
								<Calendar workshopId={workshop?.id} equipmentIds={equipmentIds ?? []} mode='view' />
							</>
						)}
					</>
				)}
			</MantineProvider>
		</Canvas>
	);
}
