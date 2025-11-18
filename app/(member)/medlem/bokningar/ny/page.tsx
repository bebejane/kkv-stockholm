import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';

export default async function NewBooking({ params }: PageProps<'/medlem/bokningar/ny'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Ny Bokning</h1>
		</article>
	);
}
