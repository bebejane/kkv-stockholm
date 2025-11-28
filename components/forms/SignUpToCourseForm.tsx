'use client';

import { Form } from '@/components/forms/Form';
import { TextInput, Switch } from '@mantine/core';
import { signUpToCourseSchema } from '@/lib/schemas/course';
import { createInitialFormValues } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/SubmitButton';

export type SignUpFormProps = {
	courseId: string;
};

export function SignUpToCourseForm({ courseId }: SignUpFormProps) {
	if (!courseId) throw new Error('courseId is required');
	const initialValues = createInitialFormValues(signUpToCourseSchema, { member: false, course_id: courseId });

	return (
		<Form
			endpoint={'/api/sign-up-to-course'}
			method='POST'
			schema={signUpToCourseSchema}
			initialValues={initialValues}
			message={{ title: 'Tack!', text: 'Tack för din anmälan' }}
			fields={({ form, submitting, submitted }) => (
				<>
					<TextInput withAsterisk label='Förnamn' {...form.getInputProps('first_name')} />
					<TextInput withAsterisk label='Efternamn' {...form.getInputProps('last_name')} />
					<TextInput withAsterisk label='E-postadress' {...form.getInputProps('email')} />
					<TextInput withAsterisk label='Telefon' {...form.getInputProps('phone')} />
					<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
					<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
					<TextInput withAsterisk label='Stad' {...form.getInputProps('city')} />
					<Switch label='Medlem i KKV' {...form.getInputProps('member')} style={{ alignSelf: 'flex-end' }} />
					<TextInput withAsterisk type='hidden' {...form.getInputProps('course_id')} />
					<SubmitButton loading={submitting} submitted={submitted}>
						Skicka in anmälan
					</SubmitButton>
				</>
			)}
		/>
	);
}
