'use client';

import { authClient } from '@/auth/auth-client';
import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/forms/Form';
import { schema } from './schema';

export function SignInForm() {
	const initialValues = schema.keyof().options.reduce((acc, key) => {
		!acc[key] && (acc[key] = '');
		return acc;
	}, {} as any);

	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
				onRequest: (ctx) => {
					setLoading(true);
				},
				onSuccess: (ctx) => {
					setTimeout(() => {
						router.push('/medlem');
					});
				},
				onError: (ctx) => {
					console.log(ctx.error);
					setError(ctx.error.message);
					setLoading(false);
				},
			}
		);
	};

	return (
		<Form
			schema={schema}
			initialValues={initialValues}
			onSubmit={handleSubmit}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<TextInput label='Lösenord' type='password' name='password' {...form.getInputProps('password')} />
					<Button type='submit' disabled={submitting} loading={submitting || loading}>
						Logga in
					</Button>
					{error && <p>{error}</p>}
				</>
			)}
		/>
	);
}
