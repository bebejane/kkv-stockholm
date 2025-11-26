'use client';

import s from './BookingForm.module.scss';
import { Image } from 'react-datocms';
import { bookingCreateSchema } from '@/lib/schemas';
import { Button, Radio, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect, useState } from 'react';
import { Calender } from './Calender';
import { MemberUserSession } from '@/auth/utils';
import { set } from 'zod';

export type NewBookingFormProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
	workshopId?: string;
	session: MemberUserSession;
};

export function BookingForm({ allWorkshops, workshopId: _workshopId }: NewBookingFormProps) {
	const initialValues: {
		workshop?: string;
		equipment: string[];
	} = {
		workshop: _workshopId ?? undefined,
		equipment: [],
	};

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [workshop, setWorkshop] = useState<NonNullable<AllWorkshopsQuery['allWorkshops'][0]> | null>(null);
	const [equipment, setEquipment] = useState<AllWorkshopsQuery['allWorkshops'][0]['equipment'] | null>(null);

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

	function handleNext() {
		const workshop = allWorkshops.find(({ id }) => id === values.workshop);
		const equipment =
			allWorkshops
				?.find(({ id }) => id === values.workshop)
				?.equipment.filter(({ id }) => values.equipment.includes(id)) ?? [];
		setWorkshop(workshop ?? null);
		setEquipment(equipment.length > 0 ? equipment : null);
	}

	useEffect(() => {
		!values.workshop && setWorkshop(null);
		!values.equipment.length && setEquipment(null);
	}, [values]);

	useEffect(() => {
		const workshop = allWorkshops.find(({ id }) => id === _workshopId);
		setWorkshop(workshop ?? null);
	}, [_workshopId]);

	return (
		<>
			<form className={s.form} onSubmit={handleSubmit} method='POST'>
				{workshop ? (
					<header>
						<h3>Verkstad: {workshop.title}</h3>
						<Button
							variant='transparent'
							onClick={() => {
								form.setFieldValue('equipment', []);
								form.setFieldValue('workshop', '');
							}}
						>
							Ångra
						</Button>
					</header>
				) : (
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
				)}
				{equipment ? (
					<>
						<header>
							<h3>Utrusting: {equipment?.map(({ title }) => title).join(', ')}</h3>
							<Button
								variant='transparent'
								onClick={() => {
									form.setFieldValue('equipment', []);
								}}
							>
								Ångra
							</Button>
						</header>
					</>
				) : workshop ? (
					<>
						<header>
							<h3>Välj utrusting</h3>
							<Button variant='transparent'>Hjälp</Button>
						</header>
						<fieldset className={s.equipment}>
							{workshop.equipment.map(({ id, title, image }, idx) => (
								<label key={id}>
									<input
										type='checkbox'
										{...form.getInputProps(`equipment.${idx}`)}
										name='equipment'
										value={id}
										onChange={({ target }) => {
											const ids = form.getValues().equipment;
											form.setFieldValue(
												'equipment',
												ids.includes(id) ? ids.filter((id) => id !== target.value) : [...ids, target.value]
											);
										}}
									/>
									<figure>
										{image?.responsiveImage && <Image data={image.responsiveImage} />}
										<figcaption className='mid'>{title}</figcaption>
									</figure>
								</label>
							))}
						</fieldset>
					</>
				) : null}
				{workshop && equipment && <Calender workshopId={workshop.id} equipmentIds={equipment?.map(({ id }) => id)} />}
				<Button type='button' variant='outline' onClick={handleNext} className={s.next}>
					Gå vidare
				</Button>
				{/* <Button type='submit' variant='outline'>
					Boka
				</Button> */}
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
