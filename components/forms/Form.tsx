import s from './Form.module.scss';
import cn from 'classnames';
import { useForm, UseFormReturnType } from '@mantine/form';
import React, { useEffect, useRef, useState } from 'react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { set, z } from 'zod';
import { APIError } from 'better-auth';

export type FormSubmitHandler = (
	e: React.FormEvent<HTMLFormElement>
) => Promise<{ data?: any; error?: any; formErrors?: FormErrors } | void>;
export type FormErrors = Record<string, React.ReactNode>;
export type FormProps = {
	endpoint?: string;
	method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	schema: any;
	initialValues: any;
	message?: {
		title?: string;
		text?: string;
		modal?: boolean;
	};
	className?: string;
	handleSubmit?: FormSubmitHandler;
	onSubmitted?: () => void;
	fields: ({
		form,
		submitting,
	}: {
		form: UseFormReturnType<any, (values: any) => any>;
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
	handleSubmit: _handleSubmit,
	onSubmitted,
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

	function reset() {
		setError(null);
		setSubmitted(false);
		form.reset();
		form.setValues(initialValues);
	}

	function scrollToField(field: string) {
		document.querySelector(`[data-path='${field}']`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	const submit: FormSubmitHandler = async (e) => {
		setSubmitted(false);
		setError(null);
		setSubmitting(true);
		const res = await (_handleSubmit ?? handleSubmit)(e);

		if (res?.formErrors) {
			scrollToField(Object.keys(res.formErrors).pop() as string);
			setSubmitting(false);
			return;
		} else {
			Object.keys(form.values).filter((key) => form.setDirty({ [key]: false }));
		}
		if (res?.error) {
			if (res.error instanceof Error) setError(res.error.message);
			if (typeof res.error === 'object' && res.error.message) setError(res.error.message);
			else if (typeof res.error === 'string') setError(res.error);
			else setError(JSON.stringify(res.error, null, 2));
		}

		setSubmitted(true);
		setSubmitting(false);
		onSubmitted?.();
		return;
	};

	const handleSubmit: FormSubmitHandler = async (e) => {
		e?.preventDefault();

		try {
			if (!endpoint || !method) throw new Error('endpoint or method is required');
			let { hasErrors, errors } = form.validate();

			if (hasErrors) return { formErrors: errors };

			abortControllerRef.current?.abort('AbortControllerError');
			abortControllerRef.current = new AbortController();

			const body = JSON.stringify(form.values);

			console.log('submit form', { endpoint, method, body });

			const res = await fetch(endpoint, {
				method,
				body,
				signal: abortControllerRef.current.signal,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (res.status === 200) return { data: await res.json() };
			else return { error: `Något gick fel: ${res.status} - ${res.statusText}` };
		} catch (e) {
			if (e !== 'AbortControllerError') {
				const message = e instanceof Error ? e.message : (e as string);
				return { error: message };
			}
		}
		return;
	};

	return (
		<>
			<form className={cn(s.form, submitting && s.submitting, className)} onSubmit={submit}>
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
