'use client';
import { authClient } from '@/auth/auth-client';
import { Button, TextInput } from '@mantine/core';

export function Login() {
	const { data: session, error, isPending } = authClient.useSession();
	console.log(session);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			const { data, error } = await authClient.signIn.email({
				email,
				password,
			});
			console.log('login', data, error);
			return { data, error };
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<TextInput label='E-post' type='email' name='email' />
			<TextInput label='Lösenord' type='password' name='password' />
			<Button type='submit'>Logga in</Button>
		</form>
	);
}
