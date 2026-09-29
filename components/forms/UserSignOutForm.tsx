'use client';

import { Form } from '@/components/forms/Form';
import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function UserSignOutForm() {
	const router = useRouter();

	const handleSubmit = async (values: any) => {
		authClient
			.signOut()
			.catch((e) => console.log(e))
			.finally(() => router.push('/logga-in'));
	};

	useEffect(() => {
		handleSubmit({} as any);
		// Intentionally run once on mount (visiting /medlem/logga-ut signs out).
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Form
			schema={null}
			initialValues={{}}
			handleSubmit={handleSubmit}
			fields={({ form }) => <></>}
		/>
	);
}
