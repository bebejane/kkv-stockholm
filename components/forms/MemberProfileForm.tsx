'use client';

import { Button, TextInput, MultiSelect, Select } from '@mantine/core';
import { memberUpdateSchema } from '@/lib/schemas';
import { Form } from '@/components/forms/Form';
import { SEXES } from '@/lib/constants';
import { Member, Workshop } from '@/types/datocms';
import { Item } from '@/lib/client';

export type MemberProfileFormProps = {
	member: Item<Member>;
	workshops: Item<Workshop>[];
};

export function MemberProfileForm({ member, workshops }: MemberProfileFormProps) {
	if (!member) throw new Error('Member  is required');

	const initialValues = memberUpdateSchema.keyof().options.reduce((acc, key) => {
		!acc[key] && (acc[key] = member[key]);
		return acc;
	}, {} as any);

	return (
		<Form
			endpoint={`/api/member/${member.id}`}
			method='PATCH'
			schema={memberUpdateSchema}
			initialValues={initialValues}
			fields={({ form, submitting }) => (
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
					<TextInput withAsterisk label='Kortnummer' {...form.getInputProps('card_number')} />
					<TextInput label='Kompartement' {...form.getInputProps('compartment')} />
					<MultiSelect
						label='Verkstäder'
						placeholder='Välj verkstäder'
						data={workshops.map(({ id: value, title: label }) => ({ value, label }))}
						{...form.getInputProps('workshops')}
					/>
					<Button
						type='submit'
						disabled={submitting}
						fullWidth={true}
						loading={submitting}
						loaderProps={{ size: 'sm' }}
					>
						Spara
					</Button>
				</>
			)}
		/>
	);
}
