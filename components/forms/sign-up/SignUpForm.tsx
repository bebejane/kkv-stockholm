'use client';

import { Form } from '@/components/forms/Form';
import { Button, TextInput, Select } from '@mantine/core';
import { schema } from './schema';
import { SEXES } from '@/app/constants';

export type SignUpFormProps = {};

export function SignUpForm({}: SignUpFormProps) {
	const initialValues = {
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		phone_home: '',
		sex: '',
		address: '',
		postal_code: '',
		city: '',
		ssa: '',
		card: '',
	};

	return (
		<Form
			endpoint={'/api/sign-up'}
			schema={schema}
			initialValues={initialValues}
			success={{ title: 'Tack!', message: 'Tack för din registrering' }}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput withAsterisk label='Förnamn' {...form.getInputProps('first_name')} />
					<TextInput withAsterisk label='Efternamn' {...form.getInputProps('last_name')} />
					<TextInput withAsterisk label='E-postadress' {...form.getInputProps('email')} />
					<TextInput withAsterisk label='Telefon' {...form.getInputProps('phone')} />
					<TextInput withAsterisk label='Telefon (hem)' {...form.getInputProps('phone_home')} />
					<Select
						{...form.getInputProps('sex')}
						label='Kön'
						data={SEXES.map((value) => ({ value, label: value }))}
						withAsterisk={true}
					/>
					<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
					<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
					<TextInput withAsterisk label='Stad' {...form.getInputProps('city')} />
					<TextInput withAsterisk label='Personnummer' {...form.getInputProps('ssa')} />
					<TextInput withAsterisk label='Kort nummer' {...form.getInputProps('card')} />
					<Button
						type='submit'
						size='lg'
						disabled={submitting}
						fullWidth={true}
						loading={submitting}
						loaderProps={{ size: 'sm' }}
					>
						Skicka in
					</Button>
				</>
			)}
		/>
	);
}
