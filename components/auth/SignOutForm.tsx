'use client';

import s from './SignOutForm.module.scss';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

export function SignOutForm() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		authClient
			.signOut()
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className={s.signOut}>
			{loading && <p>Signing out...</p>}
			{error && <p>{error}</p>}
		</div>
	);
}
