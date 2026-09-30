import s from './Form.module.scss';
import cn from 'classnames';
import { useForm, UseFormReturnType } from '@mantine/form';
import React, { RefObject, useImperativeHandle, useRef, useState } from 'react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { set, z } from 'zod';
import { parseErrorMessage } from '@/lib/utils';
import { useKey } from 'react-use';

export type FormProps<Values extends Record<string, any>> = {
	id?: string;
	ref?: RefObject<any | null>;
	disabled?: boolean;
	endpoint?: string;
	method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	schema: any;
	initialValues: Values;
	className?: string;
	message?: {
		title?: string;
		text?: string | React.ReactNode | React.ReactNode[];
		unclosable?: boolean;
	};
	handleSubmit?: (
		values: Values,
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
	id,
	ref,
	disabled,
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
	const [submitted, setSubmitted] = useState<boolean>(false);

	const form = useForm<Values>({
		mode: 'controlled',
		initialValues,
		validate: zod4Resolver(schema as z.infer<typeof schema>),
		// Reset the "submitted" flag whenever the values change (replaces an effect).
		onValuesChange: () => setSubmitted(false),
	});

	useImperativeHandle(ref, () => form, [form]);

	const [submitting, setSubmitting] = useState<boolean>(false);
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
		try {
			const res = await (_handleSubmit ?? handleSubmit)(values);

			if (res?.formErrors) return;

			if (res?.error) {
				if (res.error instanceof Error) setError(res.error.message);
				if (typeof res.error === 'object' && res.error.message) setError(res.error.message);
				else if (typeof res.error === 'string') setError(res.error);
				else setError(JSON.stringify(res.error, null, 2));
			} else {
				Object.keys(form.values).filter((key) => form.setDirty({ [key]: false }));
				setSubmitted(true);
				onSubmitted?.(res?.data);
			}
		} catch (e) {
			setError(parseErrorMessage(e));
		} finally {
			setSubmitting(false);
		}
	};

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			if (!endpoint || !method) throw new Error('endpoint or method is required');

			const { hasErrors, errors } = form.validate();

			if (hasErrors) {
				const field = Object.keys(errors).pop() as string;
				scrollToField(field);
				setSubmitted(false);
				return { formErrors: errors };
			}

			abortControllerRef.current?.abort('AbortControllerError');
			abortControllerRef.current = new AbortController();

			const parsed = schema.parse(form.values);
			const body = JSON.stringify(parsed);
			const res = await fetch(endpoint, {
				method,
				body,
				signal: abortControllerRef.current.signal,
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();
			if (res.ok && !data?.error) return { data };
			else return { error: data?.error ?? data?.message ?? 'Något gick fel' };
		} catch (e) {
			if (e !== 'AbortControllerError') {
				const message = parseErrorMessage(e);
				return { error: message };
			}
		}
		return;
	};

	const handleCloseError = () => {
		setError(null);
	};

	const errorHandler = (errors: any) => {
		scrollToField(Object.keys(errors).pop() as string);
		setSubmitted(false);
	};

	useKey('Escape', handleCloseError);

	// `form.onSubmit` wraps the handlers; calling it happens in the event, not during render.
	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		form.onSubmit(submit, errorHandler)(event);
	};

	return (
		<>
			<form
				id={id}
				className={cn(s.form, submitting && s.submitting, className)}
				onSubmit={handleFormSubmit}
				data-disabled={disabled ? '' : undefined}
			>
				{fields({ form, submitting, submitted, reset })}
				<div className={cn(s.alert, s.error, error && s.show)}>
					<div className={s.wrap}>
						<h3>Ett fel uppstod</h3>
						<p>{error}</p>
					</div>
					<button type='button' className={s.close} onClick={handleCloseError}>
						Stäng
					</button>
				</div>
				<div className={cn(s.alert, s.success, submitted && message && s.show)}>
					<div className={s.wrap}>
						{message?.title && <h3>{message.title}</h3>}
						{message?.text && <p>{message.text}</p>}
					</div>
					{message?.unclosable !== true && (
						<button type='button' className={s.close} onClick={() => reset()}>
							Stäng
						</button>
					)}
				</div>
			</form>
		</>
	);
}
