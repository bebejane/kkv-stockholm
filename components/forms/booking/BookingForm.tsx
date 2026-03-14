'use client';

import s from './BookingForm.module.scss';
import { bookingCreateFormSchema } from '@/lib/schemas/booking';
import { TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Calendar } from '@/components//calendar/Calendar';
import { MemberUserSession } from '@/auth/utils';
import { formatDateTimeRange } from '@/lib/dates';
import { Options } from './Options';
import { Selection } from './Selection';
import { parseErrorMessage } from '@/lib/utils';
import { NextButton } from '@/components/forms/booking/NextButton';
import { useBookingCalendarStore } from '@/components/calendar/hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';
import { SubmitButton } from '@/components/forms/components/SubmitButton';
import { Success } from '@/components/forms/booking/Success';
import Link from 'next/link';

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
	const [selection, setSelection] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.setSelection]),
	);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

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
				update({ id });
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
		setBooking({ ...defaultBooking });
		setSubmitted(false);
		setError(null);
	}

	function update(update: Partial<PreliminaryBooking>) {
		setError(null);

		setBooking((b) => {
			const d = { ...b, ...update };

			return {
				...d,
				complete:
					d.workshop && d.equipment && d.equipment?.length > 0 && d.start && d.end ? true : false,
			};
		});
	}

	useEffect(() => {
		if (!booking.start || !booking.end) setSelection(null);
	}, [booking]);

	useEffect(() => {
		update({
			workshop: allWorkshops.find(({ id }) => id === _workshopId)?.id ?? undefined,
		});
	}, [_workshopId]);

	useEffect(() => {
		update({ start: selection?.[0], end: selection?.[1], confirmed: false });
	}, [selection]);

	if (submitted) return <Success id={booking.id} onReset={reset} />;

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
					empty={'Det finns inga verkstäder tillgängliga'}
					options={allWorkshops.map(({ id, title: label, image }) => ({
						id: id as string,
						label,
						image: image as FileField,
					}))}
					multi={false}
					selected={_workshopId ? [_workshopId] : undefined}
					onChange={(val) => update({ workshop: val?.[0] })}
					onCancel={() =>
						update({
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
						empty={'Det finns ingen bokningsbar utrustning tillgänglig för verkstaden'}
						options={allWorkshops
							.find(({ id }) => id === booking.workshop)
							?.equipment.filter(({ bookable }) => bookable)
							.map(({ id, title: label, image, exclusive }) => ({
								id: id as string,
								label,
								image: image as FileField,
								shared: !exclusive,
							}))}
						multi={true}
						onChange={(equipment) => update({ equipment })}
						onCancel={() =>
							update({ start: undefined, end: undefined, equipment: [], confirmed: false })
						}
					/>
				)}

				{booking.workshop && booking.equipment && booking.equipment.length > 0 && (
					<Selection
						title={'Vald tid'}
						value={booking.start && booking.end && formatDateTimeRange(booking.start, booking.end)}
						help={help?.calendar}
						onCancel={(e) => {
							update({
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
								mode='edit'
							/>
							<NextButton
								type='button'
								sticky={false}
								disabled={!booking.start || !booking.end}
								onClick={() => {
									update({ confirmed: true });
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
								samtidigt{' '}
								<Link href='/om-oss//medlemsregler' target='_blank'>
									bokningsavtalet
								</Link>
								.
							</p>

							<TextInput
								className={s.note}
								label='Meddelande till andra medlemmar, i anslutning till bokning'
								name='note'
								value={booking.note}
								onChange={({ target: { value } }) => update({ note: value })}
							/>
						</div>
						<SubmitButton loading={submitting} submitted={submitted}>
							Boka
						</SubmitButton>
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
