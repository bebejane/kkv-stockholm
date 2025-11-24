'use client';

import s from './UserSignOutForm.module.scss';
import { Form, FormSubmitHandler } from '@/components/forms/Form';
import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function UserSignOutForm() {
	const router = useRouter();

	const handleSubmit: FormSubmitHandler = async (e) => {
		e?.preventDefault?.();
		authClient
			.signOut()
			.catch((e) => console.log(e))
			.finally(() => router.push('/logga-in'));
	};

	useEffect(() => {
		handleSubmit({} as any);
	}, []);
	s;

	return <Form schema={null} initialValues={{}} handleSubmit={handleSubmit} fields={({ form }) => <></>} />;
}
