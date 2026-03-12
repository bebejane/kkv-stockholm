'use client';

import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { userRequestResetPasswordSchema } from '@/lib/schemas/user';
import { z } from 'zod';
import { createInitialFormValues, parseErrorMessage } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/components/SubmitButton';

export function UserRequestResetPasswordForm() {
	const initialValues = createInitialFormValues(userRequestResetPasswordSchema);

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			userRequestResetPasswordSchema.parse(values);

			const { data, error } = await authClient.requestPasswordReset({
				email: values.email,
				redirectTo: '/nytt-losenord',
			});
			return { data: data?.message, error: error?.message };
		} catch (e) {
			return { error: parseErrorMessage(e) };
		}
	};

	return (
		<Form
			schema={userRequestResetPasswordSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			message={{
				text: 'Vi har skickat ett mail till dig med instruktioner för att återställa ditt lösenord.',
			}}
			fields={({ form, submitting, submitted }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<SubmitButton disabled={submitting} loading={submitting} submitted={submitted}>
						Skicka
					</SubmitButton>
				</>
			)}
		/>
	);
}
