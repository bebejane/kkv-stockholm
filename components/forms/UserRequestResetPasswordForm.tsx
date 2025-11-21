'use client';

import { authClient } from '@/auth/auth-client';
import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { userRequestResetPasswordSchema } from '@/lib/schemas';
import { z } from 'zod';

export function UserRequestResetPasswordForm() {
	const initialValues = userRequestResetPasswordSchema.keyof().options.reduce((acc, key) => {
		!acc[key] && (acc[key] = '');
		return acc;
	}, {} as any);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		setSuccess(false);
		setError(null);

		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get('email') as string;
		console.log('email', email);
		try {
			userRequestResetPasswordSchema.parse({ email });
		} catch (e) {
			setError((e as z.ZodError).issues[0].message);
			setLoading(false);
			return;
		}

		await authClient.requestPasswordReset(
			{
				email,
				redirectTo: '/nytt-losenord',
			},
			{
				onRequest: (ctx) => setLoading(true),
				onSuccess: (ctx) => setSuccess(true),
				onError: (ctx) => {
					console.log(ctx);
					setError(ctx.error.message);
				},
				finally: () => {
					setLoading(false);
				},
			}
		);
	};
	console.log(success);

	return (
		<Form
			schema={userRequestResetPasswordSchema}
			initialValues={initialValues}
			error={error}
			success={success}
			onSubmit={handleSubmit}
			message={{
				text: 'Vi har skickat ett mail till dig med instruktioner för att återställa ditt lösenord.',
			}}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<Button type='submit' disabled={loading} loading={loading}>
						Återställ lösenord
					</Button>
				</>
			)}
		/>
	);
}
