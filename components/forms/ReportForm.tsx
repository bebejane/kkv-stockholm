'use client';

import 'dayjs/locale/sv';
import s from './ReportForm.module.scss';
import React from 'react';
import { Form } from '@/components/forms/Form';
import { Button, Select, Input, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { reportCreateSchema, reportUpdateSchema } from '@/lib//schemas/report';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssistantType, ReportTypeLinked } from '@/lib/controllers/report';
import { MemberType } from '@/lib/controllers/member';
import { BookingTypeLinked } from '@/lib/controllers/booking';
import { createInitialFormValues } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { addDays, addHours, differenceInDays, differenceInHours, startOfDay } from 'date-fns';
import { tzDate } from '@/lib/dates';
import { START_HOUR } from '@/lib/constants';

export type BookingReportFormProps = {
	member: MemberType;
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
	report?: ReportTypeLinked | null;
	booking?: BookingTypeLinked;
};

function getInitialDuration(start: Date, end: Date) {
	const diff = differenceInDays(end, start);
	const maxHours = 5;
	let hours = 0;
	let days = 0;

	if (diff === 0) {
		const h = differenceInHours(end, start);
		if (h > maxHours) days++;
		else hours = h;
	} else {
		for (let i = 0; i <= diff; i++) {
			const d = i > 0 ? addHours(startOfDay(addDays(start, i)), START_HOUR) : addDays(start, i);
			const h = differenceInHours(end, d) - 1;
			if (h > maxHours) days++;
			else hours += Math.min(h, maxHours);
		}
	}

	return {
		hours,
		days,
	};
}

export function ReportForm({ member, booking, report, allWorkshops }: BookingReportFormProps) {
	const start = booking?.start
		? tzDate(booking?.start)
		: report?.booking?.start
			? tzDate(report?.booking?.start)
			: new Date();
	const end = booking?.end
		? tzDate(booking?.end)
		: report?.booking?.end
			? tzDate(report?.booking?.end)
			: new Date();
	const initialAssiants =
		report?.assistants.map(({ id, hours, days }) => ({ id, hours, days })) ?? [];
	const initialDate = new Date(report?.date ?? booking?.start ?? new Date());
	const initialDuration = getInitialDuration(start, end);
	const initialValues = createInitialFormValues(reportCreateSchema, {
		...report,
		member: member?.id,
		booking: report?.booking?.id ?? booking?.id ?? null,
		workshop: report?.workshop?.id ?? booking?.workshop.id ?? null,
		assistants: initialAssiants,
		date: initialDate.toISOString().split('T')[0],
		hours: initialDuration.hours,
		days: initialDuration.days,
	});

	const endpoint = `/api/member/report${report?.id ? `/${report.id}` : ''}`;
	const method = report?.id ? 'PATCH' : 'POST';
	const schema = report?.id ? reportUpdateSchema : reportCreateSchema;

	const router = useRouter();
	const [assistants, setAssistants] = useState<AssistantType[]>(initialAssiants);

	function handleAddAssistant(form: any) {
		form.insertListItem('assistants', { hours: 0, days: 0 });
		setAssistants((a) => [...a, { hours: 0, days: 0 }]);
	}

	function handleRemoveAssistant(idx: number, form: any) {
		form.removeListItem('assistants', idx);
		setAssistants((a) => a.filter((_, i) => i !== idx));
	}

	return (
		<Form
			endpoint={endpoint}
			method={method}
			schema={schema}
			initialValues={initialValues}
			onSubmitted={({ id }) => router.replace(`/medlem/rapporter/${id}`)}
			fields={({ form, submitting, submitted }) => (
				<>
					<section className='five'>
						<Input type='hidden' {...form.getInputProps('booking')} style={{ display: 'none' }} />
						<DatePickerInput withAsterisk label='Datum' required {...form.getInputProps('date')} />
						<Select
							data={allWorkshops.map(({ id: value, title: label }) => ({
								value,
								label: label ?? '',
							}))}
							label='Verkstad'
							withAsterisk
							required
							{...form.getInputProps('workshop')}
						/>
						<TextInput
							type='number'
							label='Timmar (upp till 5h/d)'
							{...form.getInputProps('hours')}
						/>
						<TextInput type='number' label='Dagar (mer än 5h/d)' {...form.getInputProps('days')} />
						<TextInput
							type='number'
							label='Extra konstnad i SEK'
							{...form.getInputProps('extra_cost')}
						/>
					</section>

					{assistants?.map((_, idx) => (
						<section className={s.assistent} key={idx}>
							<React.Fragment key={idx}>
								<TextInput
									type='number'
									label='Timmar (upp till 5h/d)'
									{...form.getInputProps(`assistants.${idx}.hours`)}
								/>
								<TextInput
									type='number'
									label='Dagar (mer än 5h/d)'
									{...form.getInputProps(`assistants.${idx}.days`)}
								/>
								<Button
									className={s.addAssistent}
									type='button'
									variant='outline'
									onClick={() => handleRemoveAssistant(idx, form)}
								>
									Ta bort
								</Button>
							</React.Fragment>
						</section>
					))}

					<Button
						className={s.addAssistent}
						type='button'
						variant='outline'
						onClick={() => handleAddAssistant(form)}
					>
						+ Lägg till tid för medarbetare
					</Button>
					<SubmitButton loading={submitting} submitted={submitted}>
						{submitted ? 'Sparad' : 'Spara'}
					</SubmitButton>
				</>
			)}
		/>
	);
}
