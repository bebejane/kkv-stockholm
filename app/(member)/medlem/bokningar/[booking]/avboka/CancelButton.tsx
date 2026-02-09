'use client';

import s from './CancelButton.module.scss';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { parseErrorMessage } from '@/lib/utils';
import { useState } from 'react';

export default function CancelForm({ id }: { id: string }) {
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setSubmitted(false);
		setError(null);

		try {
			const res = await fetch(`/api/member/booking/${id}/cancel`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});

			if (res.status === 200) setSubmitted(true);
			else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			console.log(e);
			const message = parseErrorMessage(e);
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form name='cancel' method='POST' onSubmit={handleSubmit} className={s.cancel}>
			<SubmitButton loading={loading} submitted={submitted}>
				Avboka
			</SubmitButton>
		</form>
	);
}
