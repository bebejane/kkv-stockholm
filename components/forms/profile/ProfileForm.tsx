'use client';

import { Button, TextInput, MultiSelect, Select } from '@mantine/core';
import { schema } from './schema';
import { Form } from '@/components/forms/Form';
import { SEXES } from '@/lib/constants';
import { Member, Workshop } from '@/types/schema';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

export type ProfileFormProps = {
	member: Item<Member>;
	workshops: Item<Workshop>[];
};

export function ProfileForm({ member, workshops }: ProfileFormProps) {
	if (!member) throw new Error('Member  is required');

	const initialValues = schema.keyof().options.reduce((acc, key) => {
		!acc[key] && (acc[key] = member[key]);
		return acc;
	}, {} as any);

	console.log(initialValues);
	return (
		<Form
			key='same'
			endpoint='/api/profile'
			schema={schema}
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
						data={SEXES.map((value) => ({ value, label: value }))}
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
						size='lg'
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
