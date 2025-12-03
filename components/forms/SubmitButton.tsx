'use client';

import { Button } from '@mantine/core';
import { BsCheckLg } from 'react-icons/bs';

export type SubmitButtonProps = {
	children: React.ReactNode;
	loading: boolean;
	disabled?: boolean;
	submitted: boolean;
};

export function SubmitButton({ children, loading, submitted, disabled }: SubmitButtonProps) {
	return (
		<Button type='submit' loading={loading} disabled={disabled}>
			{submitted ? (
				<>
					<BsCheckLg style={{ marginRight: '5px' }} /> {children}
				</>
			) : (
				children
			)}
		</Button>
	);
}
