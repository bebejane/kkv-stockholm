'use client';

import { Button, PasswordInput } from '@mantine/core';
import { Form, FormSubmitHandler } from '@/components/forms/Form';
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

	const handleSubmit: FormSubmitHandler = async (e) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const password = formData.get('password') as string;
		const password_confirmation = formData.get('password_confirmation') as string;

		try {
			userResetPasswordSchema.parse({ password, password_confirmation });
			return await authClient.resetPassword({ newPassword: password, token });
		} catch (e) {
			return { error: (e as z.ZodError).issues[0].message };
		}
	};

	return (
		<Form
			schema={userResetPasswordSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			message={{ text: 'Ditt lösenord har uppdaterats.' }}
			fields={({ form, submitting }) => (
				<>
					<PasswordInput label='Nytt lösenord' name='password' {...form.getInputProps('password')} />
					<PasswordInput
						label='Bekräfta lösenord'
						name='password_confirmation'
						{...form.getInputProps('password_confirmation')}
					/>
					<Button type='submit' disabled={submitting} loading={submitting}>
						Spara lösenord
					</Button>
				</>
			)}
		/>
	);
}
