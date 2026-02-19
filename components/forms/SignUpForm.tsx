'use client';

import { Form } from '@/components/forms/Form';
import { TextInput, Select, MultiSelect, Textarea, Switch } from '@mantine/core';
import { memberSignUpSchema } from '@/lib/schemas/member';
import { createInitialFormValues } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/SubmitButton';
import s from './SignUpForm.module.scss';



export type SignUpFormProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function SignUpForm({ allWorkshops }: SignUpFormProps) {
	const initialValues = createInitialFormValues(memberSignUpSchema, {
		workshops: [],
		portfolio: '',
		education: '',
		artistic_practice: '',
		rules_accepted: false,
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
					<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
					<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
					<TextInput withAsterisk label='Ort' {...form.getInputProps('city')} />
					<TextInput
						withAsterisk
						label='Personnummer (ÅÅMMDDXXXX)'
						{...form.getInputProps('ssa')}
					/>
					<TextInput
						label='Länk till portfolio, hemsida eller Instagram (Inkl http://)'
						{...form.getInputProps('portfolio')}
					/>
					<MultiSelect
						label='Verkstäder som du har erfarenhet av och planerar att arbeta med.'
						placeholder='Välj verkstäder'
						data={allWorkshops.map(({ id: value, title: label }) => ({
							value,
							label: label ?? '',
						}))}
						{...form.getInputProps('workshops')}
					/>
					<Textarea placeholder={"Utbildning 1, examensår\nUtbildning 2, examensår\nOsv"} label='Utbildning' {...form.getInputProps('education')} rows={3} />
					<Textarea label='Konstnärlig praktik' rows={3} placeholder="Beskriv kortfattat och i punktform din konstnärliga verksamhet, exempelvis utställningar, gestaltningsuppdrag eller andra konstnärliga uppdrag." {...form.getInputProps('artistic_practice')} minRows={3} />

					<Switch
						className={s.approve}
						label='Jag intygar att de uppgifter jag lämnat är korrekta, samt att jag tagit del av KKV Stockholms medlemsregler och stadgar och förbinder mig att följa dessa.'
						{...form.getInputProps('rules_accepted')}
					/>
					<SubmitButton loading={submitting} submitted={submitted}>
						Skicka in
					</SubmitButton>
				</>
			)}
		/>
	);
}
