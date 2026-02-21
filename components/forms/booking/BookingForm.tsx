'use client';

import s from './BookingForm.module.scss';
import { bookingCreateFormSchema } from '@/lib/schemas/booking';
import { Button, TextInput } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@/components//calendar/Calendar';
import { MemberUserSession } from '@/auth/utils';
import { formatDateTimeRange } from '@/lib/dates';
import { Options } from './Options';
import { Selection } from './Selection';
import { parseErrorMessage } from '@/lib/utils';
import Link from 'next/link';
import { NextButton } from '@/components/forms/booking/NextButton';
import { useBookingCalendarStore } from '@/components/calendar/hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';

export type NewBookingFormProps = {
	allWorkshops: AllWorkshopsFormQuery['allWorkshops'];
	help: AllWorkshopsFormQuery['bookingHelp'];
	workshopId?: string;
	session: MemberUserSession;
};

type PreliminaryBooking = {
	id?: string;
	workshop: string;
	equipment: string[];
	start: Date;
	end: Date;
	note: string;
	confirmed: boolean;
};

export function BookingForm({ allWorkshops, help, workshopId: _workshopId }: NewBookingFormProps) {
	const calenderRef = useRef<HTMLDivElement>(null);
	const [selection, setSelection] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.setSelection]),
	);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const defaultBooking = {
		id: undefined,
		workshop: _workshopId ?? undefined,
		equipment: [],
		start: undefined,
		end: undefined,
		note: '',
		confirmed: false,
	};
	const [booking, setBooking] = useState<Partial<PreliminaryBooking>>(defaultBooking);

	const isComplete =
		booking.workshop &&
		booking.equipment &&
		booking.equipment.length > 0 &&
		booking.start &&
		booking.end &&
		booking.confirmed;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e?.preventDefault();

		setError(null);
		setSubmitting(true);
		setSubmitted(false);

		try {
			const data = bookingCreateFormSchema.parse(booking);

			const res = await fetch('/api/member/booking', {
				body: JSON.stringify(data),
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (res.status === 200) {
				const { id, error } = await res.json();
				if (error) throw new Error(error);
				updateBooking({ id });
				setSubmitted(true);
				window.scrollTo(0, 0);
			} else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			console.log(e);
			const message = parseErrorMessage(e);
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	function reset() {
		setBooking(defaultBooking);
		setSubmitted(false);
		setError(null);
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
		setError(null);
		if (!update.start || !update.end) setSelection(null);
	}

	useEffect(() => {
		updateBooking({
			workshop: allWorkshops.find(({ id }) => id === _workshopId)?.id ?? undefined,
		});
	}, [_workshopId]);

	useEffect(() => {
		updateBooking({ start: selection?.[0], end: selection?.[1] });
	}, [selection]);

	if (submitted)
		return (
			<section className={s.success}>
				<h3>Tack för din bokning!</h3>
				<p className={s.success}>
					Du har fått ett mail med en bekräftelse på bokningen. Där hittar du också all information
					om hur du rapporterar tid och kostnader.
				</p>
				<Link href={`/medlem/bokningar/${booking.id}`}>
					<Button type='button'>Gå till bokning</Button>
				</Link>
				&nbsp;
				<Link href={`/medlem/bokningar/ny`} replace={false}>
					<Button type='button' onClick={reset}>
						Skapa ny bokning
					</Button>
				</Link>
			</section>
		);

	return (
		<>
			<form className={s.form} onSubmit={handleSubmit} method='POST'>
				<input type='hidden' name='workshop' value={booking.workshop ?? ''} />
				<input type='hidden' name='equipment' value={booking.equipment?.join(',') ?? ''} />
				<input type='hidden' name='start' value={booking.start?.toISOString() ?? ''} />
				<input type='hidden' name='end' value={booking.end?.toISOString() ?? ''} />
				<Options
					title='Verkstad'
					help={help?.workshop}
					options={allWorkshops.map(({ id, title: label, image }) => ({
						id: id as string,
						label,
						image: image as FileField,
					}))}
					multi={false}
					selected={_workshopId ? [_workshopId] : undefined}
					onChange={(val) => updateBooking({ workshop: val?.[0] })}
					onCancel={() =>
						updateBooking({
							start: undefined,
							end: undefined,
							workshop: undefined,
							equipment: [],
							confirmed: false,
						})
					}
				/>
				{booking.workshop && (
					<Options
						title='Utrustning'
						help={help?.equipment}
						options={allWorkshops
							.find(({ id }) => id === booking.workshop)
							?.equipment.filter(({ bookable }) => bookable)
							.map(({ id, title: label, image }) => ({
								id: id as string,
								label,
								image: image as FileField,
							}))}
						multi={true}
						onChange={(equipment) => updateBooking({ equipment })}
						onCancel={() => updateBooking({ start: undefined, end: undefined, equipment: [] })}
					/>
				)}

				{booking.workshop && booking.equipment && booking.equipment.length > 0 && (
					<Selection
						title={'Vald tid'}
						value={booking.start && booking.end && formatDateTimeRange(booking.start, booking.end)}
						help={help?.calendar}
						onCancel={() => {
							updateBooking({
								start: undefined,
								end: undefined,
								confirmed: false,
							});
						}}
					/>
				)}

				{booking.workshop &&
					booking.equipment &&
					booking.equipment.length > 0 &&
					!booking.confirmed && (
						<>
							<Calendar
								workshopId={booking.workshop}
								equipmentIds={booking.equipment}
								disabled={false}
							/>
							<NextButton
								type='button'
								disabled={!booking.start || !booking.end}
								onClick={() => {
									updateBooking({ confirmed: true });
									window.scrollTo(0, 0);
								}}
							>
								Gå vidare
							</NextButton>
						</>
					)}

				{isComplete && (
					<div className={s.complete}>
						<h3>Slutför bokning</h3>
						<div>
							<p>
								Granska att uppgifterna ovan stämmer. När du klickar på "Boka" så godkänner du
								samtidigt <a href='/om//medlemsregler'>bokningsavtalet</a>.
							</p>

							<TextInput
								className={s.note}
								label='Meddelande till andra medlemmar, i anslutning till bokning'
								name='note'
								value={booking.note}
								onChange={({ target: { value } }) => updateBooking({ note: value })}
							/>
						</div>
						<NextButton type='submit' loading={submitting} variant={'filled'} sticky={false}>
							Boka
						</NextButton>
					</div>
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
