'use client';

import { TextInput, Input } from '@mantine/core';
import { userCreateSchema } from '@/lib/schemas/user';
import { Form } from '@/components/forms/Form';
import { createInitialFormValues } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/components/SubmitButton';

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
				text: 'Nu har du skapat ditt konto. Verifiera din e-post adress för att aktivera ditt konto.',
				unclosable: true,
			}}
			fields={({ form, submitting, submitted }) => (
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
					<Input
						type='hidden'
						name='token'
						{...form.getInputProps('token')}
						style={{ display: 'none' }}
					/>
					<SubmitButton disabled={submitting} loading={submitting} submitted={submitted}>
						Skapa konto
					</SubmitButton>
				</>
			)}
		/>
	);
}
