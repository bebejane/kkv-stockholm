'use client';

import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';
import { Form } from '@/components/forms/Form';
import { userSignInSchema } from '@/lib/schemas/user';
import { sleep } from 'next-dato-utils/utils';
import { createInitialFormValues, parseErrorMessage } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/components/SubmitButton';

type UserSignInFormProps = {
	className?: string;
	callbackUrl?: string;
};

export function UserSignInForm({ className, callbackUrl: _callbackUrl }: UserSignInFormProps) {
	const initialValues = createInitialFormValues(userSignInSchema);

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			const redirect = new URL(window.location.href).searchParams.get('redirect');
			const callbackURL = redirect ?? _callbackUrl ?? '/medlem';
			const { email, password } = values;
			const { data, error } = await authClient.signIn.email({
				email,
				password,
				callbackURL,
			});
			if (!error) await sleep(1000);
			if (error?.code === 'INVALID_EMAIL_OR_PASSWORD')
				error.message = 'E-post eller lösenord är felaktigt';
			return { data, error };
		} catch (e) {
			return { error: parseErrorMessage(e) };
		}
	};

	return (
		<Form
			schema={userSignInSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			className={className}
			fields={({ form, submitting, submitted }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<TextInput
						label='Lösenord'
						type='password'
						name='password'
						{...form.getInputProps('password')}
					/>
					<SubmitButton disabled={submitting} loading={submitting} submitted={submitted}>
						Logga in
					</SubmitButton>
				</>
			)}
		/>
	);
}
