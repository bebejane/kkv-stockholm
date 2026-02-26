'use client';

import s from './Success.module.scss';
import { Button } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BookingSuccessProps = {
	id?: string;
	onReset?: () => void;
};

export function Success({ id, onReset }: BookingSuccessProps) {
	return (
		<section className={s.success}>
			<h3>Tack för din bokning!</h3>
			<p className={s.success}>
				Du har fått ett mail med en bekräftelse på bokningen. Där hittar du också all information om
				hur du rapporterar tid och kostnader.
			</p>
			<Link href={`/medlem/bokningar/${id}`}>
				<Button type='button'>Gå till bokning</Button>
			</Link>
			&nbsp;
			<Link href={`/medlem/bokningar/ny`} replace={true} onClick={onReset}>
				<Button type='button'>Skapa ny bokning</Button>
			</Link>
		</section>
	);
}
