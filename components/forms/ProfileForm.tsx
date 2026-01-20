'use client';

import { TextInput, Select } from '@mantine/core';
import { memberUpdateSchema } from '@/lib/schemas/member';
import { Form } from '@/components/forms/Form';
import { SEXES } from '@/lib/constants';
import { MemberType } from '@/lib/controllers/member';
import { createInitialFormValues } from '@/lib/utils';
import { SubmitButton } from '@/components/forms/SubmitButton';

export type ProfileFormProps = {
	member: MemberType;
};

export function ProfileForm({ member }: ProfileFormProps) {
	if (!member) throw new Error('Member  is required');
	const initialValues = createInitialFormValues(memberUpdateSchema, {
		...member,
		// Keep workshops unchanged; the profile form no longer edits this field.
		workshops: (member as any).workshops ?? [],
	});

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
					<SubmitButton loading={submitting} submitted={submitted}>
						{submitted ? 'Sparad' : 'Spara'}
					</SubmitButton>
				</>
			)}
		/>
	);
}
