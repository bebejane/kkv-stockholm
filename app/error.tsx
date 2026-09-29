'use client';

import s from './error.module.scss';
import { ErrorProps } from 'next/error';
import Link from 'next/link';

export type NextError = ErrorProps & { digest?: string; message?: string };

export type Props = {
	code?: number;
	error?: NextError;
	message?: string;
	reset?: () => void;
};

export default function Error({ error, code, message, reset }: Props) {
	// App Router errors carry a `digest`, not a `statusCode`.
	const errorCode = code ?? 0;

	return (
		<div className={s.error}>
			<h1>Något gick fel!</h1>
			<p className={s.message}>
				{errorCode > 0 && <span>{errorCode}: </span>}
				{message ?? error?.message ?? 'Ett oväntat fel uppstod'}
			</p>
			{error?.digest && <div className={s.digest}>#{error.digest}</div>}
			{reset ? (
				<button onClick={reset}>Försök igen</button>
			) : (
				<Link href='/'>Till startsidan</Link>
			)}
		</div>
	);
}
