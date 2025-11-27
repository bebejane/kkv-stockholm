'use client';

import { Button, TextInput, MultiSelect, Select } from '@mantine/core';
import { memberUpdateSchema } from '@/lib/schemas';
import { Form } from '@/components/forms/Form';
import { SEXES } from '@/lib/constants';
import { MemberType } from '@/lib/controller/member';
import { createInitialFormValues } from '@/lib/utils';
import { BsCheckLg } from 'react-icons/bs';
import { SubmitButton } from '@/components/forms/SubmitButton';

export type MemberProfileFormProps = {
	member: MemberType;
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function MemberProfileForm({ member, allWorkshops }: MemberProfileFormProps) {
	if (!member) throw new Error('Member  is required');
	const initialValues = createInitialFormValues(memberUpdateSchema, member);

	return (
		<Form
			endpoint={`/api/member/${member.id}`}
			method='PATCH'
			schema={memberUpdateSchema}
			initialValues={initialValues}
			fields={({ form, submitting, submitted }) => (
				<>
					<TextInput withAsterisk label='Förnamn' {...form.getInputProps('first_name')} />
					<TextInput withAsterisk label='Efternamn' {...form.getInputProps('last_name')} />
					<TextInput withAsterisk label='Telefon' {...form.getInputProps('phone')} />
					<TextInput label='Telefon hem' {...form.getInputProps('phone_home')} />
					<Select
						label='Kön'
						withAsterisk
						data={SEXES.map(({ id: value, label }) => ({ value, label }))}
						{...form.getInputProps('sex')}
					/>
					<TextInput withAsterisk label='Adress' {...form.getInputProps('address')} />
					<TextInput withAsterisk label='Postnummer' {...form.getInputProps('postal_code')} />
					<TextInput withAsterisk label='Stad' {...form.getInputProps('city')} />
					<TextInput withAsterisk label='Personnummer' {...form.getInputProps('ssa')} />
					<MultiSelect
						label='Verkstäder'
						placeholder='Välj verkstäder'
						data={allWorkshops.map(({ id: value, title: label }) => ({ value, label: label ?? '' }))}
						{...form.getInputProps('workshops')}
					/>
					<SubmitButton loading={submitting} submitted={submitted}>
						{submitted ? 'Sparad' : 'Spara'}
					</SubmitButton>
				</>
			)}
		/>
	);
}
