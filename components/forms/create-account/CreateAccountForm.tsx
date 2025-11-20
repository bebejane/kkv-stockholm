'use client';

import { Button, TextInput, Input } from '@mantine/core';
import { schema } from './schema';
import { Form } from '@/components/forms/Form';

export type CreateAccountFormProps = {
	token: string;
};

export function CreateAccountForm({ token }: CreateAccountFormProps) {
	if (!token) throw new Error('Token  is required');

	const initialValues = schema.keyof().options.reduce(
		(acc, key) => {
			!acc[key] && (acc[key] = '');
			return acc;
		},
		{ token } as any
	);

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
					<Button type='submit' disabled={submitting} loading={submitting}>
						Skicka
					</Button>
				</>
			)}
		/>
	);
}
