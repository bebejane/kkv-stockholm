'use client';

import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { Form } from '@/components/forms/Form';
import { userSignInSchema } from '@/lib/schemas/user';
import { sleep } from 'next-dato-utils/utils';
import { createInitialFormValues, parseErrorMessage } from '@/lib/utils';

export function UserSignInForm() {
	const initialValues = createInitialFormValues(userSignInSchema);
	const callbackURL = useSearchParams().get('redirect') ?? '/medlem';

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			const { email, password } = values;
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
			schema={userSignInSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			fields={({ form, submitting }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<TextInput
						label='Lösenord'
						type='password'
						name='password'
						{...form.getInputProps('password')}
					/>
					<Button type='submit' disabled={submitting} loading={submitting}>
						Logga in
					</Button>
				</>
			)}
		/>
	);
}
