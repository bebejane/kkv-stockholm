'use client';

import s from './SignUpForm.module.scss';
import cn from 'classnames';
import { Button, TextInput, Switch, Select, Space, Collapse } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { schema } from './schema';
import { zod4Resolver } from 'mantine-form-zod-resolver';

type FormValues = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	password_confirmation: string;
	phone: string;
	phone_home: string;
	sex: string;
	address: string;
	postal_code: string;
	city: string;
	ssa: string;
	card: string;
	compartment: string;
	notes: string;
	departments: string;
};

const initialValues = {
	first_name: '',
	last_name: '',
	email: '',
	password: '',
	password_confirmation: '',
	phone: '',
	phone_home: '',
	sex: '',
	address: '',
	postal_code: '',
	city: '',
	ssa: '',
	card: '',
	compartment: '',
	notes: '',
	departments: '',
};

export type SignUpFormProps = {};

export function SignUpForm({}: SignUpFormProps) {
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
			const res = await fetch('/api/sign-up', {
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
				<TextInput withAsterisk label='Lösenord' type='password' {...form.getInputProps('password')} />
				<TextInput
					withAsterisk
					label='Bekräfta lösenord'
					type='password'
					{...form.getInputProps('password_confirmation')}
				/>
				<TextInput withAsterisk label='Telefon' {...form.getInputProps('phone')} />
				<TextInput withAsterisk label='Telefon (hem)' {...form.getInputProps('phone_home')} />
				<Select
					{...form.getInputProps('sex')}
					label='Kön'
					data={['Man', 'Kvinna', 'Okänd'].map((value) => ({ value, label: value }))}
					withAsterisk={true}
				/>
				<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
				<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
				<TextInput withAsterisk label='Stad' {...form.getInputProps('city')} />
				<TextInput withAsterisk label='Personnummer' {...form.getInputProps('ssa')} />
				<TextInput withAsterisk label='Kort nummer' {...form.getInputProps('card')} />
				<TextInput withAsterisk label='Kompartement' {...form.getInputProps('compartment')} />
				<TextInput withAsterisk label='Anmälan' {...form.getInputProps('notes')} />
				<TextInput withAsterisk label='Avdelningar' {...form.getInputProps('departments')} />
				<Button
					type='submit'
					size='lg'
					disabled={submitting}
					className={cn(s.submit, s.button)}
					fullWidth={true}
					loading={submitting}
					loaderProps={{ size: 'sm' }}
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
