'use client';

import { authClient } from '@/auth/auth-client';
import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/common/Form';
import { schema } from './schema';

export function SignInForm() {
	const initialValues = {
		email: '',
		password: '',
	};
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(e.target);

		const formData = new FormData(e.target as HTMLFormElement);
		console.log(formData.keys());
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		console.log({ email, password });
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
			onSubmit={handleSubmit}
			schema={schema}
			initialValues={initialValues}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput label='E-post' type='email' name='email' {...form.getInputProps('email')} />
					<TextInput label='Lösenord' type='password' name='password' {...form.getInputProps('password')} />
					<Button
						type='submit'
						size='lg'
						disabled={submitting}
						fullWidth={true}
						loading={submitting || loading}
						loaderProps={{ size: 'sm' }}
					>
						Logga in
					</Button>
					{error && <p>{error}</p>}
				</>
			)}
		/>
	);
}
