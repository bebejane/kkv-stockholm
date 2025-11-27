'use client';

import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { userRequestResetPasswordSchema } from '@/lib/schemas';
import { z } from 'zod';
import { createInitialFormValues } from '@/lib/utils';

export function UserRequestResetPasswordForm() {
	const initialValues = createInitialFormValues(userRequestResetPasswordSchema);

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			userRequestResetPasswordSchema.parse(values);
		} catch (e) {
			return { error: (e as z.ZodError).issues[0].message };
		}

		const { data, error } = await authClient.requestPasswordReset({
			email: values.email,
			redirectTo: '/nytt-losenord',
		});
		return { data: data?.message, error: error?.message };
	};

	return (
		<Form
			schema={userRequestResetPasswordSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			message={{
				text: 'Vi har skickat ett mail till dig med instruktioner för att återställa ditt lösenord.',
			}}
			fields={({ form, submitting }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<Button type='submit' disabled={submitting} loading={submitting}>
						Skicka
					</Button>
				</>
			)}
		/>
	);
}
