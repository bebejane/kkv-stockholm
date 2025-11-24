'use client';

import { Form } from '@/components/forms/Form';
import { Button, TextInput, Select } from '@mantine/core';
import { memberSignUpSchema } from '@/lib//schemas';
import { SEXES } from '@/lib/constants';

export type MemberSignUpFormProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function MemberSignUpForm({ allWorkshops }: MemberSignUpFormProps) {
	const initialValues = memberSignUpSchema.keyof().options.reduce((acc, key) => {
		!acc[key] && (acc[key] = '');
		return acc;
	}, {} as any);

	return (
		<Form
			endpoint={'/api/member'}
			method='POST'
			schema={memberSignUpSchema}
			initialValues={initialValues}
			message={{ title: 'Tack!', text: 'Tack för din registrering' }}
			fields={({ form, submitting, reset }) => (
				<>
					<TextInput withAsterisk label='Förnamn' {...form.getInputProps('first_name')} />
					<TextInput withAsterisk label='Efternamn' {...form.getInputProps('last_name')} />
					<TextInput withAsterisk label='E-postadress' {...form.getInputProps('email')} />
					<TextInput withAsterisk label='Telefon' {...form.getInputProps('phone')} />
					<TextInput label='Telefon (hem)' {...form.getInputProps('phone_home')} />
					<Select
						{...form.getInputProps('sex')}
						label='Kön'
						data={SEXES.map(({ id: value, label }) => ({ value, label }))}
						withAsterisk={true}
					/>
					<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
					<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
					<TextInput withAsterisk label='Stad' {...form.getInputProps('city')} />
					<TextInput withAsterisk label='Personnummer' {...form.getInputProps('ssa')} />
					<Button type='submit' disabled={submitting} loading={submitting}>
						Skicka in
					</Button>
				</>
			)}
		/>
	);
}
