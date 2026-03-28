'use client';

import { authClient } from '@/auth/auth-client';
import { TextInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { adminSignInSchema, userSignInSchema } from '@/lib/schemas/user';
import { sleep } from 'next-dato-utils/utils';
import { createInitialFormValues, parseErrorMessage } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/components/SubmitButton';

type AdminLoginFormProps = {
	className?: string;
};

export function AdminLoginForm({ className }: AdminLoginFormProps) {
	const initialValues = createInitialFormValues(adminSignInSchema);

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			const redirect = new URL(window.location.href).searchParams.get('redirect');
			const callbackURL = redirect ?? '/admin';
			const { admin_email: email, admin_password: password } = values;
			const { data, error } = await authClient.signIn.email({
				email,
				password,
				callbackURL,
			});

			if (!error) await sleep(1000);
			return { data, error };
		} catch (e) {
			return { error: parseErrorMessage(e) };
		}
	};

	return (
		<Form
			id='admin-login'
			schema={adminSignInSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			className={className}
			fields={({ form, submitting, submitted }) => (
				<>
					<TextInput
						label='E-post'
						type='email'
						name='admin_email'
						{...form.getInputProps('admin_email')}
					/>
					<TextInput
						label='Lösenord'
						type='password'
						name='admin_password'
						{...form.getInputProps('admin_password')}
					/>
					<SubmitButton disabled={submitting} loading={submitting} submitted={submitted}>
						Logga in
					</SubmitButton>
				</>
			)}
		/>
	);
}
