'use client';

import s from './AbortButton.module.scss';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { parseErrorMessage } from '@/lib/utils';
import { useState } from 'react';

export type AbortButtonProps = {
	id: string;
	disabled?: boolean;
};

export default function AbortButton({ id, disabled }: AbortButtonProps) {
	const [loading, setLoading] = useState(false);
	const [aborted, setAborted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setAborted(false);
		setError(null);

		try {
			const res = await fetch(`/api/member/booking/${id}/abort`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});

			if (res.status === 200) setAborted(true);
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
		<form name='abort' method='POST' onSubmit={handleSubmit} className={s.abort}>
			<SubmitButton loading={loading} submitted={aborted} disabled={disabled || aborted}>
				Avboka
			</SubmitButton>
			{error && <p className='error'>{error}</p>}
		</form>
	);
}
