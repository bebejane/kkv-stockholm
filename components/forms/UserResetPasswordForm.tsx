'use client';

import { Button, PasswordInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { userResetPasswordSchema } from '@/lib/schemas';
import { z } from 'zod';
import { authClient } from '@/auth/auth-client';
import { createInitialFormValues } from '@/lib/utils';

export type UserResetPasswordFormProps = {
	token: string;
};

export function UserResetPasswordForm({ token }: UserResetPasswordFormProps) {
	if (!token) throw new Error('Token is required');
	const initialValues = createInitialFormValues(userResetPasswordSchema);

	const handleSubmit = async (values: any) => {
		try {
			const { password, password_confirmation } = values;
			userResetPasswordSchema.parse({ password, password_confirmation });
			const res = await authClient.resetPassword({ newPassword: password, token });
			console.log(res);
			return res;
		} catch (e) {
			console.log(e);
			return { error: (e as z.ZodError).issues[0].message };
		}
	};

	return (
		<Form
			schema={userResetPasswordSchema}
			method='POST'
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
						Uppdatera lösenord
					</Button>
				</>
			)}
		/>
	);
}
