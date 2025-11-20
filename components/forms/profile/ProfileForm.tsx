'use client';

import { Button, TextInput, MultiSelect, Select } from '@mantine/core';
import { schema } from './schema';
import { Form } from '@/components/forms/Form';
import { SEXES } from '@/app/constants';

export type ProfileFormProps = {
	member: MemberQuery['member'];
	allWorskhops: AllWorkshopsQuery['allWorkshops'];
};

export function ProfileForm({ member, allWorskhops }: ProfileFormProps) {
	if (!member) throw new Error('Member  is required');

	const initialValues = {
		first_name: member.firstName,
		last_name: member.lastName,
		phone: member.phone,
		phone_home: member.phoneHome,
		sex: member.sex,
		address: member.address,
		postal_code: member.postalCode,
		city: member.city,
		ssa: member.ssa,
		card_number: member.cardNumber,
		compartment: member.compartment,
		workshops: member.workshops.map(({ id }) => id),
	};
	console.log(allWorskhops);

	return (
		<Form
			key={JSON.stringify(initialValues)}
			endpoint='/api/profile'
			schema={schema}
			initialValues={initialValues}
			fields={({ form, submitting, reset }) => (
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
						data={allWorskhops.map(({ id: value, title: label }) => ({ value, label }))}
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
