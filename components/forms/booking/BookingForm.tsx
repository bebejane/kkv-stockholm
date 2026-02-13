'use client';

import s from './BookingForm.module.scss';
import { bookingCreateFormSchema } from '@/lib/schemas/booking';
import { Button, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Calendar } from './calendar/Calendar';
import { MemberUserSession } from '@/auth/utils';
import { formatDateTimeRange } from '@/lib/dates';
import { Options } from './Options';
import { Selection } from './Selection';
import { parseErrorMessage } from '@/lib/utils';
import Link from 'next/link';

export type NewBookingFormProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
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

export function BookingForm({ allWorkshops, workshopId: _workshopId }: NewBookingFormProps) {
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const defaultBooking = {
		//workshop: 'PPWL4_hJTKGNaEqopTKHrQ',
		//equipment: ['JBpKE72vTxqk1RSMFqig9w'],
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
			//console.log('submit booking', booking);

			const data = bookingCreateFormSchema.parse(booking);

			const res = await fetch('/api/member/booking', {
				body: JSON.stringify(data),
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (res.status === 200) {
				const { id } = await res.json();
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
	}

	useEffect(() => {
		updateBooking({
			workshop: allWorkshops.find(({ id }) => id === _workshopId)?.id ?? undefined,
		});
	}, [_workshopId]);

	if (submitted)
		return (
			<section className={s.success}>
				<h3>Tack för din bokning!</h3>
				<p className={s.success}>
					Du har fått ett mail med en bekräftelse på bokningen. Där hittar du också all information
					om hur rapporterar tid och kostnader.
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
					help='Hjälp text verkstad...'
					options={allWorkshops.map(({ id, title: label, image }) => ({
						id: id as string,
						label,
						image: image as FileField,
					}))}
					multi={false}
					selected={_workshopId ? [_workshopId] : undefined}
					onChange={(val) => updateBooking({ workshop: val?.[0] })}
					onCancel={() => updateBooking({ workshop: undefined })}
				/>
				{booking.workshop && (
					<Options
						title='Utrustning'
						help='Hjälp text utrustning...'
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
						onCancel={() => updateBooking({ equipment: undefined })}
					/>
				)}

				{booking.workshop && booking.equipment && booking.equipment.length > 0 && (
					<Selection
						title={'Vald tid'}
						value={booking.start && booking.end && formatDateTimeRange(booking.start, booking.end)}
						help='Hjälp text vald tid...'
						onCancel={() => {
							updateBooking({
								start: undefined,
								end: undefined,
								equipment: undefined,
								confirmed: false,
								note: '',
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
								onSelection={(start, end) => updateBooking({ start: start ?? undefined, end })}
							/>
							<Button
								type='button'
								variant='outline'
								className={s.next}
								disabled={!booking.start || !booking.end}
								onClick={() => updateBooking({ confirmed: true })}
							>
								Gå vidare
							</Button>
						</>
					)}

				{isComplete && (
					<div className={s.complete}>
						<h3>Slutför bokning</h3>
						<div>
							<p>
								Granska att uppgifterna ovan stämmer. När du klickar på boka tiden så godkänner du
								samtidigt bokningsavtalet.
							</p>

							<TextInput
								className={s.note}
								label='Meddelande till andra medlemmar, i anslutning till bokning'
								name='note'
								value={booking.note}
								onChange={({ target: { value } }) => updateBooking({ note: value })}
							/>
						</div>
						<Button type='submit' loading={submitting} fullWidth={true}>
							Boka
						</Button>
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
