'use client';

import { Form } from '@/components/forms/Form';
import { TextInput, Select, MultiSelect, Textarea } from '@mantine/core';
import { memberSignUpSchema } from '@/lib//schemas/member';
import { SEXES } from '@/lib/constants';
import { createInitialFormValues } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/SubmitButton';

export type SignUpFormProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function SignUpForm({ allWorkshops }: SignUpFormProps) {
	const initialValues = createInitialFormValues(memberSignUpSchema, {
		workshops: [],
		portfolio: '',
		references: '',
		education: '',
		artistic_practice: '',
	});

	return (
		<Form
			endpoint={'/api/member'}
			method='POST'
			schema={memberSignUpSchema}
			initialValues={initialValues}
			message={{ title: 'Tack!', text: 'Vi återkommer när vi granskat din ansökan.' }}
			fields={({ form, submitting, submitted }) => (
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
					<TextInput withAsterisk label='Personnummer (12 siffror)' {...form.getInputProps('ssa')} />
					<TextInput
						label='Länk till portfolio, hemsida eller instagram (Inkl http://)'
						{...form.getInputProps('portfolio')}
					/>
					<TextInput
						label='Namn & telefon till personliga referenser (gärna medlem i KKV)'
						{...form.getInputProps('references')}
					/>
					<Textarea
						label='Utbildning'
						{...form.getInputProps('education')}
					/>
					<Textarea
						label='Konstnärlig praktik'
						{...form.getInputProps('artistic_practice')}
					/>
					<MultiSelect
						label='Verkstäder'
						placeholder='Välj verkstäder'
						data={allWorkshops.map(({ id: value, title: label }) => ({ value, label: label ?? '' }))}
						{...form.getInputProps('workshops')}
					/>
					<SubmitButton loading={submitting} submitted={submitted}>
						Skicka in
					</SubmitButton>
				</>
			)}
		/>
	);
}
