'use client';

import { authClient } from '@/auth/auth-client';
import { Form } from '@/components/forms/Form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AdminLogoutForm() {
	const router = useRouter();

	const handleSubmit = async (values: any) => {
		authClient
			.signOut()
			.catch((e) => console.log(e))
			.finally(() => router.push('/admin/logga-in'));
	};

	useEffect(() => {
		handleSubmit({} as any);
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
