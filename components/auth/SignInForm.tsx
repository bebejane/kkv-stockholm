'use client';
import s from './SignInForm.module.scss';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

export function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { data, error } = await authClient.signIn.email(
			{
				email, // user email address
				password, // user password -> min 8 characters by default
				callbackURL: '/member', // A URL to redirect to after the user verifies their email (optional)
			},
			{
				onRequest: (ctx) => {
					setLoading(true);
				},
				onSuccess: (ctx) => {
					//redirect to the dashboard or sign in page
					setLoading(false);
				},
				onError: (ctx) => {
					console.log(ctx.error);
					// display the error message
					setError(ctx.error.message);
					setLoading(false);
				},
			}
		);
	};

	return (
		<div className={s.signIn}>
			<form onSubmit={handleSubmit}>
				<label htmlFor='email'>Email</label>
				<input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
				{error && <p>{error}</p>}
				<label htmlFor='password'>Password</label>
				<input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type='submit'>Sign In</button>
			</form>
			{loading && <p>Loading...</p>}
			{error && <p>{error}</p>}
		</div>
	);
}
