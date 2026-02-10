'use client';

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
import { DateTimeFieldValue } from '@datocms/cma-client';
import { differenceInDays, differenceInHours } from 'date-fns';
import { tzDate } from '@/lib/dates';

export type BookingReportFormProps = {
	member: MemberType;
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
	report?: ReportTypeLinked | null;
	booking?: BookingTypeLinked;
};

export function ReportForm({ member, booking, report, allWorkshops }: BookingReportFormProps) {
	const initialAssiants =
		report?.assistants.map(({ id, hours, days }) => ({ id, hours, days })) ?? [];
	const initialDate = new Date(report?.date ?? booking?.start ?? new Date());
	const start = report?.booking?.start ? tzDate(report?.booking?.start) : new Date();
	const end = report?.booking?.end ? tzDate(report?.booking?.end) : new Date();
	const initialValues = createInitialFormValues(reportCreateSchema, {
		...report,
		member: member?.id,
		booking: report?.booking?.id ?? booking?.id ?? null,
		workshop: report?.workshop?.id ?? booking?.workshop.id,
		assistants: initialAssiants,
		date: initialDate.toISOString().split('T')[0],
		hours:
			differenceInDays(tzDate(start), tzDate(end)) === 0
				? Math.min(differenceInHours(tzDate(end), tzDate(start)), 5)
				: undefined,
		days: differenceInDays(tzDate(start), tzDate(end)),
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
									label='Timmar (up till 5h/d)'
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
function differanceInDays(
	start: DateTimeFieldValue | undefined,
	start1: DateTimeFieldValue | undefined,
) {
	throw new Error('Function not implemented.');
}

function differanceInHours(
	start: DateTimeFieldValue | undefined,
	end: DateTimeFieldValue | undefined,
) {
	throw new Error('Function not implemented.');
}
