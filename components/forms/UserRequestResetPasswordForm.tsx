'use client';

import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';
import { Form, FormSubmitHandler } from '@/components/forms/Form';
import { userRequestResetPasswordSchema } from '@/lib/schemas';
import { z } from 'zod';

export function UserRequestResetPasswordForm() {
	const initialValues = userRequestResetPasswordSchema.keyof().options.reduce((acc, key) => {
		!acc[key] && (acc[key] = '');
		return acc;
	}, {} as any);

	const handleSubmit: FormSubmitHandler = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get('email') as string;
		try {
			userRequestResetPasswordSchema.parse({ email });
		} catch (e) {
			return { error: (e as z.ZodError).issues[0].message };
		}

		const { data, error } = await authClient.requestPasswordReset({
			email,
			redirectTo: '/nytt-losenord',
		});
		return { data, error };
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
						Återställ lösenord
					</Button>
				</>
			)}
		/>
	);
}
