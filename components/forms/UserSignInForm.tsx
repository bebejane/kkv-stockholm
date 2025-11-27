'use client';

import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/forms/Form';
import { userSignInSchema } from '@/lib/schemas';
import { sleep } from 'next-dato-utils/utils';
import { createInitialFormValues } from '@/lib/utils';

export function UserSignInForm() {
	const initialValues = createInitialFormValues(userSignInSchema);
	const router = useRouter();

	const handleSubmit = async (values: typeof initialValues) => {
		const { email, password } = values;
		const { data, error } = await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: (ctx) => {
					router.push('/medlem');
				},
			}
		);
		if (!error) await sleep(1000);
		return { data, error };
	};

	return (
		<Form
			schema={userSignInSchema}
			initialValues={initialValues}
			handleSubmit={handleSubmit}
			fields={({ form, submitting }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<TextInput label='Lösenord' type='password' name='password' {...form.getInputProps('password')} />
					<Button type='submit' disabled={submitting} loading={submitting}>
						Logga in
					</Button>
				</>
			)}
		/>
	);
}
