'use client';

import { PasswordInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { userResetPasswordSchema } from '@/lib/schemas/user';
import { authClient } from '@/auth/auth-client';
import { createInitialFormValues, parseErrorMessage } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/components/SubmitButton';

export type UserCreateFormProps = {
	token: string;
};

/**
 * First-time account setup. Uses better-auth's password-reset token (sent in
 * the "create your account" email) to set the member's password.
 */
export function UserCreateForm({ token }: UserCreateFormProps) {
	if (!token) throw new Error('Token is required');
	const initialValues = createInitialFormValues(userResetPasswordSchema);

	const handleSubmit = async (values: any) => {
		try {
			const { password, password_confirmation } = values;
			userResetPasswordSchema.parse({ password, password_confirmation });

			const { error } = await authClient.resetPassword({ newPassword: password, token });
			if (error) return { error: error.message };

			return { data: true };
		} catch (e) {
			return { error: parseErrorMessage(e) };
		}
	};

	return (
		<Form
			schema={userResetPasswordSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			message={{
				title: 'Tack!',
				text: 'Nu har du skapat ditt konto. Du kan nu logga in.',
				unclosable: true,
			}}
			fields={({ form, submitting, submitted }) => (
				<>
					<PasswordInput
						withAsterisk
						label='Lösenord'
						autoComplete='new-password'
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						withAsterisk
						label='Upprepa lösenord'
						autoComplete='new-password'
						{...form.getInputProps('password_confirmation')}
					/>
					<SubmitButton disabled={submitting} loading={submitting} submitted={submitted}>
						Skapa konto
					</SubmitButton>
				</>
			)}
		/>
	);
}
