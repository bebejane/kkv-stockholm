'use client';

import s from './SubmitButton.module.scss';
import DotLoader from '@/components/common/DotLoader';
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
		<Button type='submit' disabled={disabled}>
			{submitted && <BsCheckLg style={{ marginRight: '0.2em' }} />}
			{loading ? <DotLoader className={s.loader} dot='·' /> : children}
		</Button>
	);
}
