import s from './Form.module.scss';
import cn from 'classnames';
import { useForm } from '@mantine/form';
import React, { useEffect, useRef, useState } from 'react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { set, z } from 'zod';

export type FormProps = {
	endpoint?: string;
	method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	schema: any;
	initialValues: any;
	message?: {
		title?: string;
		text?: string;
	};
	error?: string | null;
	success?: boolean;
	className?: string;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
	onSubmitted?: (data: any) => void;
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
	endpoint,
	method,
	schema,
	initialValues,
	message,
	fields,
	onSubmit,
	onSubmitted,
	error: _error,
	success,
	className,
}: FormProps) {
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const form = useForm<typeof initialValues>({
		mode: 'controlled',
		initialValues,
		validate: zod4Resolver(schema as z.infer<typeof schema>),
	});

	useEffect(() => {
		typeof success !== 'undefined' && setSubmitted(success);
		typeof _error !== 'undefined' && setError(_error);
	}, [_error, success, submitted]);

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

		setError(null);
		setSubmitted(false);

		try {
			if (!endpoint || !method) throw new Error('endpoint or method is required');
			let { hasErrors, errors } = form.validate();

			if (hasErrors) {
				scrollToField(Object.keys(errors).pop() as string);
				console.log('submit form errors:', form.values, { hasErrors, errors });
				return;
			}
		} catch (e) {
			console.log(e);
			return;
		}

		try {
			abortControllerRef.current?.abort('AbortControllerError');
			abortControllerRef.current = new AbortController();

			const body = JSON.stringify(form.values);

			setSubmitting(true);

			console.log('submit form', { endpoint, method, body });
			const res = await fetch(endpoint, {
				method,
				body,
				signal: abortControllerRef.current.signal,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (res.status === 200) {
				setSubmitted(true);
				onSubmitted && onSubmitted(res.json());
			} else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			if (e === 'AbortControllerError') return;
			const message = e instanceof Error ? e.message : (e as string);
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<>
			<form className={cn(s.form, submitting && s.submitting, className)} onSubmit={onSubmit ?? handleSubmit}>
				{fields({ form, submitting, reset })}
				<div className={cn(s.alert, s.error, error && s.show)}>
					<div className={s.wrap}>
						<h3>Ett fel uppstod</h3>
						<p>{error}</p>
						<button type='button' className={s.close} onClick={() => setError(null)}>
							Stäng
						</button>
					</div>
				</div>
				<div className={cn(s.alert, s.success, submitted && message && s.show)}>
					<div className={s.wrap}>
						{message?.title && <h3>{message.title}</h3>}
						{message?.text && <p>{message.text}</p>}
						<button type='button' className={s.close} onClick={() => reset()}>
							Stäng
						</button>
					</div>
				</div>
			</form>
		</>
	);
}
