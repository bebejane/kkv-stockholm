'use client';

import s from './SignOutForm.module.scss';
import { Form } from '@/components/common/Form';
import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SignOutForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e?.preventDefault?.();

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
	}
	useEffect(() => {
		handleSubmit({} as any);
	}, []);

	return (
		<Form
			schema={null}
			initialValues={{}}
			error={error}
			onSubmit={handleSubmit}
			className={s.signOut}
			fields={({ form }) => <div>Loggar ut...</div>}
		/>
	);
}
