'use client';

import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Form, FormSubmitHandler } from '@/components/forms/Form';
import { userSignInSchema } from '@/lib/schemas';

export function UserSignInForm() {
	const initialValues = userSignInSchema.keyof().options.reduce((acc, key) => {
		!acc[key] && (acc[key] = '');
		return acc;
	}, {} as any);

	const router = useRouter();

	const handleSubmit: FormSubmitHandler = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

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
