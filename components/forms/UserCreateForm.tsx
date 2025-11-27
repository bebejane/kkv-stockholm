'use client';

import { Button, TextInput, Input } from '@mantine/core';
import { userCreateSchema } from '@/lib/schemas';
import { Form } from '@/components/forms/Form';
import { createInitialFormValues } from '@/lib/utils';

export type UserCreateFormProps = {
	token: string;
};

export function UserCreateForm({ token }: UserCreateFormProps) {
	if (!token) throw new Error('Token is required');
	const initialValues = createInitialFormValues(userCreateSchema, { token });

	return (
		<Form
			endpoint='/api/create-account'
			method='POST'
			schema={userCreateSchema}
			initialValues={initialValues}
			message={{
				title: 'Tack!',
				text: 'Nu har du skapat ditt konto. Verfierea din e-post för att aktivera ditt konto.',
			}}
			fields={({ form, submitting }) => (
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
					<Input type='hidden' name='token' {...form.getInputProps('token')} style={{ display: 'none' }} />
					<Button type='submit' disabled={submitting} loading={submitting}>
						Skapa konto
					</Button>
				</>
			)}
		/>
	);
}
