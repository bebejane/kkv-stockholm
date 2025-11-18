'use client';

import s from './SignUpCourseForm.module.scss';
import cn from 'classnames';
import { Button, TextInput, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { schema } from './schema';
import { zod4Resolver } from 'mantine-form-zod-resolver';

type FormValues = {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	address: string;
	postal_code: string;
	city: string;
	member: boolean;
	course_id: string;
};

export type SignUpFormProps = {
	courseId: string;
};

export function SignUpCourseForm({ courseId }: SignUpFormProps) {
	if (!courseId) throw new Error('courseId is required');

	const initialValues = {
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		address: '',
		postal_code: '',
		city: '',
		member: false,
		course_id: courseId,
	};

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const form = useForm<FormValues>({
		mode: 'controlled',
		initialValues,
		validate: zod4Resolver(schema),
	});

	function reset() {
		setError(null);
		setSuccess(false);
		form.reset();
		form.setValues(initialValues);
	}

	function scrollToField(field: string) {
		document.querySelector(`[data-path='${field}']`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	async function handleSubmit(e: React.FormEvent) {
		e?.preventDefault();

		try {
			let { hasErrors, errors } = form.validate();

			if (hasErrors) {
				scrollToField(Object.keys(errors).pop() as string);
				return;
			}
		} catch (e) {
			console.log(e);
			return;
		}

		setSubmitting(true);
		setError(null);
		setSuccess(false);

		try {
			const res = await fetch('/api/sign-up-course', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form.values),
			});
			if (res.status === 200) setSuccess(true);
			else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			const message = e instanceof Error ? e.message : (e as string);
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<>
			<form className={s.form} onSubmit={handleSubmit}>
				<TextInput withAsterisk label='Förstanamn' {...form.getInputProps('first_name')} />
				<TextInput withAsterisk label='Efternamn' {...form.getInputProps('last_name')} />
				<TextInput withAsterisk label='E-postadress' {...form.getInputProps('email')} />
				<TextInput withAsterisk label='Telefon' {...form.getInputProps('phone')} />
				<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
				<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
				<TextInput withAsterisk label='Stad' {...form.getInputProps('city')} />
				<Switch label='Medlem i KKV' {...form.getInputProps('member')} />
				<TextInput withAsterisk type='hidden' {...form.getInputProps('course_id')} />
				<Button
					type='submit'
					size='lg'
					disabled={submitting}
					fullWidth={true}
					loading={submitting}
					loaderProps={{ size: 'sm' }}
					className={cn(s.submit, s.button)}
				>
					Skicka in
				</Button>
				{error && (
					<>
						<div className={s.error}>{error}</div>
					</>
				)}
			</form>
			{success && (
				<div className={s.success}>
					<h3>Tack!</h3>
				</div>
			)}
		</>
	);
}
