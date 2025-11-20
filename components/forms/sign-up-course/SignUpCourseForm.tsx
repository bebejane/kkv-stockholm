'use client';

import { Form } from '@/components/forms/Form';
import { Button, TextInput, Switch } from '@mantine/core';
import { schema } from './schema';

export type SignUpFormProps = {
	courseId: string;
};

export function SignUpCourseForm({ courseId }: SignUpFormProps) {
	if (!courseId) throw new Error('courseId is required');

	const initialValues = {
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		address: '',
		postal_code: '',
		city: '',
		member: false,
		course_id: courseId,
	};

	return (
		<Form
			endpoint={'/api/sign-up-course'}
			schema={schema}
			initialValues={initialValues}
			success={{ title: 'Tack!', message: 'Tack för din registrering' }}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput withAsterisk label='Förstanamn' {...form.getInputProps('first_name')} />
					<TextInput withAsterisk label='Efternamn' {...form.getInputProps('last_name')} />
					<TextInput withAsterisk label='E-postadress' {...form.getInputProps('email')} />
					<TextInput withAsterisk label='Telefon' {...form.getInputProps('phone')} />
					<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
					<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
					<TextInput withAsterisk label='Stad' {...form.getInputProps('city')} />
					<Switch label='Medlem i KKV' {...form.getInputProps('member')} />
					<TextInput withAsterisk type='hidden' {...form.getInputProps('course_id')} />
					<Button
						type='submit'
						size='lg'
						fullWidth={true}
						disabled={submitting}
						loading={submitting}
						loaderProps={{ size: 'sm' }}
					>
						Skicka in
					</Button>
				</>
			)}
		/>
	);
}
