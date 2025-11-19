import s from './Form.module.scss';
import cn from 'classnames';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import classNames from 'classnames';

export type FormProps = {
	className?: string;
	endpoint?: string;
	schema: any;
	initialValues: any;
	success?: {
		title?: string;
		message?: string;
	};
	error?: string | null;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
	fields: ({
		form,
		submitting,
	}: {
		form: any;
		submitting: boolean;
		reset: () => void;
	}) => React.ReactNode | React.ReactNode[];
};

export function Form({
	schema,
	initialValues,
	endpoint,
	success,
	fields,
	onSubmit,
	error: _error,
	className,
}: FormProps) {
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<typeof initialValues>({
		mode: 'controlled',
		initialValues,
		validate: zod4Resolver(schema as z.infer<typeof schema>),
	});

	function reset() {
		setError(null);
		setSubmitted(false);
		form.reset();
		form.setValues(initialValues);
	}

	function scrollToField(field: string) {
		document.querySelector(`[data-path='${field}']`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	async function handleSubmit(e: React.FormEvent) {
		e?.preventDefault();

		if (!endpoint) throw new Error('endpoint is required');

		try {
			let { hasErrors, errors } = form.validate();

			if (hasErrors) {
				scrollToField(Object.keys(errors).pop() as string);
				return;
			}
		} catch (e) {
			console.log(e);
			return;
		}

		setError(null);
		setSubmitting(true);
		setSubmitted(false);

		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form.values),
			});
			if (res.status === 200) setSubmitted(true);
			else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			const message = e instanceof Error ? e.message : (e as string);
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	useEffect(() => {
		// Error from child component
		setError(_error ?? null);
	}, [_error]);

	return (
		<>
			<form className={cn(s.form, className)} onSubmit={onSubmit ?? handleSubmit}>
				{fields({ form, submitting, reset })}
			</form>
			{error && (
				<div className={s.error}>
					<h3>Ett fel uppstod</h3>
					<p>{error}</p>
				</div>
			)}
			{submitted && success && (
				<div className={s.success}>
					{success.title && <h3>{success.title}</h3>}
					{success.message && <p>{success.message}</p>}
				</div>
			)}
		</>
	);
}
