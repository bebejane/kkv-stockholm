'use client';

import s from './UserSignOutForm.module.scss';
import { Form, FormSubmitHandler } from '@/components/forms/Form';
import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/common/Loader';

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

	return (
		<Form
			schema={null}
			initialValues={{}}
			handleSubmit={handleSubmit}
			className={s.signOut}
			fields={({ form }) => <Loader message={'Loggar ut...'} />}
		/>
	);
}
