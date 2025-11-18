'use client';
import s from './SignInForm.module.scss';
import { authClient } from '@/auth/auth-client';
import { useState } from 'react';
import { Button, Input } from '@mantine/core';
import { useRouter } from 'next/navigation';

export function SignInForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
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
		<div className={s.signIn}>
			<form onSubmit={handleSubmit}>
				<Input id='email' name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
				<Input
					id='password'
					name='password'
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button type='submit' loading={loading}>
					Logga in
				</Button>
			</form>
			{error && <p>{error}</p>}
		</div>
	);
}
