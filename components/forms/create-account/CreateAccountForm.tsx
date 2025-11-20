'use client';

import { Button, TextInput, Input } from '@mantine/core';
import { schema } from './schema';
import { Form } from '@/components/forms/Form';

export type CreateAccountFormProps = {
	token: string;
};

export function CreateAccountForm({ token }: CreateAccountFormProps) {
	if (!token) throw new Error('Token  is required');

	const initialValues = {
		password: '',
		password_confirmation: '',
		token,
	};

	return (
		<Form
			key={JSON.stringify(initialValues)}
			endpoint='/api/create-account'
			schema={schema}
			initialValues={initialValues}
			success={{ title: 'Tack!', message: 'Nu har du skapat ditt konto' }}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput
						withAsterisk
						type='password'
						label='Lösenord'
						autoComplete='new'
						{...form.getInputProps('password')}
					/>
					<TextInput
						withAsterisk
						type='password'
						label='Upprepa lösenord'
						autoComplete='new'
						{...form.getInputProps('password_confirmation')}
					/>
					<Input type='hidden' name='token' {...form.getInputProps('token')} />
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
