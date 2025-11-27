'use client';

import { Button } from '@mantine/core';
import { BsCheckLg } from 'react-icons/bs';

export type SubmitButtonProps = {
	children: React.ReactNode;
	loading: boolean;
	submitted: boolean;
};

export function SubmitButton({ children, loading, submitted }: SubmitButtonProps) {
	return (
		<Button type='submit' loading={loading}>
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
