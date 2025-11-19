'use client';

import { Button, TextInput } from '@mantine/core';
import { schema } from './schema';
import { Form } from '@/components/forms/Form';

export type CreateAccountFormProps = {
	token: string;
};

export function CreateAccountForm({ token }: CreateAccountFormProps) {
	if (!token) throw new Error('Token  is required');

	const initialValues = {
		email: '',
		password: '',
		password_confirmation: '',
		token: '',
	};

	return (
		<Form
			endpoint='/api/create-account'
			schema={schema}
			initialValues={initialValues}
			success={{ title: 'Tack!', message: 'Nu har du skapat ditt konto' }}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput withAsterisk label='E-postadress' {...form.getInputProps('email')} />
					<TextInput withAsterisk label='Lösenord' {...form.getInputProps('password')} />
					<TextInput withAsterisk label='Upprepa lösenord' {...form.getInputProps('passsword_confirmation')} />
					<TextInput type='hidden' {...form.getInputProps('token')} value={token} />
					<Button
						type='submit'
						size='lg'
						disabled={submitting}
						fullWidth={true}
						loading={submitting}
						loaderProps={{ size: 'sm' }}
					>
						Skicka
					</Button>
				</>
			)}
		/>
	);
}
