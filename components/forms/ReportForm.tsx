'use client';

import s from './ReportForm.module.scss';
import { Form } from '@/components/forms/Form';
import { Button, Select, Input, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { reportCreateSchema, reportUpdateSchema } from '@/lib//schemas';
import { Assistant } from '@/types/datocms';
import { useState } from 'react';
import { Item } from '@/lib/client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { WorkshopTypeLinked } from '@/lib/controller/workshop';
import { AssistantType, ReportTypeLinked } from '@/lib/controller/report';
import { MemberType } from '@/lib/controller/member';
import { BookingTypeLinked } from '@/lib/controller/booking';

export type BookingReportFormProps = {
	member: MemberType;
	workshops: WorkshopTypeLinked[];
	report?: ReportTypeLinked | null;
	booking?: BookingTypeLinked;
};

export function ReportForm({ member, booking, report, workshops }: BookingReportFormProps) {
	const initialAssiants = report?.assistants.map(({ id, hours, days }) => ({ id, hours, days })) ?? [];
	const initialDate = new Date(report?.date ?? booking?.start ?? '');
	const initialValues = reportCreateSchema.keyof().options.reduce(
		(acc, key) => {
			!acc[key] && (acc[key] = '');
			return acc;
		},
		{
			...report,
			member: member?.id,
			booking: report?.booking?.id ?? booking?.id ?? undefined,
			workshop: report?.workshop?.id ?? booking?.workshop.id,
			assistants: initialAssiants,
			date: initialDate.toISOString().split('T')[0],
		} as any
	);

	const endpoint = `/api/member/report${report?.id ? `/${report.id}` : ''}`;
	const method = report?.id ? 'PATCH' : 'POST';
	const schema = report?.id ? reportUpdateSchema : reportCreateSchema;

	const router = useRouter();
	const [assistants, setAssistants] = useState<AssistantType[]>(initialAssiants);

	function handleAddAssistant() {
		setAssistants((a) => [...a, { hours: 0, days: 0 }]);
	}

	function removeAddAssistant(idx: number) {
		setAssistants((a) => [...a, { hours: 0, days: 0 }]);
	}

	return (
		<Form
			endpoint={endpoint}
			method={method}
			schema={schema}
			initialValues={initialValues}
			onSubmitted={() => router.refresh()}
			fields={({ form, submitting }) => (
				<>
					<Input type='hidden' {...form.getInputProps('booking')} style={{ display: 'none' }} />
					<DatePickerInput withAsterisk label='Datum' required {...form.getInputProps('date')} />
					<Select
						data={workshops.map(({ id: value, title: label }) => ({ value, label: label ?? '' }))}
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

					<Button type='submit' disabled={submitting || !form.isDirty()} loading={submitting}>
						Spara
					</Button>
				</>
			)}
		/>
	);
}
