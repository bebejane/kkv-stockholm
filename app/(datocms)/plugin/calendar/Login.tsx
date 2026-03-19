'use client';
import s from './Login.module.scss';
import { authClient } from '@/auth/auth-client';
import DotLoader from '@/components/common/DotLoader';
import { Button, TextInput } from '@mantine/core';
import { useState } from 'react';

export function Login() {
	const { data: session, error, isPending } = authClient.useSession();
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			setLoading(true);
			const { data, error } = await authClient.signIn.email({
				email,
				password,
			});
			console.log('login', data, error);
			return { data, error };
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className={s.login}>
			{!isPending ? (
				<form onSubmit={handleSubmit}>
					<TextInput label='E-post' type='email' name='email' />
					<TextInput label='Lösenord' type='password' name='password' />
					<br />
					<Button type='submit' fullWidth={true} loading={loading}>
						Logga in
					</Button>
				</form>
			) : (
				<DotLoader />
			)}
		</div>
	);
}
