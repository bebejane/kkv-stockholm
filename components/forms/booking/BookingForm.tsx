'use client';

import s from './BookingForm.module.scss';
import { z } from 'zod';
import { bookingCreateFormSchema, bookingCreateSchema } from '@/lib/schemas/booking';
import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Calender } from './Calender';
import { MemberUserSession } from '@/auth/utils';
import { formatDateTimeRange } from '@/lib/dates';
import { Options } from './Options';
import { Selection } from './Selection';
import { parseErrorMessage } from '@/lib/utils';

export type NewBookingFormProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
	workshopId?: string;
	session: MemberUserSession;
};

type PreliminaryBooking = {
	workshop: string;
	equipment: string[];
	start: Date;
	end: Date;
};

export function BookingForm({ allWorkshops, workshopId: _workshopId }: NewBookingFormProps) {
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [booking, setBooking] = useState<Partial<PreliminaryBooking>>({
		workshop: _workshopId ?? undefined,
		equipment: [],
		start: undefined,
		end: undefined,
	});

	const isComplete =
		booking.workshop &&
		booking.equipment &&
		booking.equipment.length > 0 &&
		booking.start &&
		booking.end;

	async function handleSubmit(e: React.FormEvent) {
		e?.preventDefault();

		setError(null);
		setSubmitting(true);
		setSubmitted(false);

		try {
			console.log('submit booking', booking);

			const data = bookingCreateFormSchema.parse(booking);
			console.log('submit booking (data)', data);

			const res = await fetch('/api/booking', {
				body: JSON.stringify(data),
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (res.status === 200) setSubmitted(true);
			else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			console.log(e);
			const message = parseErrorMessage(e);
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	function updateBooking(update: Partial<PreliminaryBooking>) {
		setBooking((b) => {
			const u = { ...b, ...update };
			return {
				...u,
				complete:
					u.workshop && u.equipment && u.equipment?.length > 0 && u.start && u.end ? true : false,
			};
		});
	}

	useEffect(() => {
		updateBooking({
			workshop: allWorkshops.find(({ id }) => id === _workshopId)?.id ?? undefined,
		});
	}, [_workshopId]);

	return (
		<>
			<form className={s.form} onSubmit={handleSubmit} method='POST'>
				<Options
					title='Verkstad'
					help='Hjälp text verkstad...'
					options={allWorkshops.map(({ id, title: label, image }) => ({
						id: id as string,
						label,
						image: image as FileField,
					}))}
					multi={false}
					selected={_workshopId ? [_workshopId] : undefined}
					onChange={([workshop]) => updateBooking({ workshop })}
				/>
				{booking.workshop && (
					<Options
						title='Utrusting'
						help='Hjälp text urtrustning...'
						options={allWorkshops
							.find(({ id }) => id === booking.workshop)
							?.equipment.map(({ id, title: label, image }) => ({
								id: id as string,
								label,
								image: image as FileField,
							}))}
						multi={true}
						onChange={(equipment) => updateBooking({ equipment })}
					/>
				)}
				{booking.start && booking.end && (
					<Selection
						title={'Välj tid'}
						label={formatDateTimeRange(booking.start, booking.end)}
						onCancel={() => {
							updateBooking({
								start: undefined,
								end: undefined,
							});
						}}
					/>
				)}
				{booking.workshop && booking.equipment && booking.equipment.length > 0 && !isComplete && (
					<Calender
						workshopId={booking.workshop}
						equipmentIds={booking.equipment}
						onSelection={(start, end) => updateBooking({ start, end })}
					></Calender>
				)}

				{isComplete && (
					<Button type='submit' variant='outline'>
						Boka
					</Button>
				)}
			</form>
			{error && (
				<div className={s.error}>
					<h3>Ett fel uppstod</h3>
					<p>{error}</p>
				</div>
			)}
			{submitted && <div className={s.success}>Bokning skapad</div>}
		</>
	);
}
