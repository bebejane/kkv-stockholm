'use client';

import s from './SignOutForm.module.scss';
import { authClient } from '@/auth/auth-client';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SignOutForm() {
	const router = useRouter();
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
				router.push('/logga-in');
			});
	}, []);

	return (
		<div className={s.signOut}>
			{loading && <p>Loggar ut...</p>}
			{error && <p>{error}</p>}
		</div>
	);
}
