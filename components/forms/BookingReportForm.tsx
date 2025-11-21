'use client';

import s from './BookingReportForm.module.scss';
import { Form } from '@/components/forms/Form';
import { Button, Select, Input, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { reportSchema } from '@/lib//schemas';
import { Assistant } from '@/types/datocms';
import { useEffect, useState } from 'react';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import React from 'react';
import { useRouter } from 'next/navigation';

export type BookingReportFormProps = {
	booking?: BookingQuery['booking'];
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

type AssistantType = Pick<Item<Assistant>, 'hours' | 'days'> & { id?: string };

export function BookingReportForm({ booking, allWorkshops }: BookingReportFormProps) {
	const router = useRouter();
	const intialAssiants = booking?.report?.assistants.map(({ id, hours, days }) => ({ id, hours, days })) ?? [];
	const initialValues = reportSchema.keyof().options.reduce(
		(acc, key) => {
			!acc[key] && (acc[key] = '');
			return acc;
		},
		{
			...booking?.report,
			member: booking?.member?.id,
			workshop: booking?.workshop?.id ?? undefined,
			date: booking?.report?.date ?? new Date().toISOString(),
		} as any
	);

	const [assistants, setAssistants] = useState<AssistantType[]>(intialAssiants);

	function handleAddAssistant() {
		setAssistants((a) => [...a, { hours: 0, days: 0 }]);
	}

	function removeAddAssistant(idx: number) {
		setAssistants((a) => [...a, { hours: 0, days: 0 }]);
	}

	return (
		<Form
			endpoint={'/api/reports/create'}
			schema={reportSchema}
			initialValues={initialValues}
			onSubmitted={() => router.refresh()}
			message={{ title: 'Tack!', text: 'Tack för din rapportering' }}
			fields={({ form, submitting, reset }) => (
				<>
					<DatePickerInput withAsterisk label='Datum' required {...form.getInputProps('date')} />
					<Select
						data={allWorkshops.map(({ id: value, title: label }) => ({ value, label }))}
						label='Verkstad'
						withAsterisk
						required
						{...form.getInputProps('workshop')}
					/>
					<TextInput type='number' label='Antal timmar (up till 5h /dag)' {...form.getInputProps('hours')} />
					<TextInput type='number' label='Antal dagar (mer än 5h /dag)' {...form.getInputProps('days')} />
					<TextInput type='number' label='Extra konstnad i SEK' {...form.getInputProps('extra_cost')} />

					<Button
						type='button'
						variant='outline'
						onClick={() => {
							form.insertListItem('assistants', { hours: 0, days: 0 });
							handleAddAssistant();
						}}
					>
						+ Lägg till tid för medarbetare
					</Button>

					{assistants?.map((_, idx) => (
						<React.Fragment key={idx}>
							<TextInput
								type='number'
								label='Antal timmar (up till 5h /dag)'
								{...form.getInputProps(`assistants.${idx}.hours`)}
							/>
							<TextInput
								type='number'
								label='Antal dagar (mer än 5h /dag)'
								{...form.getInputProps(`assistants.${idx}.days`)}
							/>
						</React.Fragment>
					))}

					<Button type='submit' disabled={submitting} loading={submitting}>
						Skicka in
					</Button>
				</>
			)}
		/>
	);
}
