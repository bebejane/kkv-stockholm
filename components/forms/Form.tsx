import s from './Form.module.scss';
import cn from 'classnames';
import { useForm, UseFormReturnType } from '@mantine/form';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { parseErrorMessage } from '@/lib/utils';

export type FormProps<Values extends Record<string, any>> = {
	ref?: RefObject<any | null>;
	endpoint?: string;
	method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	schema: any;
	initialValues: Values;
	className?: string;
	message?: {
		title?: string;
		text?: string;
		modal?: boolean;
	};
	handleSubmit?: (
		values: Values
	) => Promise<{ data?: any; error?: any; formErrors?: FormErrors } | void>;
	transformValues?: (values: Values) => Promise<Values>;
	onSubmitted?: (data?: any) => void;
	fields: ({
		form,
		submitting,
	}: {
		form: UseFormReturnType<Values, (values: any) => any>;
		submitting: boolean;
		submitted: boolean;
		reset: () => void;
	}) => React.ReactNode | React.ReactNode[];
};

export type FormErrors = Record<string, React.ReactNode>;

export function Form<Values extends Record<string, any>>({
	ref,
	endpoint,
	method,
	schema,
	initialValues,
	className,
	message,
	handleSubmit: _handleSubmit,
	onSubmitted,
	fields,
}: FormProps<Values>) {
	const form = useForm<Values>({
		mode: 'controlled',
		initialValues,
		validate: zod4Resolver(schema as z.infer<typeof schema>),
	});

	if (ref) ref.current = form;

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const reset = () => {
		setError(null);
		setSubmitted(false);
		form.reset();
		form.setValues(initialValues);
	};

	const scrollToField = (field: string) => {
		document
			.querySelector(`[data-path='${field}']`)
			?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	const submit = async (values: typeof initialValues) => {
		setSubmitted(false);
		setError(null);
		setSubmitting(true);
		console.log(values);
		const res = await (_handleSubmit ?? handleSubmit)(values);

		if (res?.formErrors) {
			const field = Object.keys(res.formErrors).pop();

			setSubmitting(false);
			return;
		}

		if (res?.error) {
			if (res.error instanceof Error) setError(res.error.message);
			if (typeof res.error === 'object' && res.error.message) setError(res.error.message);
			else if (typeof res.error === 'string') setError(res.error);
			else setError(JSON.stringify(res.error, null, 2));
		} else {
			Object.keys(form.values).filter((key) => form.setDirty({ [key]: false }));
		}

		setSubmitted(true);
		setSubmitting(false);
		onSubmitted?.(res?.data);
		return;
	};

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			if (!endpoint || !method) throw new Error('endpoint or method is required');

			console.log('Form', 'submit form', values);

			const { hasErrors, errors } = form.validate();
			if (hasErrors) {
				const field = Object.keys(errors).pop() as string;
				scrollToField(field);
				setSubmitted(false);
				return { formErrors: errors };
			}

			abortControllerRef.current?.abort('AbortControllerError');
			abortControllerRef.current = new AbortController();

			const body = JSON.stringify(form.values);
			const res = await fetch(endpoint, {
				method,
				body,
				signal: abortControllerRef.current.signal,
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();
			if (res.status === 200) return { data };
			else return { error: data?.message ?? 'Något gick fel' };
		} catch (e) {
			if (e !== 'AbortControllerError') {
				const message = parseErrorMessage(e);
				return { error: message };
			}
		}
		return;
	};

	const errorHandler = (errors: any) => {
		console.log('Form', 'values', form.values);
		console.log('Form', 'error values', errors);
		scrollToField(Object.keys(errors).pop() as string);
		setSubmitted(false);
	};

	useEffect(() => {
		setSubmitted(false);
	}, [form.values]);

	return (
		<>
			<form
				className={cn(s.form, submitting && s.submitting, className)}
				onSubmit={form.onSubmit(submit, errorHandler)}
			>
				{fields({ form, submitting, submitted, reset })}
				<div className={cn(s.alert, s.error, error && s.show)}>
					<div className={s.wrap}>
						<h3>Ett fel uppstod</h3>
						<p>{error}</p>
					</div>
					<button type='button' className={s.close} onClick={() => setError(null)}>
						Stäng
					</button>
				</div>
				<div className={cn(s.alert, s.success, submitted && message && s.show)}>
					<div className={s.wrap}>
						{message?.title && <h3>{message.title}</h3>}
						{message?.text && <p>{message.text}</p>}
					</div>
					<button type='button' className={s.close} onClick={() => reset()}>
						Stäng
					</button>
				</div>
			</form>
		</>
	);
}
