'use client';

import { useState } from 'react';
import { Button, PasswordInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { userResetPasswordSchema } from '@/lib/schemas';
import { z } from 'zod';
import { authClient } from '@/auth/auth-client';

export type UserResetPasswordFormProps = {
	token: string;
};

export function UserResetPasswordForm({ token }: UserResetPasswordFormProps) {
	if (!token) throw new Error('Token is required');

	const initialValues = userResetPasswordSchema.keyof().options.reduce((acc, key) => {
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
		const password = formData.get('password') as string;
		const password_confirmation = formData.get('password_confirmation') as string;

		try {
			userResetPasswordSchema.parse({ password, password_confirmation });
		} catch (e) {
			setError((e as z.ZodError).issues[0].message);
			setLoading(false);
			return;
		}
		console.log('reset password');
		await authClient.resetPassword(
			{ newPassword: password, token },
			{
				onRequest: (ctx) => setLoading(true),
				onSuccess: (ctx) => setSuccess(true),
				onError: (ctx) => setError(ctx.error.message),
				onResponse: (ctx) => {
					setLoading(false);
				},
			}
		);
	};

	return (
		<Form
			onSubmit={handleSubmit}
			schema={userResetPasswordSchema}
			initialValues={initialValues}
			error={error}
			success={success}
			message={{ text: 'Ditt lösenord har uppdaterats.' }}
			fields={({ form, submitting, reset }) => (
				<>
					<PasswordInput label='Nytt lösenord' name='password' {...form.getInputProps('password')} />
					<PasswordInput
						label='Bekräfta lösenord'
						name='password_confirmation'
						{...form.getInputProps('password_confirmation')}
					/>
					<Button type='submit' disabled={loading} loading={loading}>
						Spara lösenord
					</Button>
				</>
			)}
		/>
	);
}
