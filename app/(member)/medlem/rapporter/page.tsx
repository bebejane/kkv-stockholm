import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';

export default async function Reports({ params }: PageProps<'/medlem/rapporter'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Rapporter</h1>
		</article>
	);
}
