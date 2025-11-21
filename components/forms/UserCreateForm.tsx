'use client';

import { Button, TextInput, Input } from '@mantine/core';
import { userCreateSchema } from '@/lib/schemas';
import { Form } from '@/components/forms/Form';

export type UserCreateFormProps = {
	token: string;
};

export function UserCreateForm({ token }: UserCreateFormProps) {
	if (!token) throw new Error('Token  is required');

	const initialValues = userCreateSchema.keyof().options.reduce(
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
			schema={userCreateSchema}
			initialValues={initialValues}
			message={{
				title: 'Tack!',
				text: 'Nu har du skapat ditt konto. Verfierea din e-post för att aktivera ditt konto.',
			}}
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
