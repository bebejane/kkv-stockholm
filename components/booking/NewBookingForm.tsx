'use client';

import s from './NewBookingForm.module.scss';
import { Image } from 'react-datocms';
import { bookingCreateSchema } from '@/lib/schemas';
import { Button, Radio, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect, useState } from 'react';
import { BookingCalender } from './BookingCalender';

export type NewBookingFormProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
	workshopId?: string;
};

export default function NewBookingForm({ allWorkshops, workshopId }: NewBookingFormProps) {
	const initialValues = bookingCreateSchema.keyof().options.reduce(
		(acc, key) => {
			!acc[key] && (acc[key] = '');
			return acc;
		},
		{
			workshop: workshopId ?? undefined,
		} as any
	);

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<typeof initialValues>({
		mode: 'controlled',
		initialValues,
		cascadeUpdates: true,
		validate: zod4Resolver(bookingCreateSchema),
	});

	const values = form.getValues();

	async function handleSubmit(e: React.FormEvent) {
		e?.preventDefault();

		setError(null);
		setSubmitting(true);
		setSubmitted(false);

		try {
			const { hasErrors, errors } = form.validate();

			if (hasErrors) {
				throw new Error(JSON.stringify(errors));
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : (e as string));
			return;
		}

		try {
			const body = JSON.stringify(form.values);
			const res = await fetch('/api/booking', {
				body,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (res.status === 200) setSubmitted(true);
			else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			const message = e instanceof Error ? e.message : (e as string);
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	useEffect(() => {
		console.log('change');
	}, [values]);

	const workshop = allWorkshops.find(({ id }) => id === values.workshop);
	const equipment = workshop?.equipment.find(({ id }) => id === values.equipment);

	return (
		<>
			<form className={s.form} onSubmit={handleSubmit} method='POST'>
				{!workshop ? (
					<>
						<header>
							<h3>Välj verkstad</h3>
							<Button variant='transparent'>Hjälp</Button>
						</header>
						<fieldset className={s.workshops}>
							{allWorkshops.map(({ id, title, image }) => (
								<label key={id}>
									<input type='radio' {...form.getInputProps('workshop')} name='workshop' value={id} />
									<figure>
										{image?.responsiveImage && <Image data={image.responsiveImage} />}
										<figcaption className='mid'>{title}</figcaption>
									</figure>
								</label>
							))}
						</fieldset>
					</>
				) : (
					<header>
						<h3>Verkstad: {workshop.title}</h3>
						<Button variant='transparent' onClick={() => form.setFieldValue('workshop', null)}>
							Ångra
						</Button>
					</header>
				)}

				{workshop && !equipment ? (
					<>
						<header>
							<h3>Välj utrusting</h3>
							<Button variant='transparent'>Hjälp</Button>
						</header>
						<fieldset className={s.equipment}>
							{workshop.equipment.map(({ id, title, image }) => (
								<label key={id}>
									<input type='radio' {...form.getInputProps('equipment')} name='equipment' value={id} />
									<figure>
										{image?.responsiveImage && <Image data={image.responsiveImage} />}
										<figcaption className='mid'>{title}</figcaption>
									</figure>
								</label>
							))}
						</fieldset>
					</>
				) : equipment ? (
					<>
						<header>
							<h3>Utrusting: {equipment.title}</h3>
							<Button variant='transparent' onClick={() => form.setFieldValue('equipment', null)}>
								Ångra
							</Button>
						</header>
					</>
				) : null}
				{workshop && equipment && <BookingCalender workshop={workshop} equipment={equipment} />}
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
