'use client';

import s from './CalendarPage.module.scss';
import type { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas, SelectField, Spinner } from 'datocms-react-ui';
import { useMemo, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/lib/mantine';
import { sortSwedish } from 'next-dato-utils/utils';
import { getDatoClientConfig } from '@/app/(datocms)/plugin/useDatoClient';
import { datoQuery } from '@/app/(datocms)/plugin/dato-query';
import { AllWorkshopsDocument } from '@/graphql';
import { Calendar } from '@/components/calendar/Calendar';
import { configureBookingCalendarStore } from '@/components/calendar/hooks/useBookingCalendarStore';

type PropTypes = { ctx: RenderPageCtx };
type WorkshopOption = { value: string; label: string };

export function CalendarPage({ ctx }: PropTypes) {
	const config = useMemo(() => getDatoClientConfig(ctx), [ctx]);
	const [allWorkshops, setAllWorkshops] = useState<AllWorkshopsQuery['allWorkshops'] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [workshop, setWorkshop] = useState<WorkshopQuery['workshop'] | null>(null);
	const [equipmentIds, setEquipmentIds] = useState<string[]>([]);

	useMemo(() => {
		configureBookingCalendarStore({
			getSession: async () => ({ id: null }),
			searchEndpoint: '/api/plugin/booking/search',
			requestHeaders: () =>
				config ? { Authorization: `Bearer ${config.token}` } : { Authorization: '' },
		});
	}, [config]);

	useEffect(() => {
		if (!config) return;
		datoQuery<AllWorkshopsQuery>(config, AllWorkshopsDocument, {
			includeDrafts: true,
		})
			.then((data) => {
				const workshops = ((data.allWorkshops ?? []) as AllWorkshopsQuery['allWorkshops']).filter(
					({ hideFromBooking }) => !hideFromBooking,
				);
				setAllWorkshops(workshops);
			})
			.catch((e) => {
				setError(e instanceof Error ? e.message : 'Failed to fetch workshops');
			});
	}, [config]);

	useEffect(() => {
		setEquipmentIds([]);
	}, [workshop]);

	const equipment = sortSwedish(workshop?.equipment.filter((e) => e.bookable) ?? [], 'title').sort(
		(a, b) => {
			const endsWithNumbers =
				Number.isInteger(parseInt(a.title.split(' ').at(-1) ?? '')) &&
				Number.isInteger(parseInt(b.title.split(' ').at(-1) ?? ''));
			if (endsWithNumbers) {
				return (
					parseInt(a.title.split(' ').at(-1) ?? '') - parseInt(b.title.split(' ').at(-1) ?? '')
				);
			}
			return 0;
		},
	);

	const workshops: WorkshopOption[] = sortSwedish(allWorkshops ?? [], 'title').map(
		({ id, title }: { id: string; title: string }) => ({
			value: id,
			label: title,
		}),
	);

	return (
		<Canvas ctx={ctx} noAutoResizer>
			<MantineProvider theme={theme}>
				<div className={s.container}>
					<div className={s.selector}>
						{error && <p className={s.error}>{error}</p>}
						{!error && !allWorkshops && <Spinner size={24} placement='inline' />}
						{allWorkshops && (
							<SelectField<WorkshopOption, false, never>
								id='workshop-select'
								name='workshop'
								label=''
								placeholder='Select workshop'
								value={workshop ? (workshops.find((w) => w.value === workshop.id) ?? null) : null}
								onChange={(option) =>
									setWorkshop(allWorkshops?.find((w) => w.id === option?.value) ?? null)
								}
								selectInputProps={{ options: workshops }}
							/>
						)}
						{workshop && equipment?.length > 0 && (
							<div>
								<h4 className={s.subHeading}>Equipment</h4>
								<ul className={s.equipment}>
									{equipment.map(({ id, title }) => (
										<li key={id} className={s.equipmentItem}>
											<input
												id={`equipment-${id}`}
												type='checkbox'
												checked={equipmentIds.includes(id)}
												onChange={({ currentTarget: { checked } }) =>
													setEquipmentIds((prev) =>
														prev.includes(id) && !checked
															? prev.filter((i) => i !== id)
															: [...prev, id],
													)
												}
											/>
											<label htmlFor={`equipment-${id}`}>{title}</label>
										</li>
									))}
								</ul>
							</div>
						)}
						{workshop && equipment?.length === 0 && (
							<p className={s.empty}>No bookable equipment for this workshop.</p>
						)}
					</div>
					<div className={s.calendar}>
						<Calendar
							workshopId={workshop?.id}
							equipmentIds={equipmentIds}
							mode='view'
							height={'calc(100vh - 56px)'}
						/>
					</div>
				</div>
			</MantineProvider>
		</Canvas>
	);
}
