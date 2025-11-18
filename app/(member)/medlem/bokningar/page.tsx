import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';

export default async function Bookings({ params }: PageProps<'/medlem'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Bokningar</h1>
			<Button className={s.newBooking}>Ny bokning</Button>
		</article>
	);
}
